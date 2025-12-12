import { useReadContract, useAccount } from '@wagmi/vue'
import { CREDIT_DECIMALS, PROPOSAL_CHAIN_ID } from '~/constants/proposalConstants'
import { formatUnits, type Address } from 'viem'
import { PWN_CROWDSOURCE_LENDER_VAULT_ADDRESS } from '~/constants/addresses'
import PWN_CROWDSOURCE_LENDER_VAULT_ABI from '~/assets/abis/v1.5/PWNCrowdsourceLenderVault'
import { formatDecimalPoint } from '~/lib/format-decimals'
import { computedAsync } from '@vueuse/core'
import { wagmiConfig } from '~/config/appkit'
import { readContract } from '@wagmi/core/actions'

export const useUserDepositStore = defineStore('userDeposit', () => {
    const { address: userAddress } = useAccount()

    // returns shares
    const userDepositQuery = useReadContract({
        abi: PWN_CROWDSOURCE_LENDER_VAULT_ABI,
        // @ts-expect-error not sure why this throws TS error, but it works
        address: PWN_CROWDSOURCE_LENDER_VAULT_ADDRESS,
        functionName: 'balanceOf',
        args: [userAddress as Ref<Address>],
        chainId: PROPOSAL_CHAIN_ID,
        enabled: computed(() => !!userAddress.value),
    })
    const userShares = computed<bigint>(() => userDepositQuery.data?.value ?? 0n)

    const isFetchingUserDeposit = computed(() => userDepositQuery.isFetching.value)

    const userDeposit = computedAsync<bigint>(
        async () => {
            if (!userShares.value) {
                return 0n
            }

            const userAssets = await readContract(wagmiConfig, {
                abi: PWN_CROWDSOURCE_LENDER_VAULT_ABI,
                functionName: 'convertToAssets',
                args: [userShares.value],
                address: PWN_CROWDSOURCE_LENDER_VAULT_ADDRESS as Address,
                chainId: PROPOSAL_CHAIN_ID,
            })
            return userAssets as bigint ?? 0n
        },
        0n
    )


    // const userAssetsQuery = useReadContract({
    //     abi: PWN_CROWDSOURCE_LENDER_VAULT_ABI,
    //     // @ts-expect-error not sure why this throws TS error, but it works
    //     address: PWN_CROWDSOURCE_LENDER_VAULT_ADDRESS,
    //     functionName: 'convertToAssets',
    //     args: [userShares.value],
    //     chainId: PROPOSAL_CHAIN_ID,
    //     enabled: computed(() => userShares.value !== 0n && !!userAddress.value),
    // })

    // const userDeposit = computed<bigint>(() => userAssetsQuery.data?.value ?? 0n)

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
        userShares,
        userDeposit,
        userDepositFormatted,
        userDepositFormattedDecimals,
        isFetchingUserDeposit
    }
})

export default useUserDepositStore