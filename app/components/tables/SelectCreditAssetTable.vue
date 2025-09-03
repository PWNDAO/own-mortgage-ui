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
            </TableRow>
        </TableHeader>
        <TableBody>
            <!-- TODO shall we also display pool positions where user does not have any funds? -->
            <TableRow v-for="token in USER_TOKENS" :key="token.id">
                <TableCell class="flex items-center gap-2">
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
            </TableRow>
        </TableBody>
    </Table>
</template>

<script setup lang="ts">
import { CREDIT_ASSET_ICON } from '~/constants/proposalConstants';
import { USER_TOKENS } from '~/mocks/userTokens'
</script>
