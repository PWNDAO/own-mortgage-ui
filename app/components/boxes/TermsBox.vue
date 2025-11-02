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
                <div 
                    v-else 
                    class="text-2xl font-semibold flex items-center gap-2">
                    <span>{{ item.value }}</span>
                    <template v-if="isCollateralOrCreditNameItem(item.label)">
                        <a :href="getExplorerTokenAddressLink(item.address!)" target="_blank" class="cursor-pointer group">
                            <img
                                src="/icons/external.svg"
                                alt="Block Explorer Link"
                                class="w-4 h-4 transition-all duration-200 group-hover:brightness-0 group-hover:invert"
                                style="filter: brightness(0) saturate(100%) invert(40%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(89%);"
                            />
                        </a>
                    </template>
                </div>
            </div>
        </div>
        <div class="mb-8">Raised so far</div>
        <ProgressBar />
    </div>
</template>

<script setup lang="ts">
import { COLLATERAL_ADDRESS, COLLATERAL_NAME, CREDIT_ADDRESS, CREDIT_NAME, LOAN_DURATION_IN_YEARS, LOAN_LTV } from '~/constants/proposalConstants';
import { getExplorerTokenAddressLink } from '~/constants/links';

const PROPOSAL_DURATION_LABEL = "Deadline"
const COLLATERAL_NAME_LABEL = "Collateral"
const CREDIT_NAME_LABEL = "Credit"

const TERMS_ITEMS = [
    {
        label: COLLATERAL_NAME_LABEL,
        value: COLLATERAL_NAME,
        address: COLLATERAL_ADDRESS,
    },
    {
        label: CREDIT_NAME_LABEL,
        value: CREDIT_NAME,
        address: CREDIT_ADDRESS
    },
    {
        label: 'LTV',
        value: `${LOAN_LTV / 100}%`,
    },
    {
        label: 'Duration',
        value: `${LOAN_DURATION_IN_YEARS}y`,
    },
    {
        label: PROPOSAL_DURATION_LABEL,
        value: `${LOAN_DURATION_IN_YEARS}y`,
    }
]

const isCollateralOrCreditNameItem = (itemLabel: string) => {
    return itemLabel === COLLATERAL_NAME_LABEL || itemLabel === CREDIT_NAME_LABEL
}
</script>

