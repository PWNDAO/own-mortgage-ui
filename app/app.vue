<template>
  <!-- TODO use client-only top wide or not? -->
  <client-only>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </client-only>
</template>

<script setup lang="ts">
import { createAppKit } from "@reown/appkit/vue";
import { wagmiAdapter, networks, projectId } from "./config/appkit";

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  // TODO what metadata to use?
  metadata: {
    name: "Own Mortgage",
    description: "Pure Defi Mortgage",
    url: "https://own.com",
    // TODO what icon to use?
    icons: ["https://avatars.githubusercontent.com/u/179229932?s=200&v=4"],
  },
});
</script>
