<template>
    <Dialog v-model:open="isOpen">
        <DialogContent class="lg:max-w-[45rem]">
            <DialogHeader class="max-w-full overflow-hidden">
                <DialogTitle class="text-bordel-green">
                    Your deposit to BORDEL Mortgage was successful!
                </DialogTitle>
            </DialogHeader>
            <div class="flex flex-col max-w-full">
                <p class="mb-2">
                    Your deposit is now earning interest in an AAVE V3 pool, where it will remain until the BORDEL
                    team accepts the loan or until you withdraw it back to your wallet.
                </p>
                <p class="mb-4">
                    Once the loan is accepted and the first repayment is made, you'll be able to claim your share of
                    the repayments here in the app.
                </p>
                <hr />
                
                <p class="mt-4">
                    Stay informed about BORDEL updates and news by signing up for our email updates.
                </p>
                <div class="mt-6">
                    <a href="https://preview.mailerlite.io/forms/1856832/168246520956585532/share" target="_blank">
                        <Button class="w-full">
                            Sign up for updates (email)
                        </Button>
                    </a>
                </div>

                <div class="flex flex-col mt-6">
                    <h5 class="text-lg text-white mb-4">
                        Share your contribution
                    </h5>
            
                    <div class="flex justify-between gap-2 w-full flex-wrap">
                        <NuxtLink
                        v-for="(button, index) in socialButtons"
                        :key="index"
                        class="flex-grow"
                        :to="button.link.value"
                        target="_blank">
                            <Button class="w-full" variant="outline">
                                <img :src="button.icon" :alt="button.name" />
                                <span>{{ button.name }}</span>
                            </Button>
                        </NuxtLink>
                    </div>
                </div>

                <hr class="my-4" />

                <p class="text-sm text-muted-foreground">
                    If you have any questions, please reach us at <a
                        href="mailto:info@bordel.wtf"
                        class="text-bordel-green underline hover:no-underline">info@bordel.wtf</a>.
                </p>
            </div>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useBrowserLocation } from '@vueuse/core'

const isOpen = ref(false)

const browserLocation = useBrowserLocation()

const linkToThisPage = computed(() => `${browserLocation.value.href ?? ''}`)

const encodedLinkToThisPage = computed(() => encodeURIComponent(linkToThisPage.value || ''))

const SHARE_MESSAGE = 'I just funded the first DeFi mortgage! Check it out here!'
const encodedShareMessage = computed(() => encodeURIComponent(SHARE_MESSAGE || ''))

const twitterLink = computed(() => `https://x.com/intent/tweet?text=${encodedShareMessage.value}&url=${encodedLinkToThisPage.value}&hashtags=p2p,defi`)
const telegramLink = computed(() => `https://t.me/share/url?text=${encodedShareMessage.value}&url=${encodedLinkToThisPage.value}`)
const warpcastLink = computed(() => `https://warpcast.com/~/compose?text=${encodedShareMessage.value}%20${encodedLinkToThisPage.value}`)

const socialButtons = [
  { name: 'Twitter', icon: '/icons/twitter.svg', link: twitterLink },
  { name: 'Telegram', icon: '/icons/telegram.svg', link: telegramLink },
  { name: 'Farcaster', icon: '/icons/warpcaster.svg', link: warpcastLink },
]

// Expose method to open modal programmatically
const openModal = () => {
    isOpen.value = true
}

defineExpose({
    openModal
})
</script>
