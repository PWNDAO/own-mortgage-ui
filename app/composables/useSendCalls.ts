import { useMutation } from '@tanstack/vue-query'
import { getCapabilities, sendCalls, waitForCallsStatus } from '@wagmi/core'
import type { Address, Call, Capabilities } from 'viem'
import { ref, watchEffect } from 'vue'
import { getWagmiConfig } from '~/config/appkit'
import { PROPOSAL_CHAIN_ID } from '~/constants/proposalConstants'
import { useAccount } from '@wagmi/vue'
import type { ToastStep } from '~/components/ui/toast/useToastsStore'

export const canSendCalls = async (userAddress: Address) => {
    let capabilities: Capabilities | undefined

    try {
        // Check if wallet supports batch transactions
        capabilities = await getCapabilities(getWagmiConfig(), {
            account: userAddress,
            chainId: PROPOSAL_CHAIN_ID,
        })
    } catch (error) {

        console.error('Error getting capabilities', error)
    }

    const okStatus = ['ready', 'supported']

    const supportsBatchTransactions =
        okStatus.includes(capabilities?.[PROPOSAL_CHAIN_ID]?.atomic?.status ?? '') ||
        capabilities?.[PROPOSAL_CHAIN_ID]?.atomicBatch?.supported ||
        capabilities?.atomicBatch?.supported ||
        capabilities?.atomic?.supported ||
        okStatus.includes(capabilities?.atomicBatch?.status ?? '') ||
        okStatus.includes(capabilities?.atomic?.status ?? '')

    return supportsBatchTransactions
}

export const useSendCalls = () => {
    const { address: userAddress, chainId: connectedChainId } = useAccount()

    const isWalletSupportsSendCalls = ref(false)

    // TODO test this with multisig?
    const handleMutation = async ({ calls, step = undefined }: { calls: Call[], step?: ToastStep }) => {
        if (!userAddress.value) {
            throw new Error('Wallet address is missing. Please connect your wallet before sending transactions.')
        }
        // TODO do we also need to handle here switching of the chain?
        try {
            const { id: batchId } = await sendCalls(getWagmiConfig(), {
                calls,
                account: userAddress.value,
                chainId: PROPOSAL_CHAIN_ID,
            })
            const status = await waitForCallsStatus(getWagmiConfig(), {
                id: batchId,
                timeout: 150_000, // 150 seconds
            })
            if (step) {
                step.txHash = status?.receipts?.[0]?.transactionHash
            }
            return status
        } catch (error) {
            console.error('Error sending calls', error)
            throw error
        }
    }

    const sendCallsMutation = useMutation({
        mutationKey: ['sendCalls'],
        mutationFn: handleMutation,
    })

    watchEffect(async () => {
        if (!userAddress.value || !connectedChainId.value) return

        try {
            isWalletSupportsSendCalls.value = await canSendCalls(userAddress.value)
        } catch (error) {

            console.error('Error checking if user can send calls', error)
            isWalletSupportsSendCalls.value = false
        }
    })

    return {
        sendCallsMutation,
        isWalletSupportsSendCalls,
    }
}
