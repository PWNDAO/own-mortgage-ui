<template>
    <div v-if="isConnected && userDeposit && userDeposit > 0" class="border p-4">
        <h3 class="font-heading text-xl mb-4">Your contribution (${{ userDeposit }} {{ CREDIT_NAME }})</h3>
        <hr class="mb-4"/>
        <div>
            <div>Your ${{ userDeposit }} {{ CREDIT_NAME }} deposit earns interest in AAVE until accepted.</div>
            <div>You can deposit more below or <span class="underline hover:text-gray-2 transition duration-300 hover:cursor-pointer" @click="handleWithdraw">withdraw</span> anytime before acceptance.</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import useUserDeposit from '~/composables/useUserDeposit';
import { useAccount } from '@wagmi/vue';
import { CREDIT_NAME } from '~/constants/proposalConstants';

const { isConnected } = useAccount()

// TODO fetch real data here
const { userDeposit } = useUserDeposit()

const handleWithdraw = () => {
    // TODO call here the contract to withdraw the deposit
}
</script>
