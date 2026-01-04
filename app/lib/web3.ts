import { UserRejectedRequestError } from 'viem'

export function extractErrorMessage(error: Error): string | undefined {
    if (!error) {
      return undefined
    }
  
    if (error instanceof UserRejectedRequestError && 'shortMessage' in error) {
      return error.shortMessage
    } else {
      try {
        const errorMessageRegex = /Error:\s(.*?)\n\s+((?:.*?\n\s+\(\d+\))|(?:.*?\(\d+\)))/gs
        const contractCallRegex = /function:\s(.*?)\n\s+args:\s+(.*?)\n/g
  
        const errorMessageMatch = errorMessageRegex.exec(error.message)
        const contractCallMatch = contractCallRegex.exec(error.message)
  
        if (errorMessageMatch && contractCallMatch) {
          const errorMessage = errorMessageMatch[1]
          const additionalInfo = errorMessageMatch[2]
          const contractCall = contractCallMatch[1]
          const args = contractCallMatch[2]
          return `${errorMessage}${additionalInfo}\n\nFunction call: ${contractCall}${args}`
        } else {
          // @ts-expect-error error.shortMessage exists on the viem thrown errors
          return error?.shortMessage || error.cause || String(error)
        }
      } catch {
        // @ts-expect-error error.shortMessage exists on the viem thrown errors
        return error?.shortMessage || error.cause || String(error)
      }
    }
  }