import { defineNuxtPlugin } from "#imports";
import { QueryClient, VueQueryPlugin } from "@tanstack/vue-query";

export default defineNuxtPlugin((nuxt) => {
  const queryClient = new QueryClient({
    defaultOptions: { 
      queries: { 
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      } 
    },
  });

  nuxt.vueApp.use(VueQueryPlugin, {
    queryClient,
    enableDevtoolsV6Plugin: true,
  });
});
