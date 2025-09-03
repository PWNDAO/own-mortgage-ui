<template>
    <div class="border p-4">
        <h3 class="text-xl font-heading">Crowdsourced DeFi mortgage - terms</h3>
        <p class="text-gray text-lg mt-1 mb-4">Crypto-backed mortgage-like crowdsourced DeFi loan with gradual installments.</p>
        <div class="grid grid-cols-5 gap-3 mb-6">
            <div v-for="item in TERMS_ITEMS" :key="item.label" class="border p-3">
                <div class="text-sm text-gray">{{ item.label }}</div>
                <div class="text-2xl font-semibold">{{ item.value }}</div>
            </div>
        </div>
        <div class="mt-6 mb-4">Raised so far</div>
        <ProgressBar />
    </div>
</template>

<script setup lang="ts">
const TERMS_ITEMS = [
    {
        label: 'Collateral',
        value: 'WETH',
    },
    {
        label: 'Credit',
        value: 'USDC',
    },
    {
        label: 'APR (fixed)',
        value: '42.74%',
    },
    {
        label: 'LTV',
        value: '75%',
    },
    {
        label: 'Duration',
        value: '2 years',
    },
]
</script>

