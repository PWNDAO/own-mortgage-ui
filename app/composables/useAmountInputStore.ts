import { formatUnits, parseUnits } from "viem"
import { CREDIT_DECIMALS } from "~/constants/proposalConstants"
import { formatDecimalPoint } from "~/lib/format-decimals"
import useUserDepositStore from "./useUserDepositStore"
import Decimal from "decimal.js"

export const useAmountInputStore = defineStore('amountInput', () => {
    const userDepositStore = useUserDepositStore()

    const lendAmount = ref<string>('')

    const lendAmountBigInt = computed(() => {
        const amount = (lendAmount.value === '' || lendAmount.value === null || lendAmount.value === undefined) ? '0' : lendAmount.value
        return parseUnits(amount, CREDIT_DECIMALS)
    })

    const lendAmountFormatted = computed(() => {
        const amount = (lendAmount.value === '' || lendAmount.value === null || lendAmount.value === undefined) ? '0' : lendAmount.value
        return formatDecimalPoint(amount, 2)
    })

    const amountToWithdraw = computed(() => {
        return Decimal(userDepositStore.userDepositFormatted).sub(Decimal(lendAmount.value || '0'))
    })

    const amountToWithdrawFormatted = computed(() => {
        return amountToWithdraw.value.toString()
    })
    
    const amountToDepositAdditionally = computed<bigint>(() => {
        return lendAmountBigInt.value - userDepositStore.userDeposit
    })

    const amountToDepositAdditionallyFormatted = computed<string>(() => {
        return formatDecimalPoint(formatUnits(amountToDepositAdditionally.value, CREDIT_DECIMALS), 2)
    })
    
    const isAmountInputLowerThanUserDeposit = computed(() => {
        return amountToDepositAdditionally.value < 0n
    })

    return {
        lendAmount,
        lendAmountBigInt,
        lendAmountFormatted,
        amountToWithdraw,
        amountToWithdrawFormatted,
        amountToDepositAdditionally,
        amountToDepositAdditionallyFormatted,
        isAmountInputLowerThanUserDeposit
    }
})

export default useAmountInputStore