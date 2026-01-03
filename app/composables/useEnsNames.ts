import { getEnsName } from '@wagmi/core/actions'
import { getWagmiConfig } from '~/config/appkit'
import { mainnet } from 'viem/chains'
import { useQuery } from '@tanstack/vue-query'
import type { Address } from 'viem'

/**
 * Fetches ENS names for multiple addresses in parallel
 * Uses wagmi's getEnsName internally for batch fetching
 * Returns a map of normalized address -> ENS name (or null if no ENS)
 * 
 * Note: For a single address, use wagmi's useEnsName composable instead
 */
export const useEnsNames = (addresses: Ref<Address[]> | Address[]) => {
  const addressesRef = typeof addresses === 'object' && 'value' in addresses
    ? addresses
    : computed(() => addresses as Address[])

  // Create a stable key from sorted, normalized addresses
  const queryKey = computed(() => {
    if (!addressesRef.value || addressesRef.value.length === 0) {
      return ['ensNames', []]
    }
    // Normalize addresses to lowercase and sort for stable key
    const normalized = addressesRef.value
      .map(addr => addr.toLowerCase() as Address)
      .sort()
    return ['ensNames', normalized]
  })

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!addressesRef.value || addressesRef.value.length === 0) {
        return new Map<string, string | null>()
      }

      // Fetch all ENS names in parallel
      const results = await Promise.allSettled(
        addressesRef.value.map(async (address) => {
          try {
            const ensName = await getEnsName(getWagmiConfig(), {
              address,
              chainId: mainnet.id,
            })
            return { address, ensName: ensName || null }
          } catch (error) {
            console.debug(`ENS lookup failed for ${address}:`, error)
            return { address, ensName: null }
          }
        })
      )

      // Build a map of normalized address -> ENS name
      const ensMap = new Map<string, string | null>()
      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          // Normalize address to lowercase for consistent lookup
          const normalized = result.value.address.toLowerCase()
          ensMap.set(normalized, result.value.ensName)
        }
      })

      return ensMap
    },
    enabled: computed(() => addressesRef.value.length > 0),
    staleTime: Infinity, // ENS names don't change frequently, cache forever
    gcTime: Infinity, // Keep in cache forever
    retry: 3, // Retry up to 3 times
  })
}

