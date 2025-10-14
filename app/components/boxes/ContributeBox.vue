<template>
    <div class="border p-4">
        <div class="flex justify-between">
            <h3 class="font-heading text-xl mb-4">Contribute to the crowdloan</h3>
        </div>
        <hr class="mb-4"/>
        <div class="mb-3">
            <!-- TODO why does the is-input-disabled is not properly enabled again when i cancel the tx? -->
            <AmountInput 
                :is-input-disabled="isApproving || isDepositing || isWithdrawing" 
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
                @click="handleDepositClick"
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
        <NotificationSignupModal ref="notificationModal" :display-open-button="false" />
    </div>
</template>

<script setup lang="ts">
import { CREDIT_NAME, CREDIT_DECIMALS, CREDIT_ADDRESS, CREDIT_ASSET_ICON, PROPOSAL_CHAIN_ID } from '~/constants/proposalConstants';
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

const amountInputStore = useAmountInputStore()
const { lendAmount } = storeToRefs(amountInputStore)
const { address } = useAccount()

const { userDeposit, userDepositFormatted } = useUserDeposit()
const notificationModal = ref<InstanceType<typeof NotificationSignupModal> | null>(null)

const amountToWithdraw = computed(() => {
    return Decimal(userDepositFormatted.value).sub(Decimal(lendAmount.value))
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

// TODO remove this + other console logs
setInterval(() => {
    console.log('isApproving.value', isApproving.value)
    console.log('isDepositing.value', isDepositing.value)
    console.log('isWithdrawing.value', isWithdrawing.value)
    console.log('walletBalance.value', walletBalance.value)
    console.log('amountToDepositAdditionally.value', amountToDepositAdditionally.value)
    console.log('lendAmount.value', lendAmount.value)
    console.log('walletBalancePlusUserDeposit.value', walletBalancePlusUserDeposit.value)
}, 5000)

const canSubmit = computed(() => {
    if (isApproving.value || isDepositing.value || isWithdrawing.value) {
        return false
    }

    console.log('asdasddasd')

    if (!walletBalance.value) {
        return false
    }

    console.log('blabla')

    if (amountToDepositAdditionally.value === 0) {
        return false
    }

    console.log('blabla2')

    const amountStr = lendAmount.value || '0'
    if (amountStr === '0' || amountStr === '') {
        return false
    }
    
    try {
        const amount = parseUnits(amountStr, CREDIT_DECIMALS)
        console.log('amount', amount)
        console.log('walletBalancePlusUserDeposit.value', walletBalancePlusUserDeposit.value)
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
    mutationKey: ['approveForDepositIfNeeded'],
    mutationFn: async ({ step }: { step: ToastStep }) => {
        await approveForDepositIfNeeded(step)
    },
    throwOnError: true,
})

const { isPending: isWithdrawing, mutateAsync: withdrawMutateAsync } = useMutation({
    mutationKey: ['withdraw'],
    mutationFn: async ({ step }: { step: ToastStep }) => {
        await withdraw(parseUnits(amountToWithdraw.value.toString(), CREDIT_DECIMALS), step)
    },
    throwOnError: true,
})

const { isPending: isDepositing, mutateAsync: depositMutateAsync } = useMutation({
    mutationKey: ['deposit'],
    mutationFn: async ({ step }: { step: ToastStep }) => {
        await deposit(step)
    },
    onSuccess(data, variables, context) {
        console.log('deposit success', data, variables, context)
        lendAmount.value = ''

        notificationModal.value?.openModal()
    },
    throwOnError: true,
})

const handleDepositClick = async () => {
  const actionId = TOAST_ACTION_ID_TO_UNIQUE_ID_FN[ToastActionEnum.DEPOSIT](lendAmount.value, address.value!)

  console.log('actionId', actionId)
  console.log('toast.value?.id', toast.value?.id)
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
