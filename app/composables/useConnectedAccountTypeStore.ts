import { useReadContract, useAccount } from '@wagmi/vue'
import { computed } from 'vue'
import { defineStore } from 'pinia'
import { SAFE_WALLET_ABI } from '~/assets/abis/SafeWalletAbi'
import { PROPOSAL_CHAIN_ID } from '~/constants/proposalConstants'

export const useConnectedAccountTypeStore = defineStore('connectedAccountType', () => {
  const { address: userAddress, isConnected } = useAccount()

  const { data: safeThreshold, isError: isSafeReadError } = useReadContract({
    address: userAddress,
    abi: SAFE_WALLET_ABI,
    functionName: 'getThreshold',
    query: {
      enabled: isConnected,
      staleTime: Infinity,
      retry: 1,
    },
    chainId: PROPOSAL_CHAIN_ID,
  })

  const isConnectedContractWallet = computed(() => !isSafeReadError.value && safeThreshold.value && safeThreshold.value >= 1)

  return {
    safeThreshold,
    isConnectedContractWallet,
  }
})
