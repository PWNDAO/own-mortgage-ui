import type { Address, Hash } from "viem"
import { PROPOSAL_CHAIN_ID } from "./proposalConstants"

export const DISCORD_SUPPORT_LINK = 'https://discord.com/channels/818107187368427550/1196466767900454994'

export const getExplorerTransactionDetailsLink = (txHash: Hash) => {
    if (PROPOSAL_CHAIN_ID === 11155111) {
        return `https://sepolia.etherscan.io/tx/${txHash}`
    } else if (PROPOSAL_CHAIN_ID === 1) {
        return `https://etherscan.io/tx/${txHash}`
    } else {
        console.warn('Missing explorer transaction details link for chain id: ', PROPOSAL_CHAIN_ID)
        return null
    }
}

export const getExplorerTokenAddressLink = (tokenAddress: Address) => {
    if (PROPOSAL_CHAIN_ID === 11155111) {
        return `https://sepolia.etherscan.io/address/${tokenAddress}`
    } else if (PROPOSAL_CHAIN_ID === 1) {
        return `https://etherscan.io/address/${tokenAddress}`
    } else {
        console.warn('Missing explorer token address link for chain id: ', PROPOSAL_CHAIN_ID)
        return undefined
    }
}
