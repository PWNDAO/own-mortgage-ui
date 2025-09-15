<template>
    <div class="border p-4">
        <h3 class="text-center font-heading text-xl mb-4 font-semibold text-gray">CONTRIBUTE TO THE CROWDLOAN</h3>
        <div class="mb-3">
            <AmountInput :is-input-disabled="isSubmitting" />
            <Button size="lg" class="h-[5rem] w-full flex justify-between items-center mt-3" :disabled="!canSubmit" @click="handleSubmit">
                <div>
                    <div class="text-2xl font-bold text-left">LEND</div>
                    <div class="flex items-center gap-1 text-sm">
                        <span>+</span>
                        <span>earn rewards</span>
                    </div>
                </div>
                <div>
                    <div class="flex justify-end mb-1">
                        <img src="/icons/usdc.svg" alt="USDC" width="32" height="32">
                    </div>
                </div>
            </Button>
        </div>
        <DeadlineCountdown />
    </div>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner'
import { CREDIT_NAME, CREDIT_DECIMALS } from '~/constants/proposalConstants';
import { parseUnits } from 'viem';
import useAmountInputStore from '~/composables/useAmountInputStore';
import { useMutation } from '@tanstack/vue-query';

const amountInputStore = useAmountInputStore()
const { lendAmount } = storeToRefs(amountInputStore)

// TODO fetch from real data
const walletBalance = ref(51200432563n)

const canSubmit = computed(() => {
    const amountStr = lendAmount.value || '0'
    if (amountStr === '0' || amountStr === '') return false
    
    try {
        const amount = parseUnits(amountStr, CREDIT_DECIMALS)
        return amount > 0n && amount <= walletBalance.value
    } catch {
        return false
    }
})

const { createLendingProposal } = useLend()

const { isPending: isSubmitting, mutateAsync: handleSubmit } = useMutation({
    mutationKey: ['createLendingProposal'],
    mutationFn: async () => {
        if (!lendAmount.value) {
            return
        }

        const lendAmountCopy = lendAmount.value
        
        const createLendingProposalPromise = createLendingProposal()
        
        toast.promise(createLendingProposalPromise, {
            loading: `Creating lending proposal for ${lendAmountCopy} ${CREDIT_NAME}...`,
            success: () => {
                return `Lending proposal for ${lendAmountCopy} ${CREDIT_NAME} created successfully`
            },
            error: () => {
                return `Failed to create lending proposal for ${lendAmountCopy} ${CREDIT_NAME}`
            },
        })

        await createLendingProposalPromise
        // Clear the input after submission
        lendAmount.value = ''
    },
    throwOnError: true,
})
</script>
