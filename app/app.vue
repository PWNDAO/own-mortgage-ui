<template>
  <client-only>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </client-only>
</template>

<script setup lang="ts">
import { createAppKit } from "@reown/appkit/vue";
import { wagmiAdapter, networks, projectId } from "./config/appkit";
import { useDomainSeoMeta, useDomainMetadata } from "~/composables/useDomainMetadata";

const APP_URL = 'https://bordel.ownlabs.co'
const APP_ICON = `${APP_URL}/images/own-logo.svg`

// Get domain-specific metadata for AppKit
const metadata = useDomainMetadata()

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata: {
    name: metadata.value.title,
    description: metadata.value.description,
    url: APP_URL,
    icons: [APP_ICON],
  },
});

// Apply domain-based SEO meta tags (runs on server for SSR)
useDomainSeoMeta()

// Basic head config (favicon, etc.)
useHead({
  title: () => metadata.value.title,
  link: [
    {
      rel: 'icon',
      href: '/favicon.ico',
      type: 'image/x-icon',
    },
    {
      rel: 'apple-touch-icon',
      href: '/favicon.ico',
    },
  ],
})
</script>
