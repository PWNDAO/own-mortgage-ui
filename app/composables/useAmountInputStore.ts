export const useAmountInputStore = defineStore('amountInput', () => {
    const lendAmount = ref<string>('')

    return {
        lendAmount
    }
})

export default useAmountInputStore