// plugins/2.wagmi.ts
// TODO change back to @wagmi/vue once they start supporting Nuxt 4
import { WagmiPlugin } from "@wagmi/vue";
import { defineNuxtPlugin } from "nuxt/app";
import { wagmiAdapter } from "~/config/appkit";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(WagmiPlugin, { config: wagmiAdapter.wagmiConfig });
});
