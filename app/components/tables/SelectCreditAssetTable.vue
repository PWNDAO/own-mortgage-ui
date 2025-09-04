<template>
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead>
                    Token Name
                </TableHead>
                <TableHead>
                    Pool
                </TableHead>
                <!-- TODO should we also display health -->
                <TableHead>
                    APY
                </TableHead>
                <TableHead>
                    You Own
                </TableHead>
                <TableHead class="text-right">
                    Amount to Lend
                </TableHead>
                <TableHead class="text-right">
                    Action
                </TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            <!-- TODO shall we also display pool positions where user does not have any funds? -->
            <TableRow v-for="token in USER_TOKENS" :key="token.id">
                <TableCell class="flex items-center gap-2 h-[53px]">
                    <img :src="CREDIT_ASSET_ICON" :alt="token.name" class="w-4 h-4" />
                    {{ token.name }}
                </TableCell>
                <TableCell>
                    <PoolIcon :pool="token.pool" />
                </TableCell>
                <TableCell>
                    {{ token.apy ? `${token.apy}%` : 'N/A' }}
                </TableCell>
                <TableCell>
                    {{ token.balanceFormatted }}
                </TableCell>
                <TableCell>
                    <Input
                        v-model="lendAmounts[token.id]"
                        placeholder="150.23"
                        :disabled="token.balance <= 0n"
                        class="w-30 ml-auto"
                        :class="{ 'border-red-500': isAmountInvalid(token.id) }"
                    />
                    <div v-if="isAmountInvalid(token.id)" class="text-xs text-red-500 mt-1">
                        Amount exceeds balance
                    </div>
                </TableCell>
                <TableCell class="text-right">
                    <Button
                        size="sm"
                        :disabled="!canSubmit(token.id)"
                        @click="handleSubmit(token.id)"
                    >
                        Submit
                    </Button>
                </TableCell>
            </TableRow>
        </TableBody>
    </Table>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner'
import { CREDIT_ASSET_ICON } from '~/constants/proposalConstants';
import { USER_TOKENS } from '~/mocks/userTokens'
import { ref, onMounted } from 'vue'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { 
    Table, 
    TableHeader, 
    TableBody, 
    TableRow, 
    TableHead, 
    TableCell 
} from '~/components/ui/table'
import PoolIcon from '~/components/PoolIcon.vue'
import { parseUnits } from 'viem'

// Reactive object to store amount inputs for each token
const lendAmounts = ref<Record<string, string>>({})

// Initialize empty amounts for all tokens
onMounted(() => {
    USER_TOKENS.forEach(token => {
        lendAmounts.value[token.id] = ''
    })
})

// Check if amount input is invalid (exceeds balance)
const isAmountInvalid = (tokenId: string) => {
    const amountStr = lendAmounts.value[tokenId] || '0'
    const token = USER_TOKENS.find(t => t.id === tokenId)
    if (!token) return false
    
    try {
        // Parse the input amount using viem parseUnits with the token's decimals
        const amount = parseUnits(amountStr, token.decimals)
        return amount > token.balance
    } catch {
        // If parsing fails (invalid input), consider it invalid
        return true
    }
}

// Check if submit button should be enabled
const canSubmit = (tokenId: string) => {
    const amountStr = lendAmounts.value[tokenId] || '0'
    if (amountStr === '0' || amountStr === '') return false
    
    const token = USER_TOKENS.find(t => t.id === tokenId)
    if (!token) return false
    
    try {
        const amount = parseUnits(amountStr, token.decimals)
        return amount > 0n && amount <= token.balance
    } catch {
        return false
    }
}

const { createLendingProposal } = useLend()

// Handle submit button click
const handleSubmit = (tokenId: string) => {
    const amountStr = lendAmounts.value[tokenId]
    const token = USER_TOKENS.find(t => t.id === tokenId)
    
    if (token && amountStr) {
        try {
            console.log(`Submitting ${amountStr} ${token.name} for lending`)

            // TODO: Implement actual lending logic here
            toast.promise(createLendingProposal(), {
                loading: `Creating lending proposal for ${amountStr} ${token.name}...`,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                success: (data) => {
                    return 'Lending proposal created successfully'
                },
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                error: (error) => {
                    return 'Failed to create lending proposal'
                },
            })
            
            // Clear the input after submission
            lendAmounts.value[tokenId] = ''
        } catch (error) {
            console.error('Invalid amount format:', error)
        }
    }
}
</script>
