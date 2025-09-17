<template>
    <div class="border p-4">
        <div class="mb-4">
            <h3 class="font-heading text-xl mb-4">Lenders ({{ displayedSupporters.length }})</h3>
        </div>
        <hr class="mb-4">
        <div class="overflow-y-auto max-h-72 md:max-h-48">
            <div 
                v-for="supporter in displayedSupporters.slice(0, 30)" 
                :key="supporter.address + supporter.timestamp" 
                class="flex justify-between items-center py-1 text-sm md:text-sm sm:text-sm"
            >
                <span 
                    class="max-w-44 md:max-w-36 sm:max-w-32 overflow-hidden text-ellipsis whitespace-nowrap" 
                    :title="supporter.address"
                >
                    {{ formatAddress(supporter.address) }}
                </span>
                <span 
                    class="font-bold transition-colors duration-300"
                    :class="{ 'text-blue-600': isRecent(supporter.timestamp) }"
                >
                    {{ formatAmount(supporter.amount) }} {{ CREDIT_NAME }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useSupporters } from '~/composables/useSupporters'
import { CREDIT_NAME } from '~/constants/proposalConstants';
import { useCrowdsourceLender } from '~/composables/useCrowdsourceLender';

const { lenders } = useCrowdsourceLender()
setInterval(() => {
    console.log('lenders')
    console.log(lenders.value)
}, 10000)

const { supportersList } = useSupporters()

// Only show the top 10 supporters
const displayedSupporters = computed(() => {
    const sortedSupporters = [...supportersList.value].sort((a, b) => b.amount - a.amount)
    return sortedSupporters
})

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
const formatAmount = (amount: number) => {
    return amount >= 1000 
        ? Math.floor(amount).toLocaleString()
        : amount.toFixed(2)
}

// Check if a transaction is recent (last 5 seconds)
const isRecent = (timestamp: number) => {
    return Date.now() - timestamp < 5000
}
</script>
