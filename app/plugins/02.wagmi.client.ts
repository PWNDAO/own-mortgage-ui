// plugins/02.wagmi.client.ts
// Client-only plugin (.client.ts suffix ensures this only runs on client, not during SSR)
import { WagmiPlugin } from "@wagmi/vue";
import { defineNuxtPlugin } from "nuxt/app";
import { getWagmiAdapter } from "~/config/appkit";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(WagmiPlugin, { config: getWagmiAdapter().wagmiConfig });
});
