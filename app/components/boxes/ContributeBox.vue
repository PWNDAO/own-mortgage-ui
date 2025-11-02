<template>
    <div class="border p-3 sm:p-4 order-1 lg:order-none">
        <div class="flex justify-between items-center mb-4 gap-2">
            <h3 class="font-heading text-lg sm:text-xl">Contribute to the crowdloan</h3>
            <ShareModal />
        </div>
        <hr class="mb-4"/>
        <div class="mb-3">
            <AmountInput :prefilled-amount="userDepositFormatted" />
            <div v-if="isAmountInputLowerThanUserDeposit" class="mt-2 text-sm text-gray-2">
                Setting amount to {{ lendAmount }} {{ CREDIT_NAME }} will withdraw {{ amountToWithdraw }} {{ CREDIT_NAME }} from your deposit.
            </div>

            <div class="flex flex-col sm:flex-row gap-2 mt-3">
                <div class="p-3 border grow">
                    <div class="flex justify-between items-center">
                        <span class="text-gray-300 text-sm sm:text-base">APR:</span>
                        <span class="text-base sm:text-lg font-semibold text-green-400">{{ MINIMAL_APR }}%</span>
                    </div>
                    <div class="text-xs text-gray-400 mt-1">
                        You also earn interest while waiting for loan acceptance
                    </div>
                </div>

                <div class="p-3 border flex gap-2 sm:gap-5 items-center">
                    <span class="text-gray-300 text-sm sm:text-base">Chain:</span>
                    <div>
                        <ChainInfo />
                    </div>
                </div>
            </div>
            
            <Button 
                size="lg" 
                class="h-auto min-h-[5rem] sm:h-[5rem] w-full flex justify-between items-center mt-3 px-2 sm:px-4" 
                :disabled="!canSubmit" 
                @click="handleDepositClick"
            >
                <div class="flex-1 min-w-0">
                    <div class="text-base sm:text-lg md:text-2xl font-bold text-left break-words">{{ lendButtonText }}</div>
                    <div class="flex items-center gap-1 text-xs sm:text-sm mt-1">
                        <span v-if="amountToDepositAdditionally > 0">+ earn {{ MINIMAL_APR }}% or more</span>
                    </div>
                </div>
                <div class="flex-shrink-0 ml-2">
                    <div class="flex justify-end mb-1">
                        <img :src="CREDIT_ASSET_ICON" :alt="CREDIT_NAME" width="32" height="32" class="w-6 h-6 sm:w-8 sm:h-8">
                    </div>
                </div>
            </Button>
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
import useUserDeposit from '~/composables/useUserDeposit';
import { formatDecimalPoint } from '~/lib/format-decimals';
import { ToastStep, Toast, TOAST_ACTION_ID_TO_UNIQUE_ID_FN, ToastActionEnum } from '~/components/ui/toast/useToastsStore';
import useActionFlow from '~/components/ui/toast/useActionFlow';
import NotificationSignupModal from '~/components/modals/NotificationSignupModal.vue';
import Decimal from 'decimal.js';
import MutationIds from '~/constants/mutationIds';
import { useAppKit } from "@reown/appkit/vue";
import useProposal from '~/composables/useProposal';

const amountInputStore = useAmountInputStore()
const { lendAmount } = storeToRefs(amountInputStore)
const { address, isConnected } = useAccount()

const { refetchTotalSupply } = useProposal()

const { open } = useAppKit();

const { userDeposit, userDepositFormatted } = useUserDeposit()
const notificationModal = ref<InstanceType<typeof NotificationSignupModal> | null>(null)

const amountToWithdraw = computed(() => {
    return Decimal(userDepositFormatted.value).sub(Decimal(lendAmount.value || '0'))
})

const amountToDepositAdditionally = computed(() => {
    return Number(lendAmount.value) - Number(userDepositFormatted.value)
})

const amountToDepositAdditionallyFormatted = computed(() => {
    return formatDecimalPoint(amountToDepositAdditionally.value, 2)
})

const isAmountInputLowerThanUserDeposit = computed(() => {
    return amountToDepositAdditionally.value < 0
})

const lendAmountFormatted = computed(() => {
    return formatDecimalPoint(lendAmount.value, 2)
})

const lendButtonText = computed(() => {
    if (userDeposit.value > 0n && amountToDepositAdditionally.value > 0) {
        return 'DEPOSIT ' + amountToDepositAdditionallyFormatted.value + ' ' + CREDIT_NAME + ' MORE'
    } else if (isAmountInputLowerThanUserDeposit.value) {
        return 'WITHDRAW ' + amountToWithdraw.value + ' ' + CREDIT_NAME
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
    if (isApproving.value || isDepositing.value || isWithdrawing.value || lendAmount.value === '') {
        return false
    }

    if (!isConnected.value) {
        return true
    }

    if (!walletBalance.value) {
        return false
    }

    if (amountToDepositAdditionally.value === 0) {
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
        await withdraw(parseUnits(amountToWithdraw.value.toString(), CREDIT_DECIMALS), step)
    },
    onSuccess(data, variables, context) {
        console.log('withdraw success', data, variables, context)
        refetchTotalSupply()
    },
    throwOnError: true,
})

const { isPending: isDepositing, mutateAsync: depositMutateAsync } = useMutation({
    mutationKey: [MutationIds.Deposit],
    mutationFn: async ({ step }: { step: ToastStep }) => {
        await deposit(step)
    },
    onSuccess(data, variables, context) {
        console.log('deposit success', data, variables, context)
        refetchTotalSupply()

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
                console.log('approving', step)
                await approveForDepositIfNeededMutateAsync({ step })
                return true
            }
        }))
    }

    if (isAmountInputLowerThanUserDeposit.value) {
        steps.push(new ToastStep({
            text: `Withdrawing ${amountToWithdraw.value} ${CREDIT_NAME}...`,
            async fn(step) {
                console.log('withdrawing', step)
                await withdrawMutateAsync({ step })
                return true
            }
        }))
    } else {
        steps.push(new ToastStep({
            text: `Depositing ${lendAmount.value} ${CREDIT_NAME}...`,
            async fn(step) {
                console.log('depositing', step)
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
