import { formatUnits, parseUnits, type Address } from "viem"
import { proposal } from "@/lib/decode-proposal"

// note: for getting the proposal data, see code in decode-proposal.ts and then update the values here

export const CREDIT_ADDRESS = proposal.creditAddress as Address
export const LOAN_LTV = Number(proposal.loanToValue) // e.g. 7500 is 75%
export const POSTPONEMENT = Number(proposal.postponement)  // how long till the first repayment, in seconds
export const POSTPONEMENT_IN_DAYS = Math.round(POSTPONEMENT / 86400)
export const POSTPONEMENT_IN_MONTHS = Math.round(POSTPONEMENT_IN_DAYS / 30)
export const LOAN_APY = Number(proposal.interestAPR) // e.g. 1000 is 10%
export const LOAN_DURATION = Number(proposal.duration) // in seconds
export const LOAN_DURATION_IN_DAYS = LOAN_DURATION / 86400
export const LOAN_DURATION_IN_MONTHS = Math.round(LOAN_DURATION_IN_DAYS / (365 / 12))
export const LOAN_DURATION_IN_YEARS = Math.round(LOAN_DURATION_IN_DAYS / 365)
export const PROPOSAL_EXPIRATION = Number(proposal.expiration) // in seconds

// values required to update manually
export const PROPOSAL_CHAIN_ID = 11155111
export const CREDIT_DECIMALS = 6
export const CREDIT_NAME = 'USDC'
export const CREDIT_ASSET_ICON = '/icons/usdc.svg'
export const COLLATERAL_NAME = 'WETH'

// note: the max amount will be only enforced on frontend
export const MAX_AMOUNT: bigint = parseUnits('150000', CREDIT_DECIMALS)
export const MAX_AMOUNT_FORMATTED: string = formatUnits(MAX_AMOUNT, CREDIT_DECIMALS)

// TODO should we implement some kind of decimal.js or other package for high precision calculations?
// TODO check that this calculation is correct
export const TOTAL_AMOUNT_TO_REPAY = Number(MAX_AMOUNT_FORMATTED) * (1 + (LOAN_APY / 10000) * LOAN_DURATION_IN_YEARS);
