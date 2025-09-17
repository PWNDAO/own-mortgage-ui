import { useQuery, useQueryClient } from "@tanstack/vue-query"
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

interface LendersData {
  lenders: Record<string, bigint>
  lastFetchTimestamp: string
  totalTransfersProcessed: number
}

// Moralis API configuration
const MORALIS_BASE_URL = 'https://deep-index.moralis.io/api/v2.2'
const CHAIN = 'sepolia'

// Query keys
const QUERY_KEYS = {
  lenders: ['lenders'] as const,
  transferEvents: (fromDate?: string) => ['transfer-events', fromDate] as const,
  lendersData: ['lenders-data'] as const,
} as const

// Get Moralis API key from environment
const getMoralisApiKey = () => {
  const apiKey = process.env.NUXT_PUBLIC_MORALIS_API_KEY
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

// Convert balances to lender array
const balancesToLenders = (balances: Record<string, bigint>): Lender[] => {
  return Object.entries(balances)
    .map(([address, balance]) => ({
      address,
      balance
    }))
    .sort((a, b) => {
      // Sort by balance descending
      if (a.balance > b.balance) return -1
      if (a.balance < b.balance) return 1
      return 0
    })
}

// Query function to fetch all transfer events
const fetchTransferEventsQuery = async (fromDate?: string): Promise<MoralisTransferEvent[]> => {
  return await fetchAllTransferEvents(fromDate)
}

// Query function to fetch and process lenders data
const fetchLendersDataQuery = async (): Promise<LendersData> => {
  const events = await fetchAllTransferEvents()
  const balances = calculateLenderBalances(events)
  
  return {
    lenders: balances,
    lastFetchTimestamp: new Date().toISOString(),
    totalTransfersProcessed: events.length
  }
}

// Query function for incremental updates
const fetchIncrementalLendersDataQuery = async (fromDate: string): Promise<LendersData> => {
  const events = await fetchAllTransferEvents(fromDate)
  
  if (events.length === 0) {
    // No new events, return empty data
    return {
      lenders: {},
      lastFetchTimestamp: fromDate,
      totalTransfersProcessed: 0
    }
  }
  
  const balances = calculateLenderBalances(events)
  
  return {
    lenders: balances,
    lastFetchTimestamp: new Date().toISOString(),
    totalTransfersProcessed: events.length
  }
}

export const useLendersQuery = () => {
  const queryClient = useQueryClient()

  // Main query for lenders data with persistence
  const {
    data: lendersData,
    isLoading: isLoadingLenders,
    error: lendersError,
    refetch: refetchLenders,
    isRefetching: isRefetchingLenders
  } = useQuery({
    queryKey: QUERY_KEYS.lendersData,
    queryFn: fetchLendersDataQuery,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })

  // Computed lenders array
  const lenders = computed(() => {
    if (!lendersData.value) return []
    return balancesToLenders(lendersData.value.lenders)
  })

  // Computed properties
  const totalLenders = computed(() => lenders.value.length)
  const totalSupply = computed(() => {
    return lenders.value.reduce((sum, lender) => sum + lender.balance, 0n)
  })

  // Function to refresh with incremental updates
  const refreshLenders = async () => {
    if (!lendersData.value) {
      // No cached data, do full refresh
      return await refetchLenders()
    }

    // Try incremental update first
    try {
      const incrementalData = await queryClient.fetchQuery({
        queryKey: QUERY_KEYS.transferEvents(lendersData.value.lastFetchTimestamp),
        queryFn: () => fetchIncrementalLendersDataQuery(lendersData.value!.lastFetchTimestamp),
        staleTime: 0, // Always fetch fresh data for incremental updates
      })

      if (incrementalData.totalTransfersProcessed > 0) {
        // Merge incremental data with existing data
        const mergedLenders = { ...lendersData.value.lenders }
        
        // Apply incremental changes
        Object.entries(incrementalData.lenders).forEach(([address, balance]) => {
          if (mergedLenders[address]) {
            mergedLenders[address] += balance
          } else {
            mergedLenders[address] = balance
          }
        })

        // Remove zero balances
        const finalLenders = Object.fromEntries(
          Object.entries(mergedLenders).filter(([_, balance]) => balance > 0n)
        )

        // Update the cache with merged data
        queryClient.setQueryData(QUERY_KEYS.lendersData, {
          lenders: finalLenders,
          lastFetchTimestamp: incrementalData.lastFetchTimestamp,
          totalTransfersProcessed: lendersData.value.totalTransfersProcessed + incrementalData.totalTransfersProcessed
        })
      }
    } catch (error) {
      console.warn('Incremental update failed, falling back to full refresh:', error)
      // Fallback to full refresh
      return await refetchLenders()
    }
  }

  // Function to force full refresh
  const forceRefresh = async () => {
    return await refetchLenders()
  }

  // Invalidate and refetch all related queries
  const invalidateAll = async () => {
    await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lenders })
    await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lendersData })
    await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transferEvents() })
  }

  return {
    // Data
    lenders: readonly(lenders),
    lendersData: readonly(lendersData),
    totalLenders,
    totalSupply,
    lastFetchTime: computed(() => lendersData.value?.lastFetchTimestamp || null),
    
    // Loading states
    isLoading: readonly(isLoadingLenders),
    isRefetching: readonly(isRefetchingLenders),
    error: readonly(lendersError),
    
    // Methods
    refreshLenders,
    forceRefresh,
    invalidateAll,
    
    // Query client access for advanced usage
    queryClient
  }
}

// Additional composable for just transfer events (useful for debugging)
export const useTransferEventsQuery = (fromDate?: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.transferEvents(fromDate),
    queryFn: () => fetchTransferEventsQuery(fromDate),
    enabled: !!fromDate, // Only run if fromDate is provided
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  })
}

