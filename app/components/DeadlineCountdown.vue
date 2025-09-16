<template>
    <div class="text-gray-2 text-right text-sm">
        <span>Deadline: {{ countdownText }}</span>
    </div>
</template>

<script setup lang="ts">
import { PROPOSAL_EXPIRATION } from '~/constants/proposalConstants'

const deadline = new Date(PROPOSAL_EXPIRATION * 1000).getTime()
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