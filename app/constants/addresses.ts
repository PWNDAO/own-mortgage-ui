import { getAddress, type Address } from "viem"

// TODO move to .env ?
export const PWN_CROWDSOURCE_LENDER_VAULT_ADDRESS = getAddress('0x41dCf7E9ECDBd3f0bc69cba50b49f1B37ae65Ca2') as Address
export const PWN_LOAN_ADDRESS = getAddress('0xc58791ec351349a82036aE712976109C10e34217') as Address
export const PWN_INSTALLMENTS_PRODUCT_ADDRESS = getAddress('0x59Fd11B2518238E363bd4CC2aBb50455d1587966') as Address
// export cobst OWN_CROWDSOURCE_LENDER_VAULT_ADDRESS = getAddress('0xYourAddressHere') as Address
