<template>
  <Dialog v-model:open="isOpen">
      <DialogTrigger>
          <Button variant="outline">
              <div class="flex items-center gap-2">
                  <img :src="`/icons/share.svg`" alt="Share" class="w-4 h-4" />
                  <span class="text-sm">Share</span>
              </div>
          </Button>
      </DialogTrigger>
      <DialogContent>
          <DialogHeader class="max-w-full overflow-hidden">
              <DialogTitle>Share Proposal</DialogTitle>
              <DialogDescription>
                  <div class="flex flex-col max-w-full">
                      <h5 class="text-lg text-white mb-4">
                          Share via
                      </h5>
              
                      <div class="flex justify-between gap-2 w-full flex-wrap">
                          <NuxtLink
                          v-for="(button, index) in socialButtons"
                          :key="index"
                          class="flex-grow"
                          :to="button.link.value"
                          target="_blank">
                            <Button class="w-full">
                              <img :src="button.icon" :alt="button.name" />
                              <span>{{ button.name }}</span>
                            </Button>
                          </NuxtLink>
                      </div>
                      <div class="flex flex-col mt-4">
                          <h5 class="text-lg mb-4 text-white">
                            Copy link
                          </h5>
              
                          <div class="w-full flex items-center">
                          <div :class="['py-2 px-4 border text-white h-10 overflow-hidden text-ellipsis text-nowrap flex-shrink', { 'text-primary-foreground!': copied }]">
                              {{ linkToThisPage }}
                          </div>
                          <Button
                              class="ml-3 w-24 h-10"
                              @click="copy">
                                <span>{{ buttonText }}</span>
                                <img src="/icons/copy.svg" alt="copy" class="ml-2" />
                          </Button>
                          </div>
                      </div>
                      <DialogClose>
                          <Button class="w-full mt-8">
                              Done
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
import { useBrowserLocation, useClipboard } from '@vueuse/core'
  
const browserLocation = useBrowserLocation()

const isOpen = ref(false)

const linkToThisPage = computed(() => `${browserLocation.value.href ?? ''}`)

const encodedLinkToThisPage = computed(() => encodeURIComponent(linkToThisPage.value || ''))

const SHARE_MESSAGE = 'Check out this Bordel DeFi mortgage on OWN!'
const encodedShareMessage = computed(() => encodeURIComponent(SHARE_MESSAGE || ''))

const twitterLink = computed(() => `https://x.com/intent/tweet?text=${encodedShareMessage.value}&url=https://x.com/pwndao/status/1992368972138975342&hashtags=defi`)
const telegramLink = computed(() => `https://t.me/share/url?text=${encodedShareMessage.value}&url=${encodedLinkToThisPage.value}`)
const warpcastLink = computed(() => `https://warpcast.com/~/compose?text=${encodedShareMessage.value}%20https://farcaster.xyz/pwndao/0xa0bafe4b`)
const socialButtons = [
  { name: 'Twitter', icon: '/icons/twitter.svg', link: twitterLink },
  { name: 'Telegram', icon: '/icons/telegram.svg', link: telegramLink },
  { name: 'Farcaster', icon: '/icons/warpcaster.svg', link: warpcastLink },
]

const { copy, copied } = useClipboard({
  source: linkToThisPage,
  copiedDuring: 2000,
})
const buttonText = computed(() => (copied.value ? 'Copied!' : 'Copy'))
</script>
