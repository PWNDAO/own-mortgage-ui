import { CREDIT_DECIMALS, MAX_AMOUNT } from "~/constants/proposalConstants"
import { formatUnits } from "viem"
import { PWN_CROWDSOURCE_LENDER_VAULT_ADDRESS } from "~/constants/addresses"
import PWN_CROWDSOURCE_LENDER_VAULT_ABI from "~/assets/abis/v1.5/PWNCrowdsourceLenderVault"
import { useReadContract } from "@wagmi/vue"

export default function useProposal() {

    const totalDepositedAssetsQuery = useReadContract({
        abi: PWN_CROWDSOURCE_LENDER_VAULT_ABI,
        address: PWN_CROWDSOURCE_LENDER_VAULT_ADDRESS,
        // note: totalAssets returns amount of all deposited assets in credit asset... totalSupply returns amount of shares
        functionName: 'totalAssets',
    })
    const totalDepositedAssets = computed<bigint>(() => totalDepositedAssetsQuery.data.value ?? 0n)
    const totalDepositedAssetsFormatted = computed<string>(() => totalDepositedAssets.value ? formatUnits(totalDepositedAssets.value, CREDIT_DECIMALS) : '0')

    const missingAmount = computed<bigint>(() => {
        return MAX_AMOUNT - totalDepositedAssets.value
    })

    return {
        missingAmount,
        totalDepositedAssets,
        totalDepositedAssetsFormatted,
        refetchTotalDepositedAssets: totalDepositedAssetsQuery.refetch,
    }
}