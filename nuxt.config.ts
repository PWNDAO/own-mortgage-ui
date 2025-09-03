import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  ssr: false,
  css: ["~/assets/css/tailwind.css"],
  imports: {
    autoImport: true,
  },
  components: {
    dirs: ["~/components", "~/components/ui", "~/components/boxes", "~/components/modals", "~/components/tables"],
  },
  devServer: {
    port: 8000,
  },
  // TODO potentially add also:
  //  @pinia/nuxt + pinia persisted state?
  //  @vueuse/nuxt
  //  @nuxtjs/seo
  //  @vue-final-modal/nuxt
  //  @nuxtjs/web-vitals
  //  @nuxtjs/svg-sprite
  //  nuxt-svgo
  modules: [
    "@nuxt/eslint",
    "@nuxt/image",
    "@wagmi/vue/nuxt",
    "nuxt-typed-router",
    "shadcn-nuxt",
  ],
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
});