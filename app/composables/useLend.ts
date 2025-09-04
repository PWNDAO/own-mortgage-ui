export default function useLend() {
    async function createLendingProposal() {
        // TODO implement
        await new Promise(resolve => setTimeout(resolve, 100000))
    }

    return { createLendingProposal }
}