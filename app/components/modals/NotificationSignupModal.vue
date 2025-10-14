<template>
  <Dialog v-model:open="isOpen">
      <DialogTrigger v-if="props.displayOpenButton">
          <Button variant="outline">
              <div class="flex items-center gap-2">
                  <img :src="`/icons/telegram.svg`" alt="Notifications" class="w-4 h-4" />
                  <span>Setup notifications</span>
              </div>
          </Button>
      </DialogTrigger>
      <DialogContent>
          <DialogHeader class="max-w-full overflow-hidden">
              <DialogTitle>Sign up for BORDEL updates</DialogTitle>
              <DialogDescription>
                  <div class="flex flex-col max-w-full">
                      <div class="mt-6">
                        <a href="https://preview.mailerlite.io/forms/1856832/168246520956585532/share" target="_blank">
                            <Button 
                              class="w-full">
                              Sign up for updates (email)
                            </Button>
                        </a>
                      </div>
                  </div>
              </DialogDescription>
          </DialogHeader>
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

// Expose method to open modal programmatically
const openModal = () => {
    isOpen.value = true
}

defineExpose({
    openModal
})
</script>
