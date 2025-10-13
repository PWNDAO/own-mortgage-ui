<template>
  <Dialog v-model:open="isOpen">
      <DialogTrigger>
          <Button variant="outline">
              <div class="flex items-center gap-2">
                  <img :src="`/icons/telegram.svg`" alt="Notifications" class="w-4 h-4" />
                  <span>Setup notifications</span>
              </div>
          </Button>
      </DialogTrigger>
      <DialogContent>
          <DialogHeader class="max-w-full overflow-hidden">
              <DialogTitle>Sign up for updates</DialogTitle>
              <DialogDescription>
                  <div class="flex flex-col max-w-full">
                      <h5 class="text-lg text-white mb-4">
                          Get notified about this proposal
                      </h5>
              
                      <div class="space-y-4">
                          <div class="flex items-center space-x-3">
                              <input 
                                  type="checkbox" 
                                  id="email-notifications" 
                                  v-model="emailNotifications"
                                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <label for="email-notifications" class="text-sm font-medium text-white">
                                  Email notifications
                              </label>
                          </div>
                          
                          <div class="flex items-center space-x-3">
                              <input 
                                  type="checkbox" 
                                  id="telegram-notifications" 
                                  v-model="telegramNotifications"
                                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <label for="telegram-notifications" class="text-sm font-medium text-white">
                                  Telegram notifications
                              </label>
                          </div>
                          
                          <div class="flex items-center space-x-3">
                              <input 
                                  type="checkbox" 
                                  id="twitter-notifications" 
                                  v-model="twitterNotifications"
                                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <label for="twitter-notifications" class="text-sm font-medium text-white">
                                  Twitter notifications
                              </label>
                          </div>
                      </div>
                      
                      <div class="mt-6">
                          <Button 
                              class="w-full" 
                              @click="handleSignup"
                              :disabled="!hasAnyNotificationSelected"
                          >
                              Sign up for updates
                          </Button>
                      </div>
                      
                      <DialogClose>
                          <Button variant="outline" class="w-full mt-4">
                              Cancel
                          </Button>
                      </DialogClose>
                  </div>
              </DialogDescription>
          </DialogHeader>
      </DialogContent>
  </Dialog>
</template>
  
<script setup lang="ts">
import { ref, computed } from 'vue'
import { toast } from 'vue-sonner'

const isOpen = ref(false)
const emailNotifications = ref(false)
const telegramNotifications = ref(false)
const twitterNotifications = ref(false)

const hasAnyNotificationSelected = computed(() => {
    return emailNotifications.value || telegramNotifications.value || twitterNotifications.value
})

const handleSignup = () => {
    const selectedNotifications = []
    if (emailNotifications.value) selectedNotifications.push('Email')
    if (telegramNotifications.value) selectedNotifications.push('Telegram')
    if (twitterNotifications.value) selectedNotifications.push('Twitter')
    
    toast.success(`Successfully signed up for ${selectedNotifications.join(', ')} notifications!`)
    isOpen.value = false
    
    // Reset form
    emailNotifications.value = false
    telegramNotifications.value = false
    twitterNotifications.value = false
}

// Expose method to open modal programmatically
const openModal = () => {
    isOpen.value = true
}

defineExpose({
    openModal
})
</script>
