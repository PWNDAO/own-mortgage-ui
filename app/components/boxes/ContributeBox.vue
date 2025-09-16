<template>
    <div class="border p-4">
        <div class="flex justify-between">
            <h3 class="font-heading text-xl mb-4">Contribute to the crowdloan</h3>
            <DeadlineCountdown class="mt-1" />
        </div>
        <hr class="mb-4"/>
        <div class="mb-3">
            <AmountInput :is-input-disabled="isSubmitting" />
            <div v-if="lendAmount && Number(lendAmount) > 0" class="mt-2 text-sm text-gray-2">
                Note: You already deposited ${{ userDeposit }} USDC. This new deposit brings your total to ${{ Number(userDeposit) + Number(lendAmount) }} USDC.
            </div>
            <Button size="lg" class="h-[5rem] w-full flex justify-between items-center mt-3" :disabled="!canSubmit" @click="handleSubmit">
                <div>
                    <div class="text-2xl font-bold text-left">{{ lendButtonText }}</div>
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
    </div>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner'
import { CREDIT_NAME, CREDIT_DECIMALS, CREDIT_ADDRESS } from '~/constants/proposalConstants';
import { erc20Abi, parseUnits, type Address } from 'viem';
import useAmountInputStore from '~/composables/useAmountInputStore';
import { useMutation } from '@tanstack/vue-query';
import { useReadContract, useAccount } from '@wagmi/vue';

const amountInputStore = useAmountInputStore()
const { lendAmount } = storeToRefs(amountInputStore)

const { userDeposit } = useUserDeposit()

const lendButtonText = computed(() => {
    if (userDeposit.value > 0 && lendAmount.value) {
        return 'DEPOSIT MORE'
    }
    return 'DEPOSIT'
})

const { address } = useAccount()

const walletBalanceQuery = useReadContract({
    abi: erc20Abi,
    address: CREDIT_ADDRESS,
    functionName: 'balanceOf',
    args: [address as Ref<Address>],
})

const walletBalance = computed(() => walletBalanceQuery.data.value)

const canSubmit = computed(() => {
    if (!walletBalance.value) {
        return false
    }

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
        
        // TODO should we display the transaction hash somewhere in the UI, with link to block explorer?
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
