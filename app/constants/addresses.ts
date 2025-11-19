import { getAddress, type Address } from "viem"

// TODO move to .env ?
export const PWN_CROWDSOURCE_LENDER_VAULT_ADDRESS = getAddress('0xfD961ACb9778B70BFdEf3183942f2878D47E6787') as Address
export const PWN_LOAN_ADDRESS = getAddress('0xc58791ec351349a82036aE712976109C10e34217') as Address
export const PWN_INSTALLMENTS_PRODUCT_ADDRESS = getAddress('0x68669e7ec29070e3dfa684cb4893282Cd4C9E608') as Address
