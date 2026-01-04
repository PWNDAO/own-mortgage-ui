<template>
  <client-only>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </client-only>
</template>

<script setup lang="ts">
import { useDomainSeoMeta, useDomainMetadata } from "~/composables/useDomainMetadata";
import { createAppKit } from "@reown/appkit/vue"
import { wagmiAdapter, networks, projectId } from "~/config/appkit"

const APP_URL = 'https://bordel.ownlabs.co'
const APP_ICON = `${APP_URL}/images/own-logo.svg`

const metadata = useDomainMetadata()

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata: {
    name: metadata.title,
    description: metadata.description,
    url: APP_URL,
    icons: [APP_ICON],
  },
})


useDomainSeoMeta()

// Basic head config (favicon, etc.)
useHead({
  title: () => metadata.title,
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
