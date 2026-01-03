import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  //     compatibilityDate: "2024-09-19",
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  ssr: true,
  css: ["~/assets/css/tailwind.css"],
  nitro: {
    preset: 'cloudflare_pages',
    cloudflare: {
      deployConfig: true,
      nodeCompat: true
    },
    alias: {
      // Mock Web3 packages for SSR - they only run client-side
      // '@reown/appkit': 'unenv/runtime/mock/empty',
      // '@reown/appkit/vue': 'unenv/runtime/mock/empty',
      // '@reown/appkit-adapter-wagmi': 'unenv/runtime/mock/empty',
      // '@wagmi/vue': 'unenv/runtime/mock/empty',
      // '@wagmi/core': 'unenv/runtime/mock/empty',
      // 'wagmi': 'unenv/runtime/mock/empty',
      // '@coinbase/wallet-sdk': 'unenv/runtime/mock/empty',
      // '@walletconnect/ethereum-provider': 'unenv/runtime/mock/empty',
      // '@safe-global/safe-apps-sdk': 'unenv/runtime/mock/empty',
      // TODO is this good resolution?
      /// it's relevant to this: https://github.com/MetaMask/metamask-sdk/issues/1376
      '@react-native-async-storage/async-storage': 'unenv/runtime/mock/empty',
      // TODO is it fine to do?
      'pino-pretty': 'unenv/runtime/mock/empty'
    }
  },
  imports: {
    autoImport: true,
  },
  components: {
    // setting pathPrefix to false, as with it the auto imports on cloudflare pages did not
    //  correctly work for some unknown reason
    dirs: [
      { path: "~/components", pathPrefix: false },
      { path: "~/components/ui", pathPrefix: false },
      { path: "~/components/boxes", pathPrefix: false },
      { path: "~/components/modals", pathPrefix: false },
      { path: "~/components/icons", pathPrefix: false }
    ],
  },
  devServer: {
    port: 8000,
  },
  // TODO potentially add also:
  //  pinia persisted state?
  //  @vueuse/nuxt
  //  @nuxtjs/seo
  //  @vue-final-modal/nuxt
  //  @nuxtjs/web-vitals
  //  @nuxtjs/svg-sprite
  //  nuxt-svgo
  modules: ["@nuxt/eslint", "@nuxt/image", "@wagmi/vue/nuxt", "nuxt-typed-router", "shadcn-nuxt", "@pinia/nuxt"],
  vite: {
    resolve: {
      conditions: ["module", "import", "default"], // prioritize ESM
    },
    optimizeDeps: {
      include: ["eventemitter3"], // force prebundle
    },
    plugins: [tailwindcss()],
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./app/components/ui",
  },
  eslint: {
    checker: true,
  },
  runtimeConfig: {
    moralisApiKey: process.env.NUXT_MORALIS_API_KEY,
    public: {
      // TODO is this okay or will our API key gets exposed and someone can use it?
      //  is there a way how to restrict the key usage to only few domains?
      clarityId: process.env.NUXT_PUBLIC_CLARITY_ID,
    }
  },
});