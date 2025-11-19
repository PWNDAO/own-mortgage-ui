import { erc20Abi, formatUnits, parseUnits, zeroAddress, type ContractFunctionArgs } from "viem"
import { PWN_CROWDSOURCE_LENDER_VAULT_ADDRESS, PWN_INSTALLMENTS_PRODUCT_ADDRESS, PWN_LOAN_ADDRESS } from "~/constants/addresses"
import { COLLATERAL_ADDRESS, COLLATERAL_DECIMALS, CREDIT_ADDRESS, PROPOSAL_CHAIN_ID } from "~/constants/proposalConstants"
import { useAccount } from "@wagmi/vue"
import { readContract, simulateContract } from "@wagmi/core/actions"
import { wagmiConfig } from "~/config/appkit"
import { sendTransaction } from "./useTransactions"
import type { ToastStep } from "~/components/ui/toast/useToastsStore"
import PWN_LOAN_ABI from "~/assets/abis/v1.5/PWNLoan"
import PWN_INSTALLMENTS_PRODUCT_ABI from "~/assets/abis/v1.5/PWNInstallmentsProduct"
import { proposal } from "~/lib/decode-proposal"
import Decimal from "decimal.js"

export default function useBorrow() {

    const { address: userAddress, chainId: connectedChainId } = useAccount()

    const getCollateralAmountFromCreditAmount = async (creditAmount: bigint) => {
        return await readContract(wagmiConfig, {
            abi: PWN_INSTALLMENTS_PRODUCT_ABI,
            functionName: 'getCollateralAmount',
            address: PWN_INSTALLMENTS_PRODUCT_ADDRESS,
            chainId: PROPOSAL_CHAIN_ID,
            args: [
                CREDIT_ADDRESS, 
                creditAmount,
                COLLATERAL_ADDRESS,
                proposal.feedIntermediaryDenominations,
                proposal.feedInvertFlags,
                proposal.loanToValue
             ],
        })
    }

    const approveForAcceptIfNeeded = async (step: ToastStep, creditAmount: bigint) => {
        const collateralAmount = await getCollateralAmountFromCreditAmount(creditAmount)

        const currentAllowance = await readContract(wagmiConfig, {
            abi: erc20Abi,
            functionName: 'allowance',
            args: [userAddress.value!, PWN_LOAN_ADDRESS],
            address: COLLATERAL_ADDRESS,
            chainId: connectedChainId.value,
        })

        if (currentAllowance < collateralAmount) {
            // we are applying 1% buffer to the collateral amount when approving to not throw error when price of the collateral
            //  or credit would change in the time between approving and accepting the proposal...
            const buffer = new Decimal(formatUnits(collateralAmount, COLLATERAL_DECIMALS)).mul(0.01)
            const collateralAmountPlusBuffer = collateralAmount + parseUnits(buffer.toString(), COLLATERAL_DECIMALS)
            await sendTransaction({
                abi: erc20Abi,
                functionName: 'approve',
                args: [PWN_LOAN_ADDRESS, collateralAmountPlusBuffer],
                address: COLLATERAL_ADDRESS,
                chainId: connectedChainId.value,
            }, { step })
        }

        return true
    }

    const acceptProposal = async (step: ToastStep, creditAmount: bigint) => {
        const proposalData = await readContract(wagmiConfig, {
            abi: PWN_INSTALLMENTS_PRODUCT_ABI,
            functionName: 'encodeProposalData',
            address: PWN_INSTALLMENTS_PRODUCT_ADDRESS,
            chainId: PROPOSAL_CHAIN_ID,
            args: [
                proposal,
                { creditAmount }
            ]
        })
        const proposalSpec: ContractFunctionArgs<typeof PWN_LOAN_ABI, 'nonpayable', 'create'>[0] = {
            proposer: PWN_CROWDSOURCE_LENDER_VAULT_ADDRESS,
            product: PWN_INSTALLMENTS_PRODUCT_ADDRESS,
            proposalData: proposalData,
            proposalInclusionProof: [],
            // we are using onchain signatures, so here we pass just 0x (empty bytes)
            signature: '0x',
        }
        const lenderSpec: ContractFunctionArgs<typeof PWN_LOAN_ABI, 'nonpayable', 'create'>[1] = {
            // TODO is this correct?
            createHook: PWN_CROWDSOURCE_LENDER_VAULT_ADDRESS,
            createHookData: '0x',
            // TODO is this correct?
            repaymentHook: PWN_CROWDSOURCE_LENDER_VAULT_ADDRESS,
            repaymentHookData: '0x',
        }
        const borrowerSpec: ContractFunctionArgs<typeof PWN_LOAN_ABI, 'nonpayable', 'create'>[2] = {
            // TODO do we need to pass anything here?
            createHook: zeroAddress,
            createHookData: '0x',
        }

        // throws error if the tx would revert
        await simulateContract(wagmiConfig, {
            abi: PWN_LOAN_ABI,
            functionName: 'create',
            args: [proposalSpec, lenderSpec, borrowerSpec, '0x'],
            address: PWN_LOAN_ADDRESS,
            chainId: connectedChainId.value,
        })

        const txReceipt = await sendTransaction({
            abi: PWN_LOAN_ABI,
            functionName: 'create',
            args: [proposalSpec, lenderSpec, borrowerSpec, '0x'],
            address: PWN_LOAN_ADDRESS,
            chainId: connectedChainId.value,
        }, { step })
        return txReceipt
    }

    const repay = async () => {
        // TODO here we also probably need to approve?
    }

    return {
        getCollateralAmountFromCreditAmount,
        approveForAcceptIfNeeded,
        acceptProposal,
        repay
    }
}