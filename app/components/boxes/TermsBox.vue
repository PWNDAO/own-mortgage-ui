<template>
    <div class="bg-card border rounded-xl p-3 sm:p-4 order-2 lg:order-none shadow-lg">
        <h3 class="text-xl sm:text-2xl font-heading mb-2">Loan Terms</h3>
        <p class="text-gray-2 text-sm sm:text-base mb-4">Crypto-backed mortgage with gradual installments.</p>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            <div v-for="item in TERMS_ITEMS" :key="item.label" class="border rounded-lg p-3 bg-background/50">
                <div class="text-sm text-gray">{{ item.label }}</div>
                <div v-if="item.label === PROPOSAL_DURATION_LABEL">
                    <DeadlineCountdown class="text-lg sm:text-xl md:text-2xl font-semibold" />
                </div>
                <div 
                    v-else 
                    class="text-lg sm:text-xl md:text-2xl font-semibold flex items-center gap-2">
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
        
        <!-- Expandable Details -->
        <Accordion type="single" collapsible class="mt-3">
            <AccordionItem value="details">
                <AccordionTrigger class="text-sm text-gray-400 hover:text-gray-200">
                    View Token Details
                </AccordionTrigger>
                <AccordionContent>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div class="border rounded-lg p-3 bg-background/50">
                            <div class="text-sm text-gray-400 mb-1">Collateral Token</div>
                            <div class="flex items-center gap-2">
                                <span class="font-semibold">{{ COLLATERAL_NAME }}</span>
                                <a :href="getExplorerTokenAddressLink(COLLATERAL_ADDRESS)" target="_blank" class="cursor-pointer group">
                                    <img
                                        src="/icons/external.svg"
                                        alt="Block Explorer Link"
                                        class="w-3 h-3 transition-all duration-200 group-hover:brightness-0 group-hover:invert"
                                        style="filter: brightness(0) saturate(100%) invert(40%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(89%);"
                                    />
                                </a>
                            </div>
                        </div>
                        <div class="border rounded-lg p-3 bg-background/50">
                            <div class="text-sm text-gray-400 mb-1">Credit Token</div>
                            <div class="flex items-center gap-2">
                                <span class="font-semibold">{{ CREDIT_NAME }}</span>
                                <a :href="getExplorerTokenAddressLink(CREDIT_ADDRESS)" target="_blank" class="cursor-pointer group">
                                    <img
                                        src="/icons/external.svg"
                                        alt="Block Explorer Link"
                                        class="w-3 h-3 transition-all duration-200 group-hover:brightness-0 group-hover:invert"
                                        style="filter: brightness(0) saturate(100%) invert(40%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(89%);"
                                    />
                                </a>
                            </div>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </div>
</template>

<script setup lang="ts">
import { COLLATERAL_ADDRESS, COLLATERAL_NAME, CREDIT_ADDRESS, CREDIT_NAME, LOAN_DURATION_IN_YEARS, LOAN_LTV } from '~/constants/proposalConstants';
import { getExplorerTokenAddressLink } from '~/constants/links';

const PROPOSAL_DURATION_LABEL = "Deadline"

// Only show critical terms - details moved to expandable section
const TERMS_ITEMS = [
    {
        label: 'LTV',
        value: `${LOAN_LTV / 100}%`,
        tooltip: 'Loan-to-Value Ratio'
    },
    {
        label: 'Duration',
        value: `${LOAN_DURATION_IN_YEARS}y`,
        tooltip: 'Loan Duration'
    },
    {
        label: PROPOSAL_DURATION_LABEL,
        value: `${LOAN_DURATION_IN_YEARS}y`,
        tooltip: 'Funding Deadline'
    }
]

const isCollateralOrCreditNameItem = (itemLabel: string) => {
    return false // No longer needed in main grid
}
</script>

