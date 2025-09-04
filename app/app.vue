<template>
  <!-- TODO use client-only top wide or not? -->
  <client-only>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </client-only>

  <!-- pointer-events-auto class is fix for https://www.shadcn-vue.com/docs/components/sonner.html#sonner-with-dialog -->
  <Toaster 
    class="pointer-events-auto"
    close-button
  />
</template>

<script setup lang="ts">
// TODO is there a better way how to import the Toaster/sonner ?
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css' // vue-sonner v2 requires this import
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
