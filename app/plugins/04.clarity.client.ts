export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  
  // Only initialize if clarityId is provided
  if (config.public.clarityId && typeof window !== 'undefined') {
    try {
      // Inject Clarity script directly (avoiding npm package compatibility issues)
      // eslint-disable-next-line prefer-rest-params, @typescript-eslint/no-explicit-any
      (function(c: any, l: any, a: any, r: any, i: any, t: any, y: any) {
        c[a] = c[a] || function(...args: any[]) {
          (c[a].q = c[a].q || []).push(args)
        }
        t = l.createElement(r)
        t.async = 1
        t.src = "https://www.clarity.ms/tag/" + i
        y = l.getElementsByTagName(r)[0]
        y.parentNode.insertBefore(t, y)
      })(window, document, "clarity", "script", config.public.clarityId)
    } catch (error) {
      console.warn('Failed to initialize Microsoft Clarity:', error)
    }
  }
})
