import { getAddress, type Address } from "viem"

// TODO move to .env ?
export const OLD_PWN_CROWDSOURCE_LENDER_VAULT_ADDRESS = getAddress('0x4dA3FFF2b28Aa612325a602e1c53De67B8B0FC87') as Address
export const PWN_CROWDSOURCE_LENDER_VAULT_ADDRESS = getAddress('0x64B48eA850b0265d8352C56f73c279bf9F328a73') as Address

export const PWN_LOAN_ADDRESS = getAddress('0xc58791ec351349a82036aE712976109C10e34217') as Address
export const PWN_INSTALLMENTS_PRODUCT_ADDRESS = getAddress('0x366a95aDB86282d53c905F9b7d62746b02C4F679') as Address