<template>
    <div class="bg-card border rounded-xl p-3 sm:p-4 order-4 lg:order-none shadow-lg">
        <h3 class="font-heading text-xl sm:text-2xl mb-2">Exclusive Rewards</h3>
        <div class="mb-4 text-sm sm:text-base text-justify">
            Lend and get rewards! Get various rewards based on the amount of liquidity you are able to lend. <b>Remember you are only lending, not donating this amount</b> and the loan is slowly repayed every few months. You can claim any time!
        </div>
        <div class="mb-4 p-3 bg-blue-900/20 border border-blue-600/30 rounded-lg">
            <p class="text-sm text-blue-200">
                💡 To see what rewards you are eligible for, input the total amount in the amount input field in the Contribute box above.
            </p>
        </div>
        <hr class="mb-4"/>
        
        <!-- Rewards list -->
        <div class="space-y-3">
            <div 
                v-for="reward in REWARDS" 
                :key="reward.amount" 
                class="border rounded-lg p-3 transition-all duration-200 bg-background/30"
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

        <div class="text-gray-2 mt-4 pl-1 italic">
            The reward will be tied to the address you are using to lend. Stay updated to claim your rewards:
            <button 
                class="text-blue-400 hover:text-blue-300 underline cursor-pointer"
                @click="notificationModalRef?.openModal()"
            >
                Subscribe
            </button>
            to our updates or contact info@bordel.wtf
        </div>
    </div>
    <NotificationSignupModal ref="notificationModalRef" :display-open-button="false" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CREDIT_NAME } from '~/constants/proposalConstants';
import useAmountInputStore from '~/composables/useAmountInputStore';
import NotificationSignupModal from '~/components/modals/NotificationSignupModal.vue';

const amountInputStore = useAmountInputStore()
const { lendAmount } = storeToRefs(amountInputStore)

const notificationModalRef = ref<InstanceType<typeof NotificationSignupModal> | null>(null)

const isAmountInputFilled = computed(() => {
    return lendAmount.value && lendAmount.value.trim() !== ''
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
        reward: '2 month membership in BORDEL hackerspace, zk badge with opening party invite POAP NFT',
        threshold: 1000,
    },
    {
        amount: `$3000+ ${CREDIT_NAME}`,
        reward: '6 month membership + above, BORDEL supporter T-shirt',
        threshold: 3000,
    },
    {
        amount: `$5000+ ${CREDIT_NAME}`,
        reward: '1 year membership + all above, free space to organize your private event',
        threshold: 5000,
    },
    {
        amount: `$10 000+ ${CREDIT_NAME}`,
        reward: '2 year VIP membership + all above, own private space, server hosting',
        threshold: 10000,
    },
    {
        amount: `$25 000+ ${CREDIT_NAME}`,
        reward: '5 year VIP membership + all above, access to every events, supporter art plaque and branding',
        threshold: 25000,
    },
    {
        amount: `$50 000+ ${CREDIT_NAME}`,
        reward: 'VIP supporter, custom reward and collaboration, contact us to discuss details',
        threshold: 50000,
    },
]

const isEligibleForReward = (reward: number) => {
    const amount = Number(lendAmount.value) || 0
    return amount >= reward
}

const getMissingAmount = (reward: number) => {
    const amount = Number(lendAmount.value) || 0
    const missing = reward - amount
    return missing > 0 ? missing : 0
}
</script>
