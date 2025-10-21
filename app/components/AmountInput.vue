<template>
    <div>
        <div class="flex items-center justify-between mb-2">
            <label class="text-sm font-medium">Total Amount to Lend</label>
            <div
                v-if="walletBalancePlusUserDeposit > 0n"
                class="flex items-center gap-2 font-sm text-sm border-b-1 border-gray-2 hover:border-gray font-supreme hover:cursor-pointer text-gray-2 hover:text-gray transition duration-300"
                @click="handleWalletBalanceClick">
                <WalletIcon
                    class="w-5 h-5"
                    color="var(--gray-2)"/>
                <SafeDisplayDecimals
                    :value="walletBalancePlusUserDepositFormatted"
                    :text-after-value="CREDIT_NAME"/>
            </div>
        </div>

        <div class="relative">
            <div class="flex items-center gap-2">
                <Input
                    v-model="lendAmount"
                    placeholder="150.23"
                    :disabled="isAmountInputDisabled"
                    class="w-full h-[40px]"
                    :class="{ 'border-red-500': isAmountInvalid }"
                />
                <Button class="h-[40px]" :disabled="walletBalancePlusUserDeposit <= 0n" @click="handleMaxClick">
                    Max
                </Button>
            </div>
            <div v-if="isAmountInvalid" class="text-xs text-red-500 mt-1">
                Amount exceeds balance
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { CREDIT_ADDRESS, CREDIT_DECIMALS, CREDIT_NAME } from '~/constants/proposalConstants'
import { formatUnits, parseUnits, erc20Abi, type Address } from 'viem'
import useAmountInputStore from '~/composables/useAmountInputStore'
import { useReadContract, useAccount } from '@wagmi/vue'
import { formatDecimalPoint } from '~/lib/format-decimals'
import { useIsMutating } from '@tanstack/vue-query'
import MutationIds from '~/constants/mutationIds'

// TODO make sure that the calculations are correct, including usage of the decimal.js
//  and make sure there are not rounding errors...

const { missingAmount } = useProposal()

const { userDeposit, userDepositFormatted } = useUserDeposit()

const amountInputStore = useAmountInputStore()
const { lendAmount } = storeToRefs(amountInputStore)

watch(userDepositFormatted, (newVal) => {
    if (newVal !== '0' && (lendAmount.value === '0' || !lendAmount.value)) {
        lendAmount.value = newVal
    }
}, { immediate: true })

const withdrawingMutationsCount = useIsMutating({ mutationKey: [MutationIds.Withdraw] })
const depositingMutationsCount = useIsMutating({ mutationKey: [MutationIds.Deposit] })
const approvingMutationsCount = useIsMutating({ mutationKey: [MutationIds.ApproveForDepositIfNeeded] })

const isPerformingMutations = computed(() => {
    return withdrawingMutationsCount.value > 0 || depositingMutationsCount.value > 0 || approvingMutationsCount.value > 0
})

const { address, isConnected } = useAccount()

const walletBalanceQuery = useReadContract({
    abi: erc20Abi,
    // @ts-expect-error not sure why this throws TS error, but it works
    address: CREDIT_ADDRESS,
    functionName: 'balanceOf',
    args: [address as Ref<Address>],
    enabled: computed(() => !!address.value),
})

const walletBalance = computed(() => walletBalanceQuery.data.value)

const walletBalancePlusUserDeposit = computed(() => {
    return (walletBalance.value ?? 0n) + (userDeposit.value ?? 0n)
})

const isAmountInputDisabled = computed(() => {
    if (isPerformingMutations.value) {
        return true
    }

    if (!isConnected.value) {
        return false
    }

    return walletBalancePlusUserDeposit.value <= 0n && !userDeposit.value
})

const walletBalancePlusUserDepositFormatted = computed(() => {
    if (!walletBalancePlusUserDeposit.value) {
        return '0'
    }
    return formatDecimalPoint(formatUnits(walletBalancePlusUserDeposit.value, CREDIT_DECIMALS), 2)
})

// Check if amount input is invalid (exceeds balance)
const isAmountInvalid = computed(() => {
    if (walletBalancePlusUserDeposit.value <= 0n) {
        return false
    }

    const amountStr = lendAmount.value || '0'
    
    try {
        // Parse the input amount using viem parseUnits with the token's decimals
        const amount = parseUnits(amountStr, CREDIT_DECIMALS)
        return amount > walletBalancePlusUserDeposit.value
    } catch {
        // If parsing fails (invalid input), consider it invalid
        return true
    }
})

const handleWalletBalanceClick = () => {
    handleMaxClick()
}

const handleMaxClick = () => {
    if (walletBalancePlusUserDeposit.value > missingAmount.value) {
        lendAmount.value = formatUnits(missingAmount.value, CREDIT_DECIMALS)
    } else if (walletBalancePlusUserDeposit.value) {
        lendAmount.value = formatUnits(walletBalancePlusUserDeposit.value, CREDIT_DECIMALS)
    }
}
</script>
