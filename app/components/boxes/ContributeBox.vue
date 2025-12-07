<template>
    <div class="bg-card border rounded-xl p-4 sm:p-6 order-3 lg:order-none shadow-lg">
        <div class="mb-3">
            <h3 class="font-heading text-xl sm:text-2xl mb-1">Fund This Loan</h3>
            <p class="text-green-400 text-sm sm:text-base font-semibold">Earn minimum of {{ MINIMAL_APR }}% APR + Exclusive Rewards</p>
        </div>
        <hr class="mb-4"/>
        <div class="mb-3">
            <AmountInput :prefilled-amount="userDepositFormatted" input-height="h-[5rem] sm:h-[5rem]" />
            <div v-if="isAmountInputLowerThanUserDeposit" class="mt-2 text-sm text-gray-2">
                Setting amount to {{ lendAmount }} {{ CREDIT_NAME }} will withdraw {{ amountToWithdrawFormatted }} {{ CREDIT_NAME }} from your deposit.
            </div>
            
            <Button 
                size="lg" 
                class="h-auto min-h-[5rem] sm:h-[5rem] w-full flex justify-between items-center mt-3 px-2 sm:px-4 shadow-xl hover:shadow-2xl transition-all duration-300" 
                :disabled="!canSubmit" 
                @click="handleDepositClick"
            >
                <div class="flex-1 min-w-0">
                    <div class="text-base sm:text-lg md:text-2xl font-bold text-left break-words">{{ lendButtonText }}</div>
                    <div class="flex items-center gap-1 text-xs sm:text-sm mt-1">
                        <span v-if="amountToDepositAdditionally > 0n">+ earn minimum {{ MINIMAL_APR }}% or more</span>
                    </div>
                </div>
                <div class="flex-shrink-0 ml-2">
                    <div class="flex justify-end mb-1">
                        <img :src="CREDIT_ASSET_ICON" :alt="CREDIT_NAME" width="32" height="32" class="w-6 h-6 sm:w-8 sm:h-8">
                    </div>
                </div>
            </Button>
            
            <!-- Trust Signals -->
            <div class="mt-3 flex flex-wrap items-center justify-center gap-3 text-xs text-gray-400">
                <div class="flex items-center gap-1">
                    <span class="text-green-400">✓</span>
                    <span>Non-Custodial</span>
                </div>
                <div class="flex items-center gap-1">
                    <span class="text-green-400">✓</span>
                    <span>Withdraw Anytime Before Execution</span>
                </div>
                <div class="flex items-center gap-1">
                    <span class="text-green-400">✓</span>
                    <span>Meanwhile Earn Yield From AAVE</span>
                </div>
            </div>
        </div>
        <NotificationSignupModal ref="notificationModal" :display-open-button="false" />
    </div>
</template>

<script setup lang="ts">
import { CREDIT_NAME, CREDIT_DECIMALS, CREDIT_ADDRESS, CREDIT_ASSET_ICON, PROPOSAL_CHAIN_ID, MINIMAL_APR } from '~/constants/proposalConstants';
import { erc20Abi, parseUnits, type Address } from 'viem';
import useAmountInputStore from '~/composables/useAmountInputStore';
import { useMutation } from '@tanstack/vue-query';
import { useReadContract, useAccount } from '@wagmi/vue';
import { ToastStep, Toast, TOAST_ACTION_ID_TO_UNIQUE_ID_FN, ToastActionEnum } from '~/components/ui/toast/useToastsStore';
import useActionFlow from '~/components/ui/toast/useActionFlow';
import NotificationSignupModal from '~/components/modals/NotificationSignupModal.vue';
import MutationIds from '~/constants/mutationIds';
import { useAppKit } from "@reown/appkit/vue";
import useProposal from '~/composables/useProposal';
import useUserDepositStore from '~/composables/useUserDepositStore';

const amountInputStore = useAmountInputStore()

const userDepositStore = useUserDepositStore()
const { userDeposit, userDepositFormatted } = storeToRefs(userDepositStore)
const { 
    lendAmount, 
    lendAmountFormatted, 
    amountToWithdrawFormatted,
    amountToDepositAdditionally, 
    amountToDepositAdditionallyFormatted, 
    isAmountInputLowerThanUserDeposit 
} = storeToRefs(amountInputStore)
const { address, isConnected } = useAccount()

const { refetchTotalDepositedAssets } = useProposal()

const { open } = useAppKit();

const notificationModal = ref<InstanceType<typeof NotificationSignupModal> | null>(null)

const lendButtonText = computed(() => {
    if (userDeposit.value > 0n && amountToDepositAdditionally.value > 0n) {
        return 'Deposit ' + amountToDepositAdditionallyFormatted.value + ' ' + CREDIT_NAME + ' More'
    } else if (isAmountInputLowerThanUserDeposit.value) {
        return 'Withdraw ' + amountToWithdrawFormatted.value + ' ' + CREDIT_NAME
    } else if (userDeposit.value === 0n && amountToDepositAdditionally.value > 0n) {
        return 'Deposit & Earn'
    } else {
        return 'Deposit & Earn'
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
    if (isApproving.value || isDepositing.value || isWithdrawing.value || lendAmount.value === '') {
        return false
    }

    if (!isConnected.value) {
        return true
    }

    if (!walletBalance.value) {
        return false
    }

    if (amountToDepositAdditionally.value === 0n) {
        return false
    }

    if (userDeposit.value) {
        return true
    }

    const amountStr = lendAmount.value || '0'
    if (amountStr === '0' || amountStr === '') {
        return false
    }
    
    try {
        const amount = parseUnits(amountStr, CREDIT_DECIMALS)
        return amount > 0n && amount <= walletBalancePlusUserDeposit.value
    } catch {
        console.error('error parsing amount', amountStr)
        return false
    }
})

const toast = ref<Toast>()
let continueFlow: () => Promise<void> | undefined

const { approveForDepositIfNeeded, deposit, withdraw } = useLend()

const { isPending: isApproving, mutateAsync: approveForDepositIfNeededMutateAsync } = useMutation({
    mutationKey: [MutationIds.ApproveForDepositIfNeeded],
    mutationFn: async ({ step }: { step: ToastStep }) => {
        await approveForDepositIfNeeded(step)
    },
    throwOnError: true,
})

const { isPending: isWithdrawing, mutateAsync: withdrawMutateAsync } = useMutation({
    mutationKey: [MutationIds.Withdraw],
    mutationFn: async ({ step }: { step: ToastStep }) => {
        await withdraw(parseUnits(amountToWithdrawFormatted.value, CREDIT_DECIMALS), step)
    },
    onSuccess() {
        refetchTotalDepositedAssets()
    },
    throwOnError: true,
})

const { isPending: isDepositing, mutateAsync: depositMutateAsync } = useMutation({
    mutationKey: [MutationIds.Deposit],
    mutationFn: async ({ step }: { step: ToastStep }) => {
        await deposit(step)
    },
    onSuccess() {
        refetchTotalDepositedAssets()

        notificationModal.value?.openModal()
    },
    throwOnError: true,
})

const handleDepositClick = async () => {
    if (!isConnected.value) {
        open({ view: 'Connect' })
        return
    }

  const actionId = TOAST_ACTION_ID_TO_UNIQUE_ID_FN[ToastActionEnum.DEPOSIT](lendAmount.value, address.value!)

  if (toast.value?.id !== actionId) {
    const steps: ToastStep[] = []
    if (!isAmountInputLowerThanUserDeposit.value) {
        steps.push(new ToastStep({
            text: `Approving ${lendAmount.value} ${CREDIT_NAME}...`,
            async fn(step) {
                await approveForDepositIfNeededMutateAsync({ step })
                return true
            }
        }))
    }

    if (isAmountInputLowerThanUserDeposit.value) {
        steps.push(new ToastStep({
            text: `Withdrawing ${amountToWithdrawFormatted.value} ${CREDIT_NAME}...`,
            async fn(step) {
                await withdrawMutateAsync({ step })
                return true
            }
        }))
    } else {
        let stepText
        if (userDeposit.value > 0n) {
            stepText = `Depositing ${amountToDepositAdditionallyFormatted.value} ${CREDIT_NAME} more (on top of your ${userDepositFormatted.value} ${CREDIT_NAME})...`
        } else {
            stepText = `Depositing ${lendAmount.value} ${CREDIT_NAME}...`
        }
        
        steps.push(new ToastStep({
            text: stepText,
            async fn(step) {
                await depositMutateAsync({ step })
                return true
            },
        }))
    }

    toast.value = new Toast({
      steps,
      chainId: PROPOSAL_CHAIN_ID,
      title: isAmountInputLowerThanUserDeposit.value ? 'Withdrawing' : 'Depositing',
    }, ToastActionEnum.DEPOSIT, lendAmount.value, address.value!);
    ({ continueFlow } = useActionFlow(toast as Ref<Toast>))
  }

  await continueFlow()
}
</script>
