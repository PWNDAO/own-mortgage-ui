<template>
    <div
      v-if="isLoading"
      class="w-[3.5rem]">
      <Skeleton/>
    </div>
  
    <div
      v-else-if="parsedDecimalPoints === null"
      :class="COMMON_CLASSES">
      {{ value }} {{ textAfterValue }}
    </div>
    <div
      v-else
      :class="COMMON_CLASSES">
      <span>{{ parsedValue.integerPart }}</span>
      <span>.</span>
      <div>0<span class="inline-block text-xs transform-[translateY(25%)]">{{ parsedDecimalPoints?.repeatedZeroes }}</span>{{ parsedDecimalPoints?.restDecimals }} {{ textAfterValue }}</div>
    </div>
</template>
  
<script setup lang="ts">
import { parseRepeatedDecimal } from '@/lib/format-decimals'
import Skeleton from './ui/skeleton/Skeleton.vue';
  
  const props = defineProps<{
    value: string
    maxDecimals?: number
    textAfterValue?: string
    isLoading?: boolean
  }>()
  
  const { value, maxDecimals, textAfterValue, isLoading } = toRefs(props)
  
  const parsedDecimalPoints = computed(() => {
    if (value.value === '0' || value.value === '0.00' || !value.value || !value.value.toString().includes('.')) {
      return null
    }
  
    return parseRepeatedDecimal(value.value, maxDecimals.value)
  })
  
  const parsedValue = computed(() => {
    const [integerPart, decimalPart] = value.value.split('.')
  
    return {
      integerPart,
      decimalPart,
    }
  })

  const COMMON_CLASSES = 'flex flex-row flex-nowrap items-baseline justify-center whitespace-nowrap w-min'
  
  </script>
