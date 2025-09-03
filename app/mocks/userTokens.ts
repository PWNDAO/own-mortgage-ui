import { UserAsset } from "@/classes/Asset"
import { parseUnits } from "viem"
import { Pool } from "~/classes/Pool"
import { CREDIT_ADDRESS, CREDIT_DECIMALS, CREDIT_NAME, PROPOSAL_CHAIN_ID } from "~/constants/proposalConstants"

export const USER_TOKENS: UserAsset[] = [
  new UserAsset(
    PROPOSAL_CHAIN_ID,
    CREDIT_ADDRESS,
    CREDIT_NAME,
    CREDIT_NAME,
    CREDIT_DECIMALS,
    parseUnits('1245', CREDIT_DECIMALS),
  ),
  new UserAsset(
    PROPOSAL_CHAIN_ID,
    CREDIT_ADDRESS,
    CREDIT_NAME,
    CREDIT_NAME,
    CREDIT_DECIMALS,
    parseUnits('123.000001', CREDIT_DECIMALS),
    Pool.AAVE_V3,
    6.69,
    '0xA123123123123123123123123123123123123123',
  ),
  new UserAsset(
    PROPOSAL_CHAIN_ID,
    CREDIT_ADDRESS,
    CREDIT_NAME,
    CREDIT_NAME,
    CREDIT_DECIMALS,
    parseUnits('21422.23', CREDIT_DECIMALS),
    Pool.MORPHO,
    12.34,
    '0xA123123123123123123123123123123123123123',
  ),
]
