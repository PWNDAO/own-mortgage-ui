<template>
    <div class="border p-4">
        <div class="mb-4">
            <h3 class="font-heading text-xl mb-4">Lenders ({{ totalLenders }})</h3>
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
            <div 
                v-for="lender in lenders" 
                :key="lender.address" 
                class="flex justify-between items-center py-1 text-sm md:text-sm sm:text-sm"
            >
                <span 
                    class="max-w-44 md:max-w-36 sm:max-w-32 overflow-hidden text-ellipsis whitespace-nowrap" 
                    :title="lender.address"
                >
                    {{ formatAddress(lender.address) }}
                </span>
                <span 
                    class="font-bold transition-colors duration-300"
                >
                    {{ formatAmount(lender.balance) }} {{ CREDIT_NAME }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { CREDIT_NAME, CREDIT_DECIMALS } from '~/constants/proposalConstants';
import { useCrowdsourceLender } from '~/composables/useCrowdsourceLender';
import useUserDeposit from '~/composables/useUserDeposit';
import { useAccount } from '@wagmi/vue';
import { formatUnits } from 'viem';
import { formatDecimalPoint } from '~/lib/format-decimals';

// TODO remove later on, this is just for testing
const { lenders, totalLenders } = useCrowdsourceLender()
setInterval(() => {
    console.log('lenders')
    console.log(lenders.value)
}, 10000)

const { isConnected } = useAccount()
const { userDeposit, userDepositFormatted } = useUserDeposit()

// Format addresses to be more readable
const formatAddress = (address: string) => {
    // Don't truncate named addresses (those ending with .eth)
    if (address.endsWith('.eth')) {
        return address
    }
    // Truncate regular addresses
    return address.substring(0, 6) + '...' + address.substring(address.length - 4)
}

// Format amount with commas and 2 decimal places
const formatAmount = (amount: bigint) => {
    return formatDecimalPoint(formatUnits(amount, CREDIT_DECIMALS), 2)
}
</script>
