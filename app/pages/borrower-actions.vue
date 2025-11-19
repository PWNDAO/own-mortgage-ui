<template>
    <div class="flex gap-4 mt-5">
        <!-- TODO only display if not running yet -->
        <div class="border p-4 flex flex-col gap-4">
            <h2 class="text-xl font-bold">Accept Proposal</h2>
            <label>
                Credit Amount You Want to Borrow: 
                <Input v-model="creditAmount" />
            </label>
            <div v-if="collateralAmount">
                That corresponds to roughly: {{ collateralAmount }} {{ COLLATERAL_NAME }}
            </div>
            <Button :disabled="isApproving || isAccepting" @click="handleAcceptProposalClick">Accept</Button>
        </div>
        <!-- TODO make full box disabled if not running yet -->
        <div class="border p-4 flex flex-col gap-4">
            <h2 class="text-xl font-bold">Repay</h2>
            <label>
                Repayment Amount:
                <Input v-model="repaymentAmount" />
            </label>
            <Button>Repay</Button>
        </div>
    </div>
</template>

<script setup lang="ts">
import useBorrow from '~/composables/useBorrow'
import MutationIds from '~/constants/mutationIds'
import { COLLATERAL_DECIMALS, COLLATERAL_NAME, CREDIT_DECIMALS, PROPOSAL_CHAIN_ID, CREDIT_NAME } from '~/constants/proposalConstants'
import { computedAsync } from '@vueuse/core'
import { formatUnits, parseUnits } from 'viem'
import { useMutation } from '@tanstack/vue-query'
import { useAccount } from '@wagmi/vue'
import { useAppKit } from "@reown/appkit/vue";
import { Toast, ToastStep, TOAST_ACTION_ID_TO_UNIQUE_ID_FN, ToastActionEnum } from '~/components/ui/toast/useToastsStore';
import useActionFlow from '~/components/ui/toast/useActionFlow';

const { isConnected, address: userAddress } = useAccount()
const { approveForAcceptIfNeeded, acceptProposal, getCollateralAmountFromCreditAmount } = useBorrow()
const { open } = useAppKit();

const toast = ref<Toast>()
let continueFlow: () => Promise<void> | undefined

const creditAmount = ref<number | string>(0)
const creditAmountBigInt = computed(() => {
    if (!creditAmount.value || creditAmount.value === 0 || creditAmount.value === '0') {
        return 0n
    }
    return parseUnits(String(creditAmount.value), CREDIT_DECIMALS)
})
const repaymentAmount = ref(0)

const collateralAmount = computedAsync(async () => {
    const amount = await getCollateralAmountFromCreditAmount(creditAmountBigInt.value)
    return formatUnits(amount, COLLATERAL_DECIMALS)
})

const { isPending: isApproving, mutateAsync: approveForAcceptIfNeededMutateAsync } = useMutation({
    mutationKey: [MutationIds.ApproveForAcceptIfNeeded],
    mutationFn: async ({ step }: { step: ToastStep }) => {
        await approveForAcceptIfNeeded(step, creditAmountBigInt.value)
    },
    throwOnError: true,
})

const { isPending: isAccepting, mutateAsync: acceptProposalMutateAsync } = useMutation({
    mutationKey: [MutationIds.AcceptProposal],
    mutationFn: async ({ step }: { step: ToastStep }) => {
        await acceptProposal(step, creditAmountBigInt.value)
    },
    throwOnError: true,
})

const handleAcceptProposalClick = async () => {
    if (!isConnected.value) {
        open({ view: 'Connect' })
        return
    }

  const actionId = TOAST_ACTION_ID_TO_UNIQUE_ID_FN[ToastActionEnum.ACCEPT_PROPOSAL](String(creditAmount.value), userAddress.value!)

  if (toast.value?.id !== actionId) {
    const steps: ToastStep[] = []
    steps.push(new ToastStep({
        text: `Approving ${collateralAmount.value} ${COLLATERAL_NAME}...`,
        async fn(step) {
            await approveForAcceptIfNeededMutateAsync({ step })
            return true
        }
    }))

    steps.push(new ToastStep({
        text: `Accepting proposal with credit amount ${creditAmount.value} ${CREDIT_NAME}...`,
        async fn(step) {
            await acceptProposalMutateAsync({ step })
            return true
        },
    }))

    toast.value = new Toast({
      steps,
      chainId: PROPOSAL_CHAIN_ID,
      title: 'Accepting proposal',
    }, ToastActionEnum.ACCEPT_PROPOSAL, String(creditAmount.value), userAddress.value!);
    ({ continueFlow } = useActionFlow(toast as Ref<Toast>))
  }

  await continueFlow()
}
</script>