import { computed, watch } from 'vue'
import type { Ref } from 'vue'
import { ToastStepStatus, useToastsStore } from '~/components/ui/toast/useToastsStore'
import type { Toast } from '~/components/ui/toast/useToastsStore'

// note: if we would need, we can create something similar that is not dependent on a toast instance passed
export default function useActionFlow(toast: Ref<Toast>) {
  if (toast.value._initInActionFlow) {
    throw new Error('Every toast should be called in useActionFlow(toast as Ref<Toast>) just once.')
  }
  toast.value._initInActionFlow = true

  const toastsStore = useToastsStore()
  const _displayedToast = computed(() => toastsStore.getToast(toast.value?.id))
  const unwatcher = watch(_displayedToast, (newDisplayedToast) => {
    // TODO is this enough?
    if (!newDisplayedToast) {
      return
    }

    toast.value = newDisplayedToast
  })

  const continueFlow = async () => {
    const toastsStore = useToastsStore()
    // Ensure the toast is displayed
    let displayedToast = toastsStore.getToast(toast.value.id)
    if (!displayedToast) {
      toastsStore.displayToast(toast.value)
      displayedToast = toastsStore.getToast(toast.value.id)!
    }

    // Use a while loop to always get the latest displayedToast and process unprocessed steps
    while (true) {
      const currentToast = toastsStore.getToast(toast.value.id)
      if (!currentToast) break

      const stepIndex = currentToast.stepToPerform
      if (stepIndex >= currentToast.steps.length) break

      const step = currentToast.steps[stepIndex]!
      
      // Get all batched steps using the Toast helper method
      const batchedSteps = currentToast.getBatchedSteps(stepIndex)
      
      console.log(`[ActionFlow] Processing step ${stepIndex}, found ${batchedSteps.length} batched steps`)
      console.log(`[ActionFlow] Step isBatched=${step.isBatched}, txHash=${step.txHash}`)
      
      // Set all batched steps to PENDING simultaneously
      batchedSteps.forEach(s => {
        s.status = ToastStepStatus.PENDING
      })
      
      let success: boolean = false
      let error: Error | undefined = undefined
      try {
        success = await step.fn(step)
      } catch (err) {
        success = false
        error = err as Error
      }
      
      if (!success) {
        // Mark all batched steps as ERROR with the same error
        currentToast.syncBatchedStepsStatus(stepIndex, ToastStepStatus.ERROR, error)
        
        console.log(`[ActionFlow] Marked ${batchedSteps.length} steps as ERROR`)
        
        if (error) {
          throw error
        } else {
          console.error('Error when processing step', step)
          throw new Error(`Error while performing a step number ${stepIndex} on toast ID ${currentToast.id}.`)
        }
      } else {
        // Mark all batched steps as SUCCESS
        currentToast.syncBatchedStepsStatus(stepIndex, ToastStepStatus.SUCCESS)
        
        console.log(`[ActionFlow] Marked ${batchedSteps.length} steps as SUCCESS`)
        
        // Skip all batched steps
        currentToast.stepToPerform = stepIndex + batchedSteps.length
      }
    }

    unwatcher()
    // @ts-expect-error FIXME: strictNullChecks
    toast.value = undefined
  }

  return {
    continueFlow,
  }
}
