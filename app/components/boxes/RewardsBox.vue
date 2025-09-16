<template>
    <div class="border p-4">
        <h3 class="font-heading text-xl mb-3">Rewards</h3>
        <div class="mb-4">
            Lend and get rewards! Based on your tier you will be eligible to receive different benefits.
        </div>
        <hr class="mb-4"/>
        <div class="grid grid-cols-2 gap-3">
            <div v-for="reward in REWARDS" :key="reward.amount">
                <div class="text-center text-lg font-medium border p-4">
                    <div class="font-heading">{{ reward.amount }}</div>
                    <div>{{ reward.reward }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { CREDIT_NAME } from '~/constants/proposalConstants';

const REWARDS = [
    {
        amount: `$1000+ ${CREDIT_NAME}`,
        reward: '3 months membership',
    },
    {
        amount: `$3000+ ${CREDIT_NAME}`,
        reward: '1 year membership',
    },
    {
        amount: `$5000+ ${CREDIT_NAME}`,
        reward: 'Organize private event for free',
    },
    {
        amount: `$10000+ ${CREDIT_NAME}`,
        reward: 'VIP membership',
    },
]
</script>
