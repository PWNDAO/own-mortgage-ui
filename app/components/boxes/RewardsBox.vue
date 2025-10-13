<template>
    <div class="border p-4">
        <h3 class="font-heading text-xl mb-3">Rewards</h3>
        <div class="mb-4">
            Lend and get rewards! Based on your tier you will be eligible to receive different benefits.
        </div>
        <hr class="mb-4"/>
        
        <!-- Amount input for calculating rewards -->
        <div class="mb-4">
            <label class="text-sm font-medium mb-2 block">Calculate rewards for your amount:</label>
            <div class="flex items-center gap-2">
                <Input
                    v-model="rewardCalculationAmount"
                    :placeholder="'Enter amount of ' + CREDIT_NAME"
                    class="flex-1"
                />
            </div>
        </div>
        
        <!-- Rewards list -->
        <div class="space-y-3">
            <div 
                v-for="reward in REWARDS" 
                :key="reward.amount" 
                class="border p-3 transition-all duration-200"
                :class="{
                    'bg-green-900/20 border-green-600/50': isAmountInputFilledAndEligibleForReward(reward.threshold),
                    'opacity-60': isAmountInputFilledAndNotEligibleForReward(reward.threshold)
                }"
            >
                <div class="flex justify-between items-center">
                    <div :class="{ 'opacity-75': isAmountInputFilledAndNotEligibleForReward(reward.threshold) }">
                        <div
                        class="font-medium" 
                        :class="{ 
                            'text-green-400': isAmountInputFilledAndEligibleForReward(reward.threshold), 
                            'text-gray-500': isAmountInputFilledAndNotEligibleForReward(reward.threshold),
                        }">
                            {{ reward.amount }}
                        </div>
                        <div
                        class="text-sm" 
                        :class="{ 
                            'text-green-300': isAmountInputFilledAndEligibleForReward(reward.threshold), 
                            'text-gray-400': isAmountInputFilledAndNotEligibleForReward(reward.threshold),
                        }">
                            {{ reward.reward }}
                        </div>
                    </div>
                    <div v-if="isAmountInputFilledAndEligibleForReward(reward.threshold)" class="flex items-center gap-2 text-green-400 font-semibold text-sm">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                        <span>Eligible</span>
                    </div>
                    <div v-else-if="isAmountInputFilled" class="text-sm">
                        {{ getMissingAmount(reward.threshold) }} {{ CREDIT_NAME }} more needed
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { CREDIT_NAME } from '~/constants/proposalConstants';

const rewardCalculationAmount = ref('')

const isAmountInputFilled = computed(() => {
    return rewardCalculationAmount.value && rewardCalculationAmount.value.trim() !== ''
})

const isAmountInputFilledAndEligibleForReward = (rewardThreshold: number) => {
    return isAmountInputFilled.value && isEligibleForReward(rewardThreshold)
}

const isAmountInputFilledAndNotEligibleForReward = (rewardThreshold: number) => {
    return isAmountInputFilled.value && !isEligibleForReward(rewardThreshold)
}

const REWARDS = [
    {
        amount: `$1000+ ${CREDIT_NAME}`,
        reward: '3 months membership',
        threshold: 1000,
    },
    {
        amount: `$3000+ ${CREDIT_NAME}`,
        reward: '1 year membership',
        threshold: 3000,
    },
    {
        amount: `$5000+ ${CREDIT_NAME}`,
        reward: 'Organize private event for free',
        threshold: 5000,
    },
    {
        amount: `$10000+ ${CREDIT_NAME}`,
        reward: 'VIP membership',
        threshold: 10000,
    },
]

const isEligibleForReward = (reward: number) => {
    const amount = Number(rewardCalculationAmount.value) || 0
    return amount >= reward
}

const getMissingAmount = (reward: number) => {
    const amount = Number(rewardCalculationAmount.value) || 0
    const missing = reward - amount
    return missing > 0 ? missing : 0
}
</script>
