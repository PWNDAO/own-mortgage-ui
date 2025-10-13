<template>
    <div class="border p-4">
        <div class="flex justify-between">
            <h3 class="font-heading text-xl mb-4">Contribute to the crowdloan</h3>
        </div>
        <hr class="mb-4"/>
        <div class="mb-3">
            <AmountInput 
                :is-input-disabled="isSubmitting" 
                :prefilled-amount="userDepositFormatted" 
            />
            <div v-if="isAmountInputLowerThanUserDeposit" class="mt-2 text-sm text-gray-2">
                Setting amount to {{ lendAmount }} {{ CREDIT_NAME }} will withdraw {{ amountToWithdraw }} {{ CREDIT_NAME }} from your deposit.
            </div>

            <div class="mt-3 p-3 border border">
                <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-300">Minimal APR:</span>
                    <span class="text-lg font-semibold text-green-400">2.5%</span>
                </div>
                <div class="text-xs text-gray-400 mt-1">
                    You also earn interest while waiting for loan acceptance
                </div>
            </div>
            
            <Button 
                size="lg" 
                class="h-[5rem] w-full flex justify-between items-center mt-3" 
                :disabled="!canSubmit" 
                @click="handleSubmit"
            >
                <div>
                    <div class="text-2xl font-bold text-left">{{ lendButtonText }}</div>
                    <div class="flex items-center gap-1 text-sm">
                        <span v-if="amountToDepositAdditionally > 0">+ earn 2% or more</span>
                    </div>
                </div>
                <div>
                    <div class="flex justify-end mb-1">
                        <img :src="CREDIT_ASSET_ICON" :alt="CREDIT_NAME" width="32" height="32">
                    </div>
                </div>
            </Button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner'
import { CREDIT_NAME, CREDIT_DECIMALS, CREDIT_ADDRESS, CREDIT_ASSET_ICON } from '~/constants/proposalConstants';
import { erc20Abi, parseUnits, type Address } from 'viem';
import useAmountInputStore from '~/composables/useAmountInputStore';
import { useMutation } from '@tanstack/vue-query';
import { useReadContract, useAccount } from '@wagmi/vue';
import type NotificationSignupModal from '~/components/modals/NotificationSignupModal.vue';
import useUserDeposit from '~/composables/useUserDeposit';
import { formatDecimalPoint } from '~/lib/format-decimals';

const amountInputStore = useAmountInputStore()
const { lendAmount } = storeToRefs(amountInputStore)
const { address } = useAccount()

const { userDeposit, userDepositFormatted } = useUserDeposit()
const notificationModal = ref<InstanceType<typeof NotificationSignupModal> | null>(null)

const amountToWithdraw = computed(() => {
    return Number(userDepositFormatted.value) - Number(lendAmount.value)
})

const amountToDepositAdditionally = computed(() => {
    return Number(lendAmount.value) - Number(userDepositFormatted.value)
})

const amountToDepositAdditionallyFormatted = computed(() => {
    return formatDecimalPoint(amountToDepositAdditionally.value, 2)
})

const isAmountInputLowerThanUserDeposit = computed(() => {
    return amountToDepositAdditionally.value < 0 && lendAmount.value !== '0' && lendAmount.value !== ''
})

const amountToWithdrawFormatted = computed(() => {
    return formatDecimalPoint(amountToWithdraw.value, 2)
})

const lendAmountFormatted = computed(() => {
    return formatDecimalPoint(lendAmount.value, 2)
})

const lendButtonText = computed(() => {
    if (userDeposit.value > 0n && amountToDepositAdditionally.value > 0) {
        return 'DEPOSIT ' + amountToDepositAdditionallyFormatted.value + ' ' + CREDIT_NAME + ' MORE'
    } else if (isAmountInputLowerThanUserDeposit.value) {
        return 'WITHDRAW ' + amountToWithdrawFormatted.value + ' ' + CREDIT_NAME
    } else if (userDeposit.value === 0n && amountToDepositAdditionally.value > 0) {
        return 'DEPOSIT ' + lendAmountFormatted.value + ' ' + CREDIT_NAME
    } else {
        return 'DEPOSIT'
    }
})

const walletBalanceQuery = useReadContract({
    abi: erc20Abi,
    address: CREDIT_ADDRESS,
    functionName: 'balanceOf',
    args: [address as Ref<Address>],
})

const walletBalance = computed(() => walletBalanceQuery.data.value)

const walletBalancePlusUserDeposit = computed(() => {
    return (walletBalance.value ?? 0n) + (userDeposit.value ?? 0n)
})

const canSubmit = computed(() => {
    if (!walletBalance.value) {
        return false
    }

    if (amountToDepositAdditionally.value === 0) {
        return false
    }

    const amountStr = lendAmount.value || '0'
    if (amountStr === '0' || amountStr === '') {
        return false
    }
    
    try {
        const amount = parseUnits(amountStr, CREDIT_DECIMALS)
        return amount > 0n && amount <= walletBalancePlusUserDeposit.value
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
        
        // Show step-based toast
        const toastId = toast.loading(`Step 1/3: Preparing transaction for ${lendAmountCopy} ${CREDIT_NAME}...`)
        
        // TODO refactor this to use real toast from our main app
        try {
            await createLendingProposalPromise
            
            toast.update(toastId, {
                id: toastId,
                type: 'success',
                title: 'Step 2/3: Transaction confirmed',
                description: `Lending proposal for ${lendAmountCopy} ${CREDIT_NAME} created successfully`
            })
            
            // Show notification signup modal after successful deposit
            if (notificationModal.value && Number(lendAmountCopy) > 0) {
                setTimeout(() => {
                    notificationModal.value?.openModal()
                }, 1000)
            }
            
            // Final step toast
            setTimeout(() => {
                toast.success('Step 3/3: Complete! Your deposit is now earning rewards.')
            }, 2000)
            
        } catch (error) {
            toast.update(toastId, {
                id: toastId,
                type: 'error',
                title: 'Transaction failed',
                description: `Failed to create lending proposal for ${lendAmountCopy} ${CREDIT_NAME}`
            })
        }

        // Clear the input after submission
        lendAmount.value = ''
    },
    throwOnError: true,
})
</script>
