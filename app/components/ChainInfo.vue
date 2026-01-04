<template>
    <div class="flex items-center text-sm">
      <img 
        width="20"
        height="20"
        :src="chainIconPath" 
        :alt="chainNameUppercase" 
        :class="[
          'mr-2 w-[1.375rem] h-[1.375rem]',
          { '!w-3 !h-3': isSmall }
        ]"
      />
      <span
        :class="[
          'font-[family-name:var(--font-family-supreme)] capitalize text-base',
          { 'text-xs leading-none': isSmall }
        ]">
        {{ chainNameUppercase }}
      </span>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, toRefs } from 'vue'
  import { getChainIconPath, getChainName } from '~/lib/chain'
  
  const props = defineProps<{
    isSmall?: boolean,
  }>()
  const { isSmall } = toRefs(props)
  
  const chainNameUppercase = computed(() => getChainName())
  const chainIconPath = computed(() => getChainIconPath())
  </script>
  
  