export default function useLend() {
    async function createLendingProposal() {
        // TODO implement
        await new Promise(resolve => setTimeout(resolve, 10000))
    }

    return { createLendingProposal }
}