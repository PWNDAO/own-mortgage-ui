export default function useUserDeposit() {
    // TODO call here the contract to get the user deposit
    
    const userDeposit = ref(4400)

    return {
        userDeposit
    }
}