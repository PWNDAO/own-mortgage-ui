import { useLocalStorage } from "@vueuse/core"
import { getAddress } from "viem"
import { PWN_CROWDSOURCE_LENDER_VAULT_ADDRESS } from '~/constants/addresses'
import { readContracts } from "@wagmi/core/actions"
import { wagmiConfig } from '~/config/appkit'
import { PROPOSAL_CHAIN_ID, CREDIT_DECIMALS } from '~/constants/proposalConstants'
import PWN_CROWDSOURCE_LENDER_VAULT_ABI from '~/assets/abis/v1.5/PWNCrowdsourceLenderVault'

// Types for Moralis API response
interface MoralisTransferEvent {
  token_name: string
  token_symbol: string
  token_logo: string | null
  token_decimals: string
  from_address_entity: string | null
  from_address_entity_logo: string | null
  from_address: string
  from_address_label: string | null
  to_address_entity: string | null
  to_address_entity_logo: string | null
  to_address: string
  to_address_label: string | null
  address: string
  block_hash: string
  block_number: string
  block_timestamp: string
  transaction_hash: string
  transaction_index: number
  log_index: number
  value: string
  possible_spam: boolean
  value_decimal: string
  verified_contract: boolean
  security_score: number | null
}

interface MoralisResponse {
  page: number
  page_size: number
  cursor: string | null
  result: MoralisTransferEvent[]
}

interface CrowdsourceLender {
  address: string
  balance: bigint
}

// Moralis API configuration
const MORALIS_BASE_URL = 'https://deep-index.moralis.io/api/v2.2'
const CHAIN = 'sepolia'

// TODO does this caching makes sense? or shall we turn this to tanstack query?
// Local storage for caching
const lastFetchTimestamp = useLocalStorage<null | string>('crowdsource_lender_last_fetch_timestamp', null)
const crowdsourceLendersCache = useLocalStorage<null | CrowdsourceLender[]>('crowdsource_lenders_cache', null)

// Get Moralis API key from environment
const getMoralisApiKey = () => {
  const apiKey = useRuntimeConfig().public.moralisApiKey
  if (!apiKey) {
    throw new Error('NUXT_PUBLIC_MORALIS_API_KEY environment variable is required')
  }
  return apiKey
}

// Fetch transfer events from Moralis API with pagination
const fetchAllTransferEvents = async (fromDate?: string): Promise<MoralisTransferEvent[]> => {
  const apiKey = getMoralisApiKey()
  const allEvents: MoralisTransferEvent[] = []
  let cursor: string | null = null
  let page = 0

  do {
    const url = new URL(`${MORALIS_BASE_URL}/erc20/${PWN_CROWDSOURCE_LENDER_VAULT_ADDRESS}/transfers`)
    url.searchParams.set('chain', CHAIN)
    url.searchParams.set('order', 'DESC')
    url.searchParams.set('page_size', '100')
    
    if (fromDate) {
      url.searchParams.set('from_date', fromDate)
    }
    
    if (cursor) {
      url.searchParams.set('cursor', cursor)
    }

    const response = await fetch(url.toString(), {
      headers: {
        'accept': 'application/json',
        'X-API-Key': apiKey
      }
    })

    if (!response.ok) {
      throw new Error(`Moralis API error: ${response.status} ${response.statusText}`)
    }

    const data: MoralisResponse = await response.json()
    allEvents.push(...data.result)
    
    cursor = data.cursor
    page++
    
    // Safety check to prevent infinite loops
    if (page > 10000) {
      console.warn('Reached maximum page limit (10000) for transfer events')
      break
    }
    
  } while (cursor)

  return allEvents
}

// Round balance to nearest integer (rounds to nearest 10^CREDIT_DECIMALS)
const roundToNearestInteger = (balance: bigint): bigint => {
  const decimals = BigInt(CREDIT_DECIMALS)
  const decimalUnit = 10n ** decimals
  const half = decimalUnit / 2n
  // Round to nearest integer: (balance + half) / decimalUnit * decimalUnit
  return ((balance + half) / decimalUnit) * decimalUnit
}

// Convert balances to lender array
const balancesToLenders = (balances: Record<string, bigint>): CrowdsourceLender[] => {
  return Object.entries(balances)
    .map(([address, balance]) => ({
      address,
      balance: roundToNearestInteger(balance) // Round to nearest integer
    }))
    .sort((a, b) => {
      // Sort by balance descending
      if (a.balance > b.balance) return -1
      if (a.balance < b.balance) return 1
      return 0
    })
}

// Calculate lender balances from transfer events
// Converts shares to assets using convertToAssets contract function
const calculateLenderBalances = async (events: MoralisTransferEvent[]): Promise<Record<string, bigint>> => {
  const balances: Record<string, bigint> = {}
  
  // Convert shares to assets in batches of 25
  const BATCH_SIZE = 25
  const shareValues: bigint[] = []
  const eventIndices: number[] = []
  
  // Collect all share values and their indices
  for (let i = 0; i < events.length; i++) {
    const event = events[i]
    if (!event) continue
    const value = BigInt(event.value)
    shareValues.push(value)
    eventIndices.push(i)
  }
  
  // Process in batches
  const assetValues: bigint[] = new Array(events.length).fill(0n)
  
  for (let i = 0; i < shareValues.length; i += BATCH_SIZE) {
    const batch = shareValues.slice(i, i + BATCH_SIZE)
    const batchIndices = eventIndices.slice(i, i + BATCH_SIZE)
    
    // Create contracts array for this batch
    const contracts = batch.map((shares) => ({
      abi: PWN_CROWDSOURCE_LENDER_VAULT_ABI,
      address: PWN_CROWDSOURCE_LENDER_VAULT_ADDRESS,
      functionName: 'convertToAssets' as const,
      args: [shares] as const,
      chainId: PROPOSAL_CHAIN_ID,
    }))
    
    // Call convertToAssets for the batch
    const results = await readContracts(wagmiConfig, {
      contracts,
      allowFailure: false,
    })
    
    // Store the converted asset values
    for (let j = 0; j < batch.length; j++) {
      const eventIndex = batchIndices[j]
      const result = results[j]
      if (eventIndex !== undefined && result !== undefined) {
        assetValues[eventIndex] = result as bigint
      }
    }
  }

  // Now process events with asset values instead of share values
  for (let i = 0; i < events.length; i++) {
    const event = events[i]
    if (!event) continue
    const value = assetValues[i] ?? 0n // Use converted asset value instead of share value
    const fromAddress = getAddress(event.from_address)
    const toAddress = getAddress(event.to_address)

    // Skip zero address transfers (minting/burning)
    if (fromAddress === '0x0000000000000000000000000000000000000000') {
      // Minting - add to recipient
      if (!balances[toAddress]) {
        balances[toAddress] = 0n
      }
      balances[toAddress] += value
    } else if (toAddress === '0x0000000000000000000000000000000000000000') {
      // Burning - subtract from sender
      if (!balances[fromAddress]) {
        balances[fromAddress] = 0n
      }
      balances[fromAddress] -= value
    } else {
      // Regular transfer
      if (!balances[fromAddress]) {
        balances[fromAddress] = 0n
      }
      if (!balances[toAddress]) {
        balances[toAddress] = 0n
      }
      
      balances[fromAddress] -= value
      balances[toAddress] += value
    }
  }

  // Remove addresses with zero or negative balances
  return Object.fromEntries(
    Object.entries(balances).filter(([_, balance]) => balance > 0n)
  )
}

// Merge cached balances with new transfer events
const mergeBalances = async (
  cachedLenders: CrowdsourceLender[] | null,
  newEvents: MoralisTransferEvent[]
): Promise<CrowdsourceLender[]> => {
  // Convert cached lenders to balance map
  const cachedBalances: Record<string, bigint> = {}
  if (cachedLenders) {
    for (const lender of cachedLenders) {
      cachedBalances[lender.address.toLowerCase()] = lender.balance
    }
  }

  // Calculate changes from new events
  const balanceChanges = await calculateLenderBalances(newEvents)

  // Merge cached balances with new changes
  const mergedBalances: Record<string, bigint> = { ...cachedBalances }

  for (const [address, change] of Object.entries(balanceChanges)) {
    const normalizedAddress = address.toLowerCase()
    if (mergedBalances[normalizedAddress]) {
      mergedBalances[normalizedAddress] += change
    } else {
      mergedBalances[normalizedAddress] = change
    }
  }

  // Remove addresses with zero or negative balances
  const finalBalances = Object.fromEntries(
    Object.entries(mergedBalances).filter(([_, balance]) => balance > 0n)
  )

  return balancesToLenders(finalBalances)
}

export const loadCrowdsourceLenders = async (forceRefresh: boolean = false) => {
  try {
    const fromDate = forceRefresh ? undefined : (lastFetchTimestamp.value?.length ? lastFetchTimestamp.value : undefined)
    
    // Fetch new transfer events
    const events = await fetchAllTransferEvents(fromDate)
    
    if (events.length === 0 && !forceRefresh) {
      // No new events and not forcing refresh, keep existing cache
      return crowdsourceLendersCache.value || []
    }

    let mergedLenders: CrowdsourceLender[]

    if (fromDate && crowdsourceLendersCache.value && !forceRefresh) {
      // Incremental update: merge cached data with new events
      mergedLenders = await mergeBalances(crowdsourceLendersCache.value, events)
    } else {
      // Full refresh: calculate all balances from all events
      const allEvents = await fetchAllTransferEvents() // Fetch all events for full refresh
      const balances = await calculateLenderBalances(allEvents)
      mergedLenders = balancesToLenders(balances)
    }

    // Update cache
    crowdsourceLendersCache.value = mergedLenders
    lastFetchTimestamp.value = new Date().toISOString()

    return mergedLenders
  } catch (error) {
    console.error('Error loading crowdsource lenders:', error)
    throw error
  }
}

export const getCrowdsourceLenders = async (): Promise<CrowdsourceLender[]> => {
  // Return cached data if available, otherwise load fresh data
  if (crowdsourceLendersCache.value) {
    return crowdsourceLendersCache.value
  }
  
  return await loadCrowdsourceLenders()
}

export const useCrowdsourceLender = () => {
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const lenders = ref<CrowdsourceLender[]>([])

  // Load lenders on composable initialization
  // TODO change forceRefresh to false
  const loadLenders = async (forceRefresh: boolean = true) => {
    if (isLoading.value) return

    isLoading.value = true
    error.value = null

    try {
      const result = await loadCrowdsourceLenders(forceRefresh)
      lenders.value = result
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load crowdsource lenders'
      console.error('Error in useCrowdsourceLender:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Computed properties
  const totalLenders = computed(() => lenders.value.length)

  // Auto-load on mount
  onMounted(() => {
    loadLenders()
  })

  return {
    // Data
    lenders: readonly(lenders),
    totalLenders,
    lastFetchTime: readonly(lastFetchTimestamp),
    
    // State
    isLoading: readonly(isLoading),
    error: readonly(error),
    
    // Methods
    loadLenders,
    refreshLenders: () => loadLenders(true),
    getCrowdsourceLenders
  }
}
