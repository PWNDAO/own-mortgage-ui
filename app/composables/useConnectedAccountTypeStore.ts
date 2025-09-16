import { useReadContract, useAccount } from '@wagmi/vue'
import { computed } from 'vue'
import { defineStore } from 'pinia'
import { parseAbi } from 'viem'

export const useConnectedAccountTypeStore = defineStore('connectedAccountType', () => {
  const { address: userAddress, chainId: connectedChainId, isConnected } = useAccount()

  const { data: safeOwners, isError: isSafeReadError } = useReadContract({
    address: userAddress,
    abi: parseAbi([
      'function getThreshold() external view returns (uint256)',
    ]),
    functionName: 'getThreshold',
    query: {
      enabled: isConnected,
      staleTime: Infinity,
      retry: 1,
    },
    chainId: connectedChainId,
  })

  const isConnectedContractWallet = computed(() => !isSafeReadError.value && safeOwners.value && safeOwners.value >= 1)

  return {
    isConnectedContractWallet,
  }
})
