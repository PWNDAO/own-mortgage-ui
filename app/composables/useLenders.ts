import { PWN_CROWDSOURCE_LENDER_VAULT_ADDRESS } from '~/constants/addresses'

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

// Types for lender data
export interface Lender {
  address: string
  balance: bigint
}

interface CachedLendersData {
  lenders: Record<string, bigint>
  lastFetchTimestamp: string
  totalTransfersProcessed: number
}

// TODO why do we have there useLenders and useCrowdsourceLender?

// Cache key for localStorage
const CACHE_KEY = 'pwn_lenders_data'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

// Moralis API configuration
const MORALIS_BASE_URL = 'https://deep-index.moralis.io/api/v2.2'
const CHAIN = 'sepolia'

export const useLenders = () => {
  const lenders = ref<Lender[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const lastFetchTime = ref<string | null>(null)

  // Get Moralis API key from environment
  const getMoralisApiKey = () => {
    const apiKey = process.env.NUXT_PUBLIC_MORALIS_API_KEY
    if (!apiKey) {
      throw new Error('MORALIS_API_KEY environment variable is required')
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
      if (page > 1000) {
        console.warn('Reached maximum page limit (1000) for transfer events')
        break
      }
      
    } while (cursor)

    return allEvents
  }

  // Calculate lender balances from transfer events
  const calculateLenderBalances = (events: MoralisTransferEvent[]): Record<string, bigint> => {
    const balances: Record<string, bigint> = {}

    for (const event of events) {
      // TODO if the value is in shares, we need to convert it to assets...
      //  or is there some better way how to fetch the lenders balances?
      const value = BigInt(event.value)
      const fromAddress = event.from_address.toLowerCase()
      const toAddress = event.to_address.toLowerCase()

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

  // Load cached data
  const loadCachedData = (): CachedLendersData | null => {
    //if (process.client) {
      try {
        const cached = localStorage.getItem(CACHE_KEY)
        if (cached) {
          const parsed = JSON.parse(cached) as CachedLendersData
          const cacheAge = Date.now() - new Date(parsed.lastFetchTimestamp).getTime()
          
          if (cacheAge < CACHE_DURATION) {
            return parsed
          }
        }
      } catch (error) {
        console.warn('Failed to load cached lenders data:', error)
      }
    //}
    return null
  }

  // Save data to cache
  const saveToCache = (data: CachedLendersData) => {
    // if (process.client) {
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data))
      } catch (error) {
        console.warn('Failed to save lenders data to cache:', error)
      }
    //}
  }

  // Convert balances to lender array
  const balancesToLenders = (balances: Record<string, bigint>): Lender[] => {
    return Object.entries(balances)
      .map(([address, balance]) => ({
        address,
        balance,
      }))
      .sort((a, b) => {
        // Sort by balance descending
        if (a.balance > b.balance) return -1
        if (a.balance < b.balance) return 1
        return 0
      })
  }

  // Main function to fetch lenders
  const fetchLenders = async (forceRefresh: boolean = false) => {
    if (isLoading.value) return

    isLoading.value = true
    error.value = null

    try {
      // Try to load from cache first (unless force refresh)
      if (!forceRefresh) {
        const cached = loadCachedData()
        if (cached) {
          lenders.value = balancesToLenders(cached.lenders)
          lastFetchTime.value = cached.lastFetchTimestamp
          isLoading.value = false
          return
        }
      }

      // Determine from_date for incremental updates
      let fromDate: string | undefined
      const cached = loadCachedData()
      if (cached && !forceRefresh) {
        fromDate = cached.lastFetchTimestamp
      }

      // Fetch all transfer events
      const events = await fetchAllTransferEvents(fromDate)
      
      if (events.length === 0) {
        // No new events, use cached data if available
        if (cached) {
          lenders.value = balancesToLenders(cached.lenders)
          lastFetchTime.value = cached.lastFetchTimestamp
        }
        isLoading.value = false
        return
      }

      // Calculate balances
      const newBalances = calculateLenderBalances(events)
      
      // Merge with existing cached balances if doing incremental update
      let finalBalances = newBalances
      if (cached && fromDate) {
        // For incremental updates, we need to recalculate from all events
        // since we can't easily merge partial transfer data
        const allEvents = await fetchAllTransferEvents()
        finalBalances = calculateLenderBalances(allEvents)
      }

      // Convert to lender array
      lenders.value = balancesToLenders(finalBalances)
      lastFetchTime.value = new Date().toISOString()

      // Save to cache
      const cacheData: CachedLendersData = {
        lenders: finalBalances,
        lastFetchTimestamp: lastFetchTime.value,
        totalTransfersProcessed: events.length
      }
      saveToCache(cacheData)

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch lenders'
      console.error('Error fetching lenders:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Computed properties
  const totalLenders = computed(() => lenders.value.length)

  // Auto-fetch on composable initialization
  onMounted(() => {
    fetchLenders()
  })

  return {
    // Data
    lenders: readonly(lenders),
    totalLenders,
    lastFetchTime: readonly(lastFetchTime),
    
    // State
    isLoading: readonly(isLoading),
    error: readonly(error),
    
    // Methods
    fetchLenders,
    refreshLenders: () => fetchLenders(true)
  }
}

