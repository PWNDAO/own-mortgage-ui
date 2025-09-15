import { formatUnits, parseUnits } from "viem"

export const PROPOSAL_CHAIN_ID = 11155111
export const CREDIT_ADDRESS = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'
export const CREDIT_DECIMALS = 6
export const CREDIT_NAME = 'USDC'
export const CREDIT_ASSET_ICON = '/icons/usdc.svg'
export const COLLATERAL_NAME = 'WETH'
export const MAX_AMOUNT: bigint = parseUnits('150000', CREDIT_DECIMALS)
export const MAX_AMOUNT_FORMATTED: string = formatUnits(MAX_AMOUNT, CREDIT_DECIMALS)

export const LOAN_LTV = '75%'
export const LOAN_APY = '3%'
export const LOAN_DURATION_IN_DAYS = 3650
export const LOAN_DURATION_IN_YEARS = LOAN_DURATION_IN_DAYS / 365