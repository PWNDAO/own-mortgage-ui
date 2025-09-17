<template>
    <div>
        <div class="flex items-center justify-between mb-2">
            <label class="text-sm font-medium">Amount to Lend</label>
            <div
                v-if="!!walletBalance && walletBalanceFormatted"
                class="flex items-center gap-2 font-sm text-sm border-b-1 border-gray-2 hover:border-gray font-supreme hover:cursor-pointer text-gray-2 hover:text-gray transition duration-300"
                @click="handleWalletBalanceClick">
                <WalletIcon
                    class="w-5 h-5"
                    color="var(--gray-2)"/>
                <SafeDisplayDecimals
                    :value="formatDecimalPoint(walletBalanceFormatted, 2)"
                    :text-after-value="CREDIT_NAME"/>
            </div>
        </div>

        <div class="relative">
            <div class="flex items-center gap-2">
                <Input
                    v-model="lendAmount"
                    placeholder="150.23"
                    :disabled="!walletBalance || (walletBalance && walletBalance <= 0n) || props.isInputDisabled"
                    class="w-full h-[40px]"
                    :class="{ 'border-red-500': isAmountInvalid }"
                />
                <Button class="h-[40px]" :disabled="!walletBalance" @click="handleMaxClick">
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
import { formatDecimalPoint } from '~/lib/format-decimals'
import useAmountInputStore from '~/composables/useAmountInputStore'
import { useReadContract, useAccount } from '@wagmi/vue'

interface Props {
    isInputDisabled?: boolean
}
const props = withDefaults(defineProps<Props>(), {
    isInputDisabled: false
})

const { missingAmount } = useProposal()

const amountInputStore = useAmountInputStore()
const { lendAmount } = storeToRefs(amountInputStore)

const { address } = useAccount()

const walletBalanceQuery = useReadContract({
    abi: erc20Abi,
    address: CREDIT_ADDRESS,
    functionName: 'balanceOf',
    args: [address as Ref<Address>],
})

const walletBalance = computed(() => walletBalanceQuery.data.value)
const walletBalanceFormatted = computed(() => {
    if (!walletBalance.value) {
        return null
    }
    return formatUnits(walletBalance.value, CREDIT_DECIMALS)
})

// Check if amount input is invalid (exceeds balance)
const isAmountInvalid = computed(() => {
    if (!walletBalance.value) {
        return false
    }

    const amountStr = lendAmount.value || '0'
    
    try {
        // Parse the input amount using viem parseUnits with the token's decimals
        const amount = parseUnits(amountStr, CREDIT_DECIMALS)
        return amount > walletBalance.value
    } catch {
        // If parsing fails (invalid input), consider it invalid
        return true
    }
})

const handleWalletBalanceClick = () => {
    handleMaxClick()
}

const handleMaxClick = () => {
    if (walletBalance.value && walletBalance.value > missingAmount.value) {
        lendAmount.value = formatUnits(missingAmount.value, CREDIT_DECIMALS)
    } else if (walletBalance.value) {
        lendAmount.value = formatUnits(walletBalance.value, CREDIT_DECIMALS)
    }
}
</script>
