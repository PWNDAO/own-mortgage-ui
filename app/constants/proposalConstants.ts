import { formatUnits, parseUnits, type Address } from "viem"

export const PROPOSAL_CHAIN_ID = 11155111
export const CREDIT_ADDRESS = '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8' as Address
export const CREDIT_DECIMALS = 6
export const CREDIT_NAME = 'USDC'
export const CREDIT_ASSET_ICON = '/icons/usdc.svg'
export const COLLATERAL_NAME = 'WETH'
export const MAX_AMOUNT: bigint = parseUnits('150000', CREDIT_DECIMALS)
export const MAX_AMOUNT_FORMATTED: string = formatUnits(MAX_AMOUNT, CREDIT_DECIMALS)

export const LOAN_LTV = '75%'
export const LOAN_APY = 0.03
export const LOAN_DURATION_IN_DAYS = 3650
export const LOAN_DURATION_IN_MONTHS = Math.round(LOAN_DURATION_IN_DAYS / (365 / 12))
export const LOAN_DURATION_IN_YEARS = LOAN_DURATION_IN_DAYS / 365

export const TOTAL_AMOUNT_TO_REPAY = Number(MAX_AMOUNT_FORMATTED) + Number(MAX_AMOUNT_FORMATTED) * LOAN_APY

export const GRACE_MONTHS = 4 // how long till the first repayment