<template>
    <div class="border p-4">
        <h3 class="text-center font-heading text-xl mb-4 font-semibold text-gray">CONTRIBUTE TO THE CROWDLOAN</h3>
        <div class="mb-3">
            <LendModal />
        </div>
        <div class="text-gray text-right text-sm">
            <span>Deadline: {{ countdownText }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
// Set deadline to 03.04.2025 1 pm CET
const deadline = new Date('2026-04-02T12:00:00+02:00').getTime()
const countdownText = ref('')
let timer: ReturnType<typeof setInterval> | null = null

const updateCountdown = () => {
    const now = new Date().getTime()
    const distance = deadline - now

    // Calculate days, hours, minutes, and seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24))
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((distance % (1000 * 60)) / 1000)

    let string = ``

    // Include days in the countdown if there are any
    if (days > 0) string += `${days}d `
    if (hours > 0) string += `${hours}h `
    if (minutes > 0) string += `${minutes}m `
    if (seconds > 0) string += `${seconds}s`

    // Ensure we always have a non-empty string
    if (string === '') {
        string = '0s'
    }

    countdownText.value = string

    if (distance < 0) {
        if (timer) clearInterval(timer)
        countdownText.value = 'Deadline passed'
    }
}

onMounted(() => {
    updateCountdown()
    timer = setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
    if (timer) {
        clearInterval(timer)
    }
})
</script>
