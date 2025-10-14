import { PROPOSAL_CHAIN_ID } from "~/constants/proposalConstants"

export const getChainIconPath = (): string | undefined => {
    const CHAIN_ICON_MAP = {
        1: '/icons/chain/ethereum.svg',
        11155111: '/icons/chain/sepolia.svg',
    }
    const icon = CHAIN_ICON_MAP[PROPOSAL_CHAIN_ID]
    if (!icon) {
        console.warn(`Unknown chain with id ${PROPOSAL_CHAIN_ID} in getChainIconPath.`)
        return undefined
    }
    return icon
}

export const getChainName = (): string | undefined => {
    const CHAIN_NAME_MAP = {
        1: 'Ethereum',
        11155111: 'Sepolia',
    }
    const name = CHAIN_NAME_MAP[PROPOSAL_CHAIN_ID]
    if (!name) {
        console.warn(`Unknown chain with id ${PROPOSAL_CHAIN_ID} in getChainName.`)
        return undefined
    }
    return name
}

