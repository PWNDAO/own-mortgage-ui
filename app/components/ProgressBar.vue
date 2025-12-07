<template>
    <div>
        <!-- Stats Row -->
        <div class="flex justify-between items-center mb-3 text-sm sm:text-base">
            <div class="flex items-center gap-2">
                <span class="text-gray-400">Progress:</span>
                <span class="font-bold text-white">{{ progress }}% funded</span>
            </div>
            <div class="flex items-center gap-2">
                <span class="text-gray-400">Remaining:</span>
                <span class="font-bold text-yellow-400">{{ remainingFormatted }} {{ CREDIT_NAME }}</span>
            </div>
        </div>
        
        <!-- Progress Bar -->
        <div class="relative border p-3 rounded-lg">
            <div class="absolute inset-0 bg-gradient-to-r from-green-900/30 to-green-600/30 transition-all duration-500 ease-out rounded-lg" :style="{ width: `${progress}%` }"/>
            <div class="flex justify-center items-center gap-2 text-center relative font-semibold text-2xl sm:text-3xl transition-colors duration-300" :class="{ 'text-green-400': isHighlighting, 'text-white': !isHighlighting }">
                <span>{{ totalDepositedAssetsFormattedDecimals }} / {{ maxAmountFormattedDecimals }}</span>
                <img width="24" height="24" :src="CREDIT_ASSET_ICON" :alt="CREDIT_NAME" />
                <span> {{ CREDIT_NAME }}</span>
            </div>
            <div class="absolute -top-7" :style="{ left: `${Number(MINIMAL_CREDIT_AMOUNT_PERCENTAGE) * 100}%`, transform: 'translateX(-50%)' }">
                <div class="text-xs text-white border border-white px-1 bg-gray-900 rounded">{{ MINIMAL_CREDIT_AMOUNT_PERCENTAGE_FORMATTED }}% Min</div>
                <div class="relative w-px h-2.5 left-1/2 transform -translate-x-1/2">
                    <div class="absolute top-0 w-full h-0.75 bg-white"></div>
                    <div class="absolute bottom-0 w-full h-0.75 bg-white"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { CREDIT_NAME, MAX_AMOUNT_FORMATTED, CREDIT_ASSET_ICON, MINIMAL_CREDIT_AMOUNT_PERCENTAGE } from '~/constants/proposalConstants'

const { totalDepositedAssets, totalDepositedAssetsFormatted } = useProposal()

const MINIMAL_CREDIT_AMOUNT_PERCENTAGE_FORMATTED = Number(MINIMAL_CREDIT_AMOUNT_PERCENTAGE) * 100

const totalDepositedAssetsFormattedDecimals = computed(() => {
    return Math.floor(Number(totalDepositedAssetsFormatted.value)).toLocaleString()
})

const maxAmountFormattedDecimals = computed(() => MAX_AMOUNT_FORMATTED.toLocaleString())

// Calculate remaining amount
const remainingFormatted = computed(() => {
    const remaining = MAX_AMOUNT_FORMATTED - Number(totalDepositedAssetsFormatted.value)
    return Math.max(0, Math.floor(remaining)).toLocaleString()
})

// Calculate progress percentage
const progress = computed(() => {
    const percentage = (Number(totalDepositedAssetsFormatted.value) / MAX_AMOUNT_FORMATTED) * 100
    if (percentage > 100) {
        return 100
    }
    return Math.floor(percentage)
})

// Animation for value changes
const isHighlighting = ref(false)
const previousTotal = ref(totalDepositedAssets.value ?? 0n)

// Watch for changes in the total to trigger highlighting
watch(totalDepositedAssets, (newValue) => {
    if (newValue && newValue > previousTotal.value) {
        isHighlighting.value = true
        setTimeout(() => {
            isHighlighting.value = false
        }, 300) // Animation duration
    }
    previousTotal.value = newValue ?? 0n
})
</script>
