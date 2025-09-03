import { ref, computed, onMounted, onUnmounted } from 'vue'

export interface Supporter {
  address: string
  amount: number
  timestamp: number
}

export function useSupporters() {
  const supporters = ref<Supporter[]>([])
  const timer = ref<number | null>(null)
  
  // Generate random Ethereum-like address
  const generateAddress = () => {
    const address = '0x' + Array.from({ length: 40 }, () => 
      Math.floor(Math.random() * 16).toString(16)).join('')
    return address
  }
  
  // Generate named addresses for initial supporters
  const namedAddresses = [
    'kekiusmaximus.eth',
    'trendcatcher.eth',
    'nooneisreadingthis.eth',
    'daccmaxi.eth',
    'pwn.dao.eth',
    'aifreedom.eth',
    'tovemama.eth',
    'ai16z.eth',
    'hyperalchemy.eth',
    'skas-me.eth'
  ]
  
  // Calculate total amount from all supporters
  const totalAmount = computed(() => {
    return supporters.value.reduce((sum, supporter) => sum + supporter.amount, 0)
  })
  
  // Get the supporters list grouped by address, deduplicated, and sorted by total amount (descending)
  const supportersList = computed(() => {
    // Group supporters by address and sum their amounts
    const groupedSupporters = supporters.value.reduce((acc, supporter) => {
      const address = supporter.address;
      if (!acc[address]) {
        acc[address] = {
          address,
          amount: 0,
          timestamp: supporter.timestamp
        };
      }
      acc[address].amount += supporter.amount;
      // Keep the most recent timestamp
      acc[address].timestamp = Math.max(acc[address].timestamp, supporter.timestamp);
      return acc;
    }, {} as Record<string, Supporter>);
    
    // Convert back to array and sort by amount
    return Object.values(groupedSupporters).sort((a, b) => b.amount - a.amount)
  })
  
  // Initialize with localStorage data or defaults
  const initialize = () => {
    try {
      const stored = localStorage.getItem('pwn-supporters')
      if (stored) {
        supporters.value = JSON.parse(stored)
      } else {
        // Add default supporters if none exist
        supporters.value = [
          { address: namedAddresses[0], amount: 100, timestamp: Date.now() - 90000 },
          { address: namedAddresses[1], amount: 405, timestamp: Date.now() - 80000 },
          { address: namedAddresses[2], amount: 2540, timestamp: Date.now() - 70000 },
          { address: namedAddresses[7], amount: 2341, timestamp: Date.now() - 85000 },
          { address: 'pwn-dao.eth', amount: 2399, timestamp: Date.now() - 60000 },
          { address: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d', amount: 243, timestamp: Date.now() - 50000 },
          { address: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD', amount: 2.5, timestamp: Date.now() - 40000 },
          { address: namedAddresses[5], amount: 8.42, timestamp: Date.now() - 30000 },
          { address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', amount: 1.25, timestamp: Date.now() - 20000 },
          { address: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52', amount: 12.33, timestamp: Date.now() - 10000 },
          { address: namedAddresses[3], amount: 4200, timestamp: Date.now() - 85000 },
          { address: namedAddresses[6], amount: 420, timestamp: Date.now() - 65000 },
          { address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', amount: 3000, timestamp: Date.now() - 45000 },
          { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', amount: 2311, timestamp: Date.now() - 35000 },
          { address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', amount: 4123, timestamp: Date.now() - 25000 },
          { address: '0x514910771AF9Ca656af840dff83E8264EcF986CA', amount: 11111, timestamp: Date.now() - 15000 },
          { address: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2', amount: 102, timestamp: Date.now() - 5000 },
        ]
        saveToLocalStorage()
      }
    } catch (error) {
      console.error('Error loading supporters data:', error)
      supporters.value = []
    }
  }
  
  // Save data to localStorage
  const saveToLocalStorage = () => {
    try {
      localStorage.setItem('pwn-supporters', JSON.stringify(supporters.value))
    } catch (error) {
      console.error('Error saving supporters data:', error)
    }
  }
  
  // Add a new random supporter
  const addRandomSupporter = () => {
    // Check if adding more would exceed the maximum amount
    const currentTotal = supporters.value.reduce((sum, supporter) => sum + supporter.amount, 0)
    const maxAmount = 150000
    
    // If we're already at or over the max, don't add more supporters
    if (currentTotal >= maxAmount) {
      if (timer.value) {
        clearTimeout(timer.value)
        timer.value = null
      }
      return
    }
    
    // Generate random amount (mostly $5-$140)
    let amount = Math.random() * 135 + 5
    
    // 30% chance of a spike between $300-$500
    if (Math.random() < 0.3) {
      amount = Math.random() * 200 + 300
    }
    
    // Round to 2 decimal places
    amount = Math.round(amount * 100) / 100
    
    // Cap the amount if it would exceed the maximum
    if (currentTotal + amount > maxAmount) {
      amount = maxAmount - currentTotal
    }
    
    // Sometimes use a named address (10% chance) or generate a random one
    const useNamedAddress = Math.random() < 0.1
    const address = useNamedAddress 
      ? namedAddresses[Math.floor(Math.random() * namedAddresses.length)]
      : generateAddress()
    
    // Add the new supporter
    supporters.value.push({
      address,
      amount,
      timestamp: Date.now()
    })
    
    // Save to localStorage
    saveToLocalStorage()
    
    // Schedule next addition if we haven't reached the max
    if (currentTotal + amount < maxAmount) {
      scheduleNextAddition()
    }
  }
  
  // Schedule next supporter addition (1-5 seconds)
  const scheduleNextAddition = () => {
    const delay = Math.floor(Math.random() * 4000) + 1000
    timer.value = window.setTimeout(addRandomSupporter, delay)
  }
  
  // Start the process on component mount
  onMounted(() => {
    initialize()
    
    // Only start scheduling if we haven't reached the max amount
    const currentTotal = supporters.value.reduce((sum, supporter) => sum + supporter.amount, 0)
    if (currentTotal < 795000) {
      scheduleNextAddition()
    }
  })
  
  // Clean up on unmount
  onUnmounted(() => {
    if (timer.value) {
      clearTimeout(timer.value)
    }
  })
  
  return {
    supporters,
    supportersList,
    totalAmount,
    addRandomSupporter
  }
} 