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

const APP_TITLE = 'Bordel Hackerspace Mortgage | OWN Labs'
const APP_DESCRIPTION = 'Bordel Hackerspace | First Pure DeFi Mortgage - A decentralized, crowdfunded DeFi mortgage with purpose of buying a new space for Bordel Hackerspace.'
const APP_URL = 'https://bordel.ownlabs.co'
const APP_ICON = `${APP_URL}/images/own-logo.svg`

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata: {
    name: APP_TITLE,
    description: APP_DESCRIPTION,
    url: APP_URL,
    icons: [APP_ICON],
  },
});

useHead({
  title: APP_TITLE,
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

useSeoMeta({
  title: APP_TITLE,
  description: APP_DESCRIPTION,
  ogTitle: APP_TITLE,
  ogDescription: APP_DESCRIPTION,
  ogImage: `${APP_URL}/images/bordel-hackerspace.jpeg`,
  ogUrl: APP_URL,
  ogType: 'website',
  ogSiteName: APP_TITLE,
  twitterCard: 'summary_large_image',
  twitterTitle: APP_TITLE,
  twitterDescription: APP_DESCRIPTION,
  twitterImage: `${APP_URL}/images/bordel-hackerspace.jpeg`,
  themeColor: '#000000',
  robots: 'index, follow',
  author: 'OWN Labs',
  keywords: 'DeFi, mortgage, blockchain, Ethereum, Bordel Hackerspace, crowdfunding, decentralized finance, crypto loan, weETH, USDC',
})
</script>
