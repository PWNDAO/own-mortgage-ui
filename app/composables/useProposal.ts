import { CREDIT_DECIMALS, MAX_AMOUNT } from "~/constants/proposalConstants"
import { formatUnits } from "viem"

export default function useProposal() {

    const raisedAmount = ref<bigint>(14000000000n)

    const raisedAmountFormatted = computed<string>(() => {
        return formatUnits(raisedAmount.value, CREDIT_DECIMALS)
    })

    const missingAmount = computed<bigint>(() => {
        return MAX_AMOUNT - raisedAmount.value
    })

    return {
        raisedAmount,
        raisedAmountFormatted,
        missingAmount
    }

}