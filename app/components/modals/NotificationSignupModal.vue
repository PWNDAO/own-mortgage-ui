<template>
    <Dialog v-model:open="isOpen">
        <DialogTrigger v-if="props.displayOpenButton">
            <Button variant="outline">
                <div class="flex items-center gap-2">
                    <img :src="`/icons/telegram.svg`" alt="Notifications" class="w-4 h-4" />
                    <span class="text-xs">Get Updates</span>
                </div>
            </Button>
        </DialogTrigger>
        <DialogContent :class="{'lg:max-w-[45rem]!': isDisplayedAfterDeposit}">
            <DialogHeader class="max-w-full overflow-hidden">
                <DialogTitle :class="{'text-bordel-green': isDisplayedAfterDeposit}">
                    <template v-if="isDisplayedAfterDeposit">Your deposit to BORDEL Mortgage was successful!</template>
                    <template v-else>Sign up for BORDEL updates</template>
                </DialogTitle>
            </DialogHeader>
            <div class="flex flex-col max-w-full">
                <template v-if="isDisplayedAfterDeposit">
                    <p class="mb-2">
                        Your deposit is now earning interest in the AAVE pool, where it will remain until the BORDEL
                        team accepts the loan.
                        Until the loan is accepted, you can withdraw your deposit at any time.
                    </p>
                    <p class="mb-4">
                        Once the loan is accepted and the first repayment is made, you’ll be able to claim your share of
                        the repayments here in the app.
                    </p>
                    <hr />
                </template>
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
import { ref } from 'vue'

interface Props {
    displayOpenButton?: boolean
}
const props = withDefaults(defineProps<Props>(), {
    displayOpenButton: true
})

const isOpen = ref(false)

const isDisplayedAfterDeposit = ref(false)

onUnmounted(() => {
    isDisplayedAfterDeposit.value = false
})

// Expose method to open modal programmatically
const openModal = (isAfterDeposit: boolean = false) => {
    isOpen.value = true
    if (isAfterDeposit) {
        isDisplayedAfterDeposit.value = true
    }
}

defineExpose({
    openModal
})
</script>
