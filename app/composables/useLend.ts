import { erc20Abi, encodeFunctionData } from "viem"
import PWN_CROWDSOURCE_LENDER_VAULT_ABI from "~/assets/abis/v1.5/PWNCrowdsourceLenderVault"
import { PWN_CROWDSOURCE_LENDER_VAULT_ADDRESS } from "~/constants/addresses"
import { CREDIT_ADDRESS } from "~/constants/proposalConstants"
import { useAccount } from "@wagmi/vue"
import { readContract } from "@wagmi/core/actions"
import { wagmiConfig } from "~/config/appkit"
import { sendTransaction, sendBatchTransaction } from "./useTransactions"
import type { ToastStep } from "~/components/ui/toast/useToastsStore"

export default function useLend() {
    const amountInputStore = useAmountInputStore()
    const { address: userAddress, chainId: connectedChainId } = useAccount()

    const checkApprovalNeeded = async () => {
        try {
            const currentAllowance = await readContract(wagmiConfig, {
                abi: erc20Abi,
                functionName: 'allowance',
                args: [userAddress.value!, PWN_CROWDSOURCE_LENDER_VAULT_ADDRESS],
                address: CREDIT_ADDRESS,
                chainId: connectedChainId.value,
            })

            return currentAllowance < amountInputStore.lendAmountBigInt
        } catch (error) {
            console.error('Error checking allowance:', error)
            return true // Assume approval needed if we can't check
        }
    }

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

    const depositWithBatchedApproval = async (approveStep: ToastStep , depositStep: ToastStep) => {
        const calls = []

        // Add approve call
        const approveCallData = encodeFunctionData({
            abi: erc20Abi,
            functionName: 'approve',
            args: [PWN_CROWDSOURCE_LENDER_VAULT_ADDRESS, amountInputStore.lendAmountBigInt],
        })
        
        calls.push({
            to: CREDIT_ADDRESS,
            data: approveCallData,
        })

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

        // Send batch transaction using the new helper function
        const txReceipt = await sendBatchTransaction(calls, {
            steps: [approveStep, depositStep],
            chainId: connectedChainId.value!,
        })
        
        return txReceipt
    }

    return { 
        checkApprovalNeeded,
        approveForDepositIfNeeded, 
        deposit,
        depositWithBatchedApproval,
        withdraw,
        redeemAll
    }
}