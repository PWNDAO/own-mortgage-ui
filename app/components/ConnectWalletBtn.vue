<template>
  <Button class="text-xs flex items-center gap-2" variant="outline" @click="handleConnectClick">
    <WalletIcon color="var(--color-foreground)" class="mt-[1px]"/>
    <span>{{ buttonText }}</span>
  </Button>
</template>

<script setup lang="ts">
import { useAppKit } from "@reown/appkit/vue";
import { useAccount } from "@wagmi/vue";

const { open } = useAppKit();

const { isConnected, address } = useAccount()

const buttonText = computed(() => isConnected.value ? `${address.value.slice(0, 6)}...${address.value.slice(-4)}` : 'Connect')

function handleConnectClick() {
  open();
}
</script>
