import { CREDIT_DECIMALS, MAX_AMOUNT } from "~/constants/proposalConstants"
import { formatUnits } from "viem"
import { PWN_CROWDSOURCE_LENDER_VAULT_ADDRESS, OLD_PWN_CROWDSOURCE_LENDER_VAULT_ADDRESS } from "~/constants/addresses"
import PWN_CROWDSOURCE_LENDER_VAULT_ABI from "~/assets/abis/v1.5/PWNCrowdsourceLenderVault"
import { useReadContract } from "@wagmi/vue"

export default function useProposal() {

    const oldVaultTotalAssetsQuery = useReadContract({
        abi: PWN_CROWDSOURCE_LENDER_VAULT_ABI,
        address: OLD_PWN_CROWDSOURCE_LENDER_VAULT_ADDRESS,
        // note: totalAssets returns amount of all deposited assets in credit asset... totalSupply returns amount of shares
        functionName: 'totalAssets',
    })

    const newVaultTotalAssetsQuery = useReadContract({
        abi: PWN_CROWDSOURCE_LENDER_VAULT_ABI,
        address: PWN_CROWDSOURCE_LENDER_VAULT_ADDRESS,
        // note: totalAssets returns amount of all deposited assets in credit asset... totalSupply returns amount of shares
        functionName: 'totalAssets',
    })

    // Sum totalAssets from both old and new vaults
    const totalDepositedAssets = computed<bigint>(() => {
        const oldVaultAssets = oldVaultTotalAssetsQuery.data.value ?? 0n
        const newVaultAssets = newVaultTotalAssetsQuery.data.value ?? 0n
        return oldVaultAssets + newVaultAssets
    })

    const totalDepositedAssetsFormatted = computed<string>(() => totalDepositedAssets.value ? formatUnits(totalDepositedAssets.value, CREDIT_DECIMALS) : '0')

    const missingAmount = computed<bigint>(() => {
        return MAX_AMOUNT - totalDepositedAssets.value
    })

    const refetchTotalDepositedAssets = async () => {
        await Promise.all([
            oldVaultTotalAssetsQuery.refetch(),
            newVaultTotalAssetsQuery.refetch()
        ])
    }

    return {
        missingAmount,
        totalDepositedAssets,
        totalDepositedAssetsFormatted,
        refetchTotalDepositedAssets,
    }
}