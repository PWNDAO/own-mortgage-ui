import { erc20Abi, parseUnits } from "viem"
import PWN_CROWDSOURCE_LENDER_VAULT_ABI from "~/assets/abis/v1.5/PWNCrowdsourceLenderVault"
import { PWN_CROWDSOURCE_LENDER_VAULT_ADDRESS } from "~/constants/addresses"
import { CREDIT_ADDRESS, CREDIT_DECIMALS } from "~/constants/proposalConstants"
import { useAccount } from "@wagmi/vue"
import { estimateGas, readContract, simulateContract } from "@wagmi/core/actions"
import { wagmiConfig } from "~/config/appkit"

export default function useLend() {
    const amountInputStore = useAmountInputStore()
    const { lendAmount } = storeToRefs(amountInputStore)
    const { address: userAddress, chainId: connectedChainId } = useAccount()

    async function createLendingProposal() {
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
            })

            console.log('approvalTxReceipt', approvalTxReceipt)
        }

        const simulation = await simulateContract(wagmiConfig, {
            abi: PWN_CROWDSOURCE_LENDER_VAULT_ABI,
            functionName: 'deposit',
            args: [lendAmountBigInt, userAddress.value!],
            address: PWN_CROWDSOURCE_LENDER_VAULT_ADDRESS,
            chainId: connectedChainId.value,
        })

        console.log('simulation', simulation)

        const estimatedGas = await estimateGas(wagmiConfig, {
            abi: PWN_CROWDSOURCE_LENDER_VAULT_ABI,
            functionName: 'deposit',
            args: [lendAmountBigInt, userAddress.value!],
            address: PWN_CROWDSOURCE_LENDER_VAULT_ADDRESS,
            chainId: connectedChainId.value,
        })

        console.log('estimatedGas', estimatedGas)

        const txReceipt = await sendTransaction({
            abi: PWN_CROWDSOURCE_LENDER_VAULT_ABI,
            functionName: 'deposit',
            args: [lendAmountBigInt, userAddress.value!],
            address: PWN_CROWDSOURCE_LENDER_VAULT_ADDRESS,
            chainId: connectedChainId.value,
        })

        console.log('txReceipt', txReceipt)

        return txReceipt
    }

    return { createLendingProposal }
}