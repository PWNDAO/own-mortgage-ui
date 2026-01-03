import Decimal from 'decimal.js'
export default defineNuxtPlugin(() => {
  // Configure Decimal.js to use normal notation instead of scientific notation
  // This is now inside the plugin so it runs within the Nuxt context
  Decimal.config({ toExpPos: 9000000000000000 })
  Decimal.config({ toExpNeg: -9000000000000000 })
})
