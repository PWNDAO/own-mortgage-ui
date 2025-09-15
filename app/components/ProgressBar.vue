<template>
    <!-- TODO shall we use Progressbar component from shadcn ? -->
    <div class="relative border p-2">
        <div class="absolute inset-0 bg-gradient-to-r from-background to-primary-darker transition-all duration-300 ease-out" :style="{ width: `${progress}%` }"/>
        <div class="flex justify-center items-center gap-2 text-center relative font-semibold text-3xl transition-colors duration-300" :class="{ 'text-primary-foreground': isHighlighting }">
            <span>{{ raisedAmountFormattedDecimals }} / {{ maxAmountFormattedDecimals }}</span>
            <img width="24" height="24" :src="CREDIT_ASSET_ICON" :alt="CREDIT_NAME" />
            <span> {{ CREDIT_NAME }}</span>
        </div>
        <div class="absolute -top-7 left-1/2 transform -translate-x-1/2">
            <div class="text-xs text-white border border-white px-1 bg-gray-900">50% Minimum</div>
            <div class="relative w-px h-2.5 left-1/2 transform -translate-x-1/2">
                <div class="absolute top-0 w-full h-0.75 bg-white"></div>
                <div class="absolute bottom-0 w-full h-0.75 bg-white"></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { CREDIT_NAME, MAX_AMOUNT_FORMATTED, CREDIT_ASSET_ICON } from '~/constants/proposalConstants'

const { raisedAmountFormatted, raisedAmount } = useProposal()

const raisedAmountFormattedDecimals = computed(() => {
    return Math.floor(Number(raisedAmountFormatted.value)).toLocaleString()
})

const maxAmountFormattedDecimals = computed(() => Number(MAX_AMOUNT_FORMATTED).toLocaleString())

// Calculate progress percentage
const progress = computed(() => {
    const percentage = (Number(raisedAmountFormatted.value) / Number(MAX_AMOUNT_FORMATTED)) * 100
    if (percentage > 100) {
        return 100
    }
    return Math.floor(percentage)
})

// Animation for value changes
const isHighlighting = ref(false)
const previousTotal = ref(raisedAmount.value)

// TODO remove?
// Watch for changes in the total to trigger highlighting
watch(raisedAmount, (newValue) => {
    if (newValue > previousTotal.value) {
        isHighlighting.value = true
        setTimeout(() => {
            isHighlighting.value = false
        }, 300) // Animation duration
    }
    previousTotal.value = newValue
})
</script>
