import 'vue-toastification/dist/index.css'
import type { PluginOptions } from 'vue-toastification'
import Toast, { POSITION, TYPE } from 'vue-toastification'
// import type { App } from 'vue'
// import router from '@/router'

const options: PluginOptions = {
    position: POSITION.BOTTOM_RIGHT,
    timeout: 15000,
    hideProgressBar: true,
    newestOnTop: false,
    icon: false,
    closeOnClick: false,
    toastDefaults: {
      [TYPE.ERROR]: {
        timeout: false,
      },
      [TYPE.WARNING]: {
        timeout: false,
      },
    },
    transition: {
      enter: 'fade-enter-active',
      leave: 'fade-leave-active',
      move: 'fade-move',
    },
  //   onMounted: (_, toastApp) => {
  //     // Register the router. See here https://github.com/Maronato/vue-toastification/issues/162#issuecomment-945208145
  //     toastApp.use(router)
  //   },
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Toast, options)
})
