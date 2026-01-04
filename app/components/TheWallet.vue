<template>
  <div>
    <ConnectWalletBtn v-if="!isConnected" />
    <div v-else>
      {{ address }}
    </div>
  </div>
</template>

<script setup lang="ts">
const { isConnected, address } = useAccount();
</script>
