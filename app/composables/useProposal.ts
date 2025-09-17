import { CREDIT_DECIMALS, MAX_AMOUNT } from "~/constants/proposalConstants"
import { formatUnits } from "viem"
import { PWN_CROWDSOURCE_LENDER_VAULT_ADDRESS } from "~/constants/addresses"
import PWN_CROWDSOURCE_LENDER_VAULT_ABI from "~/assets/abis/v1.5/PWNCrowdsourceLenderVault"
import { useReadContract } from "@wagmi/vue"

export default function useProposal() {

    const totalSupplyQuery = useReadContract({
        abi: PWN_CROWDSOURCE_LENDER_VAULT_ABI,
        address: PWN_CROWDSOURCE_LENDER_VAULT_ADDRESS,
        functionName: 'totalSupply',
    })
    const totalSupply = computed(() => totalSupplyQuery.data.value)
    const totalSupplyFormatted = computed(() => totalSupply.value ? formatUnits(totalSupply.value, CREDIT_DECIMALS) : '0')

    const missingAmount = computed<bigint>(() => {
        return MAX_AMOUNT - (totalSupply.value ?? 0n)
    })

    return {
        missingAmount,
        totalSupply,
        totalSupplyFormatted,
    }

}