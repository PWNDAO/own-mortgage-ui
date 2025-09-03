<template>
  <Button variant="outline" @click="handleConnectClick">Connect</Button>
</template>

<script setup lang="ts">
import { useAppKit } from "@reown/appkit/vue";

const { open } = useAppKit();

function handleConnectClick() {
  open();
}
</script>
