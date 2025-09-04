<template>
    <Dialog>
        <DialogTrigger class="w-full">
            <Button size="lg" class="h-[5rem] w-full flex justify-between items-center">
                <div>
                    <div class="text-2xl font-bold text-left">LEND</div>
                    <div class="flex items-center gap-1 text-sm">
                        <img src="/icons/rep-score.svg" alt="Reputation score" width="12" height="12">
                        <span>earn rewards</span>
                    </div>
                </div>
                <div>
                    <div class="flex justify-end mb-1">
                        <img src="/icons/usdc.svg" alt="USDC" width="16" height="16">
                    </div>
                    <div class="text-gray-400 text-xs">+ upgrade yield from AAVE/Morpho</div>
                </div>
            </Button>
        </DialogTrigger>
        <DialogContent class="min-w-[1000px]">
            <DialogHeader>
                <DialogTitle>Select your credit asset</DialogTitle>
                <DialogDescription>
                    <TablesSelectCreditAssetTable />
                </DialogDescription>
            </DialogHeader>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
</script>
