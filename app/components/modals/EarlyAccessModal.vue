<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger v-if="props.displayOpenButton" as-child>
      <Button variant="default" class="font-semibold">
        Get your OWN mortgage!
      </Button>
    </DialogTrigger>
    <DialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Early Access Registration</DialogTitle>
        <DialogDescription>
            Interested in getting mortgage financing for your project through DeFi? 
            Fill out the form below and we'll reach out to discuss how to do this!
        </DialogDescription>
      </DialogHeader>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div class="space-y-2">
          <label for="commsChannel" class="text-sm font-medium">Preferred communication channel</label>
          <input 
            type="text" 
            id="commsChannel" 
            v-model="formData.commsChannel"
            required 
            placeholder="Email, Telegram, Signal, etc."
            class="w-full px-3 py-2 border rounded-md bg-background"
          >
        </div>

        <div class="space-y-2">
          <label for="projectDescription" class="text-sm font-medium">
            Describe the project you'd like to get mortgage financing for
          </label>
          <textarea 
            id="projectDescription" 
            v-model="formData.projectDescription"
            required
            rows="6"
            placeholder="Tell us about your project..."
            class="w-full px-3 py-2 border rounded-md bg-background resize-y"
          ></textarea>
        </div>

        <Button type="submit" class="w-full" :disabled="isSubmitting">
          {{ isSubmitting ? 'Submitting...' : 'Submit Application' }}
        </Button>

        <p v-if="submitMessage" class="text-sm text-center" :class="submitSuccess ? 'text-green-400' : 'text-red-400'">
          {{ submitMessage }}
        </p>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
    displayOpenButton?: boolean
}
const props = withDefaults(defineProps<Props>(), {
    displayOpenButton: true
})

const isOpen = ref(false)
const isSubmitting = ref(false)
const submitMessage = ref('')
const submitSuccess = ref(false)

const formData = ref({
  commsChannel: '',
  projectDescription: ''
})

// Replace this URL with your Google Apps Script web app URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw03rLMfrOQSbX2MkRrpFHxTHM6qWjOkgTUZON7qv9qii-coSHXHmDW-vKu5NxZzgPVpA/exec'

const handleSubmit = async () => {
  isSubmitting.value = true
  submitMessage.value = ''
  
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        commsChannel: formData.value.commsChannel,
        projectDescription: formData.value.projectDescription,
        timestamp: new Date().toISOString()
      })
    })
    
    // With no-cors mode, we can't read the response, so assume success
    submitMessage.value = 'Application submitted successfully!'
    submitSuccess.value = true
    
    // Reset form
    formData.value.commsChannel = ''
    formData.value.projectDescription = ''
    
    // Close modal after 2 seconds
    setTimeout(() => {
      isOpen.value = false
      submitMessage.value = ''
    }, 2000)
  } catch (error) {
    console.error('Submission error:', error)
    submitMessage.value = 'Failed to submit. Please try again.'
    submitSuccess.value = false
  } finally {
    isSubmitting.value = false
  }
}

// Expose method to open modal programmatically
const openModal = () => {
    isOpen.value = true
}

defineExpose({
    openModal
})
</script>
