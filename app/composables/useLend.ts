import { erc20Abi, encodeFunctionData } from "viem"
import PWN_CROWDSOURCE_LENDER_VAULT_ABI from "~/assets/abis/v1.5/PWNCrowdsourceLenderVault"
import { PWN_CROWDSOURCE_LENDER_VAULT_ADDRESS } from "~/constants/addresses"
import { CREDIT_ADDRESS } from "~/constants/proposalConstants"
import { useAccount } from "@wagmi/vue"
import { readContract, sendCalls, waitForTransactionReceipt } from "@wagmi/core/actions"
import { wagmiConfig } from "~/config/appkit"
import { sendTransaction } from "./useTransactions"
import type { ToastStep } from "~/components/ui/toast/useToastsStore"

export default function useLend() {
    const amountInputStore = useAmountInputStore()
    const { address: userAddress, chainId: connectedChainId } = useAccount()

    const approveForDepositIfNeeded = async (step: ToastStep) => {
        const currentAllowance = await readContract(wagmiConfig, {
            abi: erc20Abi,
            functionName: 'allowance',
            args: [userAddress.value!, PWN_CROWDSOURCE_LENDER_VAULT_ADDRESS],
            address: CREDIT_ADDRESS,
            chainId: connectedChainId.value,
        })

        if (currentAllowance < amountInputStore.lendAmountBigInt) {
            await sendTransaction({
                abi: erc20Abi,
                functionName: 'approve',
                args: [PWN_CROWDSOURCE_LENDER_VAULT_ADDRESS, amountInputStore.lendAmountBigInt],
                address: CREDIT_ADDRESS,
                chainId: connectedChainId.value,
            }, { step })
        }

        return true
    }

    const withdraw = async (withdrawAmount: bigint, step: ToastStep) => {
        const withdrawTxReceipt = await sendTransaction({
            abi: PWN_CROWDSOURCE_LENDER_VAULT_ABI,
            functionName: 'withdraw',
            args: [withdrawAmount, userAddress.value!, userAddress.value!],
            address: PWN_CROWDSOURCE_LENDER_VAULT_ADDRESS,
            chainId: connectedChainId.value,
        }, { step })
        return withdrawTxReceipt
    }

    const redeemAll = async (withdrawAmount: bigint, step: ToastStep) => {
        const withdrawAllTxReceipt = await sendTransaction({
            abi: PWN_CROWDSOURCE_LENDER_VAULT_ABI,
            functionName: 'redeem',
            args: [withdrawAmount, userAddress.value!, userAddress.value!], 
            address: PWN_CROWDSOURCE_LENDER_VAULT_ADDRESS,
            chainId: connectedChainId.value,
        }, { step })
        return withdrawAllTxReceipt
    }

    const deposit = async (step: ToastStep) => {
        const txReceipt = await sendTransaction({
            abi: PWN_CROWDSOURCE_LENDER_VAULT_ABI,
            functionName: 'deposit',
            args: [amountInputStore.amountToDepositAdditionally, userAddress.value!],
            address: PWN_CROWDSOURCE_LENDER_VAULT_ADDRESS,
            chainId: connectedChainId.value,
        }, { step })
        return txReceipt
    }

    const depositWithBatchedApproval = async (step: ToastStep) => {
        try {
            const calls = []
            
            // Check if approval is needed
            const currentAllowance = await readContract(wagmiConfig, {
                abi: erc20Abi,
                functionName: 'allowance',
                args: [userAddress.value!, PWN_CROWDSOURCE_LENDER_VAULT_ADDRESS],
                address: CREDIT_ADDRESS,
                chainId: connectedChainId.value,
            })

            // Add approve call if needed
            if (currentAllowance < amountInputStore.lendAmountBigInt) {
                const approveCallData = encodeFunctionData({
                    abi: erc20Abi,
                    functionName: 'approve',
                    args: [PWN_CROWDSOURCE_LENDER_VAULT_ADDRESS, amountInputStore.lendAmountBigInt],
                })
                
                calls.push({
                    to: CREDIT_ADDRESS,
                    data: approveCallData,
                })
            }

            // Add deposit call
            const depositCallData = encodeFunctionData({
                abi: PWN_CROWDSOURCE_LENDER_VAULT_ABI,
                functionName: 'deposit',
                args: [amountInputStore.amountToDepositAdditionally, userAddress.value!],
            })
            
            calls.push({
                to: PWN_CROWDSOURCE_LENDER_VAULT_ADDRESS,
                data: depositCallData,
            })

            // Try to send batched calls
            const { id: batchId } = await sendCalls(wagmiConfig, {
                calls,
                chainId: connectedChainId.value,
            })
            
            // Update step with batch ID
            step.txHash = batchId as `0x${string}`
            
            // Wait for batch to complete
            const txReceipt = await waitForTransactionReceipt(wagmiConfig, {
                hash: batchId as `0x${string}`,
                chainId: connectedChainId.value,
            })
            
            return txReceipt
        } catch (error) {
            console.error(error);
            // Fallback: if wallet doesn't support sendCalls, use traditional two-step approach
            console.warn('Wallet does not support batched transactions (EIP-5792), falling back to sequential transactions', error)
            
            // First approve if needed
            await approveForDepositIfNeeded(step)
            
            // Then deposit
            const txReceipt = await sendTransaction({
                abi: PWN_CROWDSOURCE_LENDER_VAULT_ABI,
                functionName: 'deposit',
                args: [amountInputStore.amountToDepositAdditionally, userAddress.value!],
                address: PWN_CROWDSOURCE_LENDER_VAULT_ADDRESS,
                chainId: connectedChainId.value,
            }, { step })
            
            return txReceipt
        }
    }

    return { 
        approveForDepositIfNeeded, 
        deposit,
        depositWithBatchedApproval,
        withdraw,
        redeemAll
    }
}