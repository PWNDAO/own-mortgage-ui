<template>
    <div class="border p-4">
        <h3 class="text-xl font-heading">Crowdsourced DeFi mortgage - terms</h3>
        <p class="text-gray-2 text-lg mt-1 mb-4">Crypto-backed mortgage-like crowdsourced DeFi loan with gradual installments.</p>
        <div class="grid grid-cols-5 gap-3 mb-4">
            <div v-for="item in TERMS_ITEMS" :key="item.label" class="border p-3">
                <div class="text-sm text-gray">{{ item.label }}</div>
                <div v-if="item.label === PROPOSAL_DURATION_LABEL">
                    <DeadlineCountdown class="text-2xl font-semibold" />
                </div>
                <div v-else class="text-2xl font-semibold">{{ item.value }}</div>
            </div>
        </div>
        <div class="mb-8">Raised so far</div>
        <ProgressBar />
    </div>
</template>

<script setup lang="ts">
import { COLLATERAL_NAME, CREDIT_NAME, LOAN_DURATION_IN_YEARS, LOAN_LTV } from '~/constants/proposalConstants';

const PROPOSAL_DURATION_LABEL = "Deadline"

const TERMS_ITEMS = [
    {
        label: 'Collateral',
        value: COLLATERAL_NAME,
    },
    {
        label: 'Credit',
        value: CREDIT_NAME,
    },
    {
        label: 'LTV',
        value: `${LOAN_LTV / 100}%`,
    },
    {
        label: 'Loan Duration',
        value: `${LOAN_DURATION_IN_YEARS}y`,
    },
    {
        label: PROPOSAL_DURATION_LABEL,
        value: `${LOAN_DURATION_IN_YEARS}y`,
    }
]
</script>

