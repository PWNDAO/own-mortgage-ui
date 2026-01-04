<template>
  <client-only>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </client-only>
</template>

<script setup lang="ts">
import { useDomainSeoMeta, useDomainMetadata } from "~/composables/useDomainMetadata";

const APP_URL = 'https://bordel.ownlabs.co'
const APP_ICON = `${APP_URL}/images/own-logo.svg`

// Get domain-specific metadata
const metadata = useDomainMetadata()

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

// Initialize AppKit only on client side (Web3 wallet connections)
onMounted(async () => {
  const { createAppKit } = await import("@reown/appkit/vue")
  const { wagmiAdapter, networks, projectId } = await import("./config/appkit")

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
  })
})
</script>
