export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  
  // Only initialize if clarityId is provided
  if (config.public.clarityId) {
    try {
      // Dynamically load and initialize Clarity
      import('@microsoft/clarity').then((module) => {
        const clarity = module.default || module
        if (clarity && typeof clarity.start === 'function') {
          clarity.start({
            projectId: config.public.clarityId,
            upload: 'https://www.clarity.ms/collect',
            track: true,
            content: true
          })
        }
      }).catch((error) => {
        console.warn('Failed to load Microsoft Clarity:', error)
      })
    } catch (error) {
      console.warn('Failed to initialize Microsoft Clarity:', error)
    }
  }
})
