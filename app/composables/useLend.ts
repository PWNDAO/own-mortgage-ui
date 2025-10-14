import { encodeFunctionData, erc20Abi, parseUnits } from "viem"
import PWN_CROWDSOURCE_LENDER_VAULT_ABI from "~/assets/abis/v1.5/PWNCrowdsourceLenderVault"
import { PWN_CROWDSOURCE_LENDER_VAULT_ADDRESS } from "~/constants/addresses"
import { CREDIT_ADDRESS, CREDIT_DECIMALS } from "~/constants/proposalConstants"
import { useAccount } from "@wagmi/vue"
import { estimateGas, readContract, simulateContract } from "@wagmi/core/actions"
import { wagmiConfig } from "~/config/appkit"
import { sendTransaction } from "./useTransactions"
import type { ToastStep } from "~/components/ui/toast/useToastsStore"

export default function useLend() {
    const amountInputStore = useAmountInputStore()
    const { lendAmount } = storeToRefs(amountInputStore)
    const { address: userAddress, chainId: connectedChainId } = useAccount()

    const approveForDepositIfNeeded = async (step: ToastStep) => {
        const lendAmountBigInt = parseUnits(lendAmount.value, CREDIT_DECIMALS)

        const currentAllowance = await readContract(wagmiConfig, {
            abi: erc20Abi,
            functionName: 'allowance',
            args: [userAddress.value!, PWN_CROWDSOURCE_LENDER_VAULT_ADDRESS],
            address: CREDIT_ADDRESS,
            chainId: connectedChainId.value,
        })

        console.log('currentAllowance', currentAllowance)

        if (currentAllowance < lendAmountBigInt) {
            const approvalTxReceipt = await sendTransaction({
                abi: erc20Abi,
                functionName: 'approve',
                args: [PWN_CROWDSOURCE_LENDER_VAULT_ADDRESS, lendAmountBigInt],
                address: CREDIT_ADDRESS,
                chainId: connectedChainId.value,
            }, { step })

            console.log('approvalTxReceipt', approvalTxReceipt)
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

    const deposit = async (step: ToastStep) => {
        const lendAmountBigInt = parseUnits(lendAmount.value, CREDIT_DECIMALS)

        const simulation = await simulateContract(wagmiConfig, {
            abi: PWN_CROWDSOURCE_LENDER_VAULT_ABI,
            functionName: 'deposit',
            args: [lendAmountBigInt, userAddress.value!],
            address: PWN_CROWDSOURCE_LENDER_VAULT_ADDRESS,
            chainId: connectedChainId.value,
        })

        console.log('simulation', simulation)

        const depositTxData = encodeFunctionData({
            abi: PWN_CROWDSOURCE_LENDER_VAULT_ABI,
            functionName: 'deposit',
            args: [lendAmountBigInt, userAddress.value!],
        })

        // TODO do we need to do these manually?
        const estimatedGas = await estimateGas(wagmiConfig, {
            data: depositTxData,
            chainId: connectedChainId.value,
            to: PWN_CROWDSOURCE_LENDER_VAULT_ADDRESS,
        })

        console.log('estimatedGas', estimatedGas)

        const txReceipt = await sendTransaction({
            abi: PWN_CROWDSOURCE_LENDER_VAULT_ABI,
            functionName: 'deposit',
            args: [lendAmountBigInt, userAddress.value!],
            address: PWN_CROWDSOURCE_LENDER_VAULT_ADDRESS,
            chainId: connectedChainId.value,
        }, { step })

        console.log('txReceipt', txReceipt)

        return txReceipt
    }

    return { 
        approveForDepositIfNeeded, 
        deposit,
        withdraw
    }
}