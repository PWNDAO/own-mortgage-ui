<template>
    <div class="relative border p-2">
        <div class="absolute inset-0 bg-gradient-to-r from-background to-primary-darker transition-all duration-300 ease-out" :style="{ width: `${progress}%` }"/>
        <div class="text-center relative font-semibold text-3xl transition-colors duration-300" :class="{ 'text-primary-foreground': isHighlighting }">
            {{ formattedCurrentValue }} / {{ formattedMaxValue }} USDC
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
import { useSupporters } from '~/composables/useSupporters'

const maxValue = 150000
const { totalAmount } = useSupporters()

// Format values with commas
const formattedCurrentValue = computed(() => 
    Math.floor(totalAmount.value).toLocaleString()
)
const formattedMaxValue = computed(() => 
    maxValue.toLocaleString()
)

// Calculate progress percentage
const progress = computed(() => 
    Math.min((totalAmount.value / maxValue) * 100, 100)
)

// Animation for value changes
const isHighlighting = ref(false)
const previousTotal = ref(totalAmount.value)

// Watch for changes in the total to trigger highlighting
watch(totalAmount, (newValue) => {
    if (newValue > previousTotal.value) {
        isHighlighting.value = true
        setTimeout(() => {
            isHighlighting.value = false
        }, 300) // Animation duration
    }
    previousTotal.value = newValue
})
</script>
