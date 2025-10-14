import { useReadContract, useAccount } from '@wagmi/vue'
import { CREDIT_DECIMALS, PROPOSAL_CHAIN_ID } from '~/constants/proposalConstants'
import { formatUnits, type Address } from 'viem'
import { PWN_CROWDSOURCE_LENDER_VAULT_ADDRESS } from '~/constants/addresses'
import PWN_CROWDSOURCE_LENDER_VAULT_ABI from '~/assets/abis/v1.5/PWNCrowdsourceLenderVault'
import { formatDecimalPoint } from '~/lib/format-decimals'

export default function useUserDeposit() {
    const { address: userAddress } = useAccount()

    const userDepositQuery = useReadContract({
        abi: PWN_CROWDSOURCE_LENDER_VAULT_ABI,
        // @ts-expect-error not sure why this throws TS error, but it works
        address: PWN_CROWDSOURCE_LENDER_VAULT_ADDRESS,
        functionName: 'balanceOf',
        args: [userAddress as Ref<Address>],
        chainId: PROPOSAL_CHAIN_ID,
        enabled: computed(() => !!userAddress.value),
    })

    const userDeposit = computed<bigint>(() => userDepositQuery.data?.value ?? 0n)

    const userDepositFormatted = computed<string>(() => {
        if (!userDeposit.value) {
            return '0'
        }
        return formatUnits(userDeposit.value, CREDIT_DECIMALS)
    })

    const userDepositFormattedDecimals = computed<string>(() => {
        if (!userDeposit.value) {
            return '0'
        }
        return formatDecimalPoint(userDepositFormatted.value, 2)
    })

    return {
        userDeposit,
        userDepositFormatted,
        userDepositFormattedDecimals
    }
}