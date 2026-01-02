import tailwindcss from "@tailwindcss/vite";
import Decimal from "decimal.js"

// Configure Decimal.js to use normal notation instead of scientific notation
Decimal.config({ toExpPos: 9000000000000000 })
Decimal.config({ toExpNeg: -9000000000000000 })

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  ssr: true,
  css: ["~/assets/css/tailwind.css"],
  nitro: {
    preset: 'cloudflare-pages',
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
    public: {
      // TODO is this okay or will our API key gets exposed and someone can use it?
      //  is there a way how to restrict the key usage to only few domains?
      moralisApiKey: process.env.NUXT_PUBLIC_MORALIS_API_KEY,
      clarityId: process.env.NUXT_PUBLIC_CLARITY_ID,
    }
  },
});