<template>
    <div
      ref="stepElement"
      class="grid items-center gap-2 grid-cols-[1.25rem_minmax(0,1fr)]">
      <img
        :src="icon"
        :class="{ 'animate-spin': isPending }"
        width="20"
        height="20"/>
      <div
        :class="[
          'text-sm',
          {
            'text-[var(--gray-2)]': step.status === 'SUCCESS' || step.status === 'INACTIVE',
            'text-[var(--negative)]': step.status === 'ERROR'
          }
        ]">
        <div class="flex items-center gap-3">
          {{ stepText }} <a
            v-if="txDetailsLink"
            rel="noopener noreferrer"
            target="_blank"
            :href="txDetailsLink">
            <img
              src="/icons/external.svg"
              width="16"
              height="16"/>
        </a>
        </div>
        <div
          v-if="errorText"
          class="mt-4 whitespace-pre-line break-words">
          Reason: {{ errorText }}
        </div>
      </div>
      <div
        v-if="showSupportLink"
        class="flex mt-5 text-[var(--foreground)] ml-[calc(0.5rem+1.25rem)]">
        <a :href="DISCORD_SUPPORT_LINK" target="_blank">
          <Button
            size="sm"
            variant="outline">
            Contact support
          </Button>
        </a>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, toRefs, ref, watch } from 'vue'
  import type { Toast, ToastStep } from '~/components/ui/toast/useToastsStore'
  import { ToastStepStatus } from '~/components/ui/toast/useToastsStore'
  import { extractErrorMessage } from '~/lib/web3'
  import { UserRejectedRequestError } from 'viem'
  import { DISCORD_SUPPORT_LINK, getExplorerTransactionDetailsLink } from '~/constants/links'


  interface Props {
    toast: Toast
    step: ToastStep
    stepIndex: number // start from 0
  }
  
  const props = defineProps<Props>()
  const { toast, step, stepIndex } = toRefs(props)
  
  const isPending = computed(() => step.value.status === ToastStepStatus.PENDING)
  const isError = computed(() => step.value.status === ToastStepStatus.ERROR)
  
  const stepText = computed(() => {
    if (isError.value) {
      return `ERROR: ${step.value.text}`
    }
    return step.value.text
  })
  
  const icon = computed(() => {
    const iconMap = {
      [ToastStepStatus.ERROR]: '/icons/toast/toast-error.svg',
      [ToastStepStatus.SUCCESS]: '/icons/toast/toast-success.svg',
      [ToastStepStatus.INACTIVE]: '/icons/toast/toast-inactive.svg',
      [ToastStepStatus.PENDING]: '/icons/toast/toast-pending.svg',
    }
    return iconMap[step.value.status]
  })
  
  const txDetailsLink = computed(() => {
    if (!step.value.txHash || !toast.value.chainId) {
      return null
    }

    return getExplorerTransactionDetailsLink(step.value.txHash)
  })
  
  const isCurrentOrPreviousStep = computed(() => {
    const nextStepIsPending = toast.value.steps[stepIndex.value + 1]?.status === ToastStepStatus.PENDING
    return stepIndex.value === toast.value.stepToPerform || nextStepIsPending
  })
  
  const showSupportLink = computed(() => {
    return isCurrentOrPreviousStep.value && isError.value && !(step.value.error?.cause instanceof UserRejectedRequestError) && !(step.value.error instanceof UserRejectedRequestError)
  })
  
  const errorText = computed(() => {
    if (!step.value.error || !isError.value || !isCurrentOrPreviousStep.value) {
      return null
    }
  
    return extractErrorMessage(step.value.error)
  })
  
  const stepElement = ref<HTMLElement | null>(null)
  
  // Watch for when this step becomes pending
  watch(() => step.value.status, (newStatus) => {
    if (newStatus === ToastStepStatus.PENDING && stepElement.value) {
      // Add a small delay to ensure DOM is updated
      setTimeout(() => {
        stepElement.value?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }, 100)
    }
  }, { immediate: true })
  </script>
  
  