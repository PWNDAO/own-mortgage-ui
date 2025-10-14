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
    console.log('displayedToast', displayedToast)
    if (!displayedToast) {
      toastsStore.displayToast(toast.value)
      displayedToast = toastsStore.getToast(toast.value.id)!
      console.log('toast.value.id', toast.value.id)
      console.log('displayedToast', displayedToast)
    }

    // Use a while loop to always get the latest displayedToast and process unprocessed steps
    while (true) {
      const currentToast = toastsStore.getToast(toast.value.id)
      console.log('currentToast', currentToast)
      if (!currentToast) break

      const stepIndex = currentToast.stepToPerform
      console.log('stepIndex', stepIndex)
      if (stepIndex >= currentToast.steps.length) break

      const step = currentToast.steps[stepIndex]!
      step.status = ToastStepStatus.PENDING
      let success: boolean = false
      let error: Error | undefined = undefined
      try {
        success = await step.fn(step)
      } catch (err) {
        success = false
        error = err as Error
      }
      if (!success) {
        step.status = ToastStepStatus.ERROR
        if (error) {
          step.error = error
          throw error
        } else {
          console.error('Error when processing step', step)
          throw new Error(`Error while performing a step number ${stepIndex} on toast ID ${currentToast.id}.`)
        }
      } else {
        step.status = ToastStepStatus.SUCCESS
        currentToast.stepToPerform = stepIndex + 1
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
