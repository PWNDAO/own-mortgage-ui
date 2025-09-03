export default function useUserAaveSupplyInfo() {
    // 1) specify in codebase AAVE v3 pool addresses provider, e.g. on sepolia: 0x012bAC54348C0E635dCAc9D5FB99f06F24136C9A
    // 2) on the contract from step 1), call `getPool` function which returns the latest implementation
    // 3) on aave pool contract from step 2), call `getReserveData` function with the collateral asset address as an argument... take 9th value from the returned tuple, which represents the a token address
    // 4) on the a token address from step 3), call `balanceOf` function which returns the supplied balance of the user... this is the amount you want
}
