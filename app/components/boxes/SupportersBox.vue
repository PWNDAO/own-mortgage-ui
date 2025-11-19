<template>
    <div class="border p-3 sm:p-4 order-6 lg:order-none">
        <div class="mb-4">
            <h3 class="font-heading text-lg sm:text-xl mb-4">Lenders ({{ totalLenders }})</h3>
        </div>
        <hr class="mb-4">
        
        <template v-if="isConnected && userDeposit > 0n">
            <div class="mb-4 p-3 border">
                <div class="flex justify-between items-center">
                    <span class="font-medium text-sm text-gray-300">Your deposit:</span>
                    <span class="font-bold text-lg text-white">{{ userDepositFormatted }} {{ CREDIT_NAME }}</span>
                </div>
            </div>

            <hr class="mb-4">
        </template>


        <div class="overflow-y-auto max-h-72 md:max-h-48">
            <template v-if="isLoading && !lenders?.length">
                <div v-for="i in 5" :key="i" class="py-1">
                    <Skeleton class="h-4 w-full" />
                </div>
            </template>
            <template v-else>
                <div 
                    v-for="lender in lenders" 
                    :key="lender.address" 
                    class="flex justify-between items-center py-1 text-xs sm:text-sm gap-2"
                >
                    <span 
                        class="max-w-[40%] sm:max-w-44 md:max-w-36 overflow-hidden text-ellipsis whitespace-nowrap" 
                        :title="lender.address"
                    >
                        {{ formatAddress(lender.address) }}
                    </span>
                    <span 
                        class="font-bold transition-colors duration-300 text-right flex-shrink-0"
                    >
                        {{ formatAmount(lender.balance) }} {{ CREDIT_NAME }}
                    </span>
                </div>
                <template v-if="isLoading">
                    <div v-for="i in 3" :key="i" class="py-1">
                        <Skeleton class="h-4 w-full" />
                    </div>
                </template>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { CREDIT_NAME, CREDIT_DECIMALS } from '~/constants/proposalConstants';
import { useCrowdsourceLender } from '~/composables/useCrowdsourceLender';
import { useAccount } from '@wagmi/vue';
import { formatUnits } from 'viem';
import { Skeleton } from '~/components/ui/skeleton';
import useUserDepositStore from '~/composables/useUserDepositStore';

// TODO after the loan has been accepted (created), do not modify the list of lenders anymore

// TODO adjust user deposits amount after the loan has defaulted so they show up correctly...

const { lenders, totalLenders, isLoading } = useCrowdsourceLender()

const { isConnected } = useAccount()
const userDepositStore = useUserDepositStore()
const { userDeposit, userDepositFormatted } = storeToRefs(userDepositStore)

// Format addresses to be more readable
const formatAddress = (address: string) => {
    // Don't truncate named addresses (those ending with .eth)
    if (address.endsWith('.eth')) {
        return address
    }
    // Truncate regular addresses
    return address.substring(0, 6) + '...' + address.substring(address.length - 4)
}

// Format amount with commas and no decimal places (rounded to nearest integer)
const formatAmount = (amount: bigint) => {
    const amountInUnits = formatUnits(amount, CREDIT_DECIMALS)
    const rounded = Math.round(Number(amountInUnits))
    return rounded.toLocaleString('en-US')
}
</script>
