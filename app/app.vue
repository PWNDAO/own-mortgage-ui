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

// TODO basic SEO settings?

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  // TODO what metadata to use?
  metadata: {
    name: "Bordel Mortgage | OWN",
    description: "Bordel Hackerspace | First Pure DeFi Mortgage",
    // TODO adjust after we settle on the final domain
    url: "https://bordel.ownlabs.co",
    // TODO what icon to use?
    icons: ["https://avatars.githubusercontent.com/u/179229932?s=200&v=4"],
  },
});
</script>
