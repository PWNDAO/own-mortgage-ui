/**
 * Parse the decimal repeated value
 * @param value — The value to parse 0.000000000005
 * @returns The parsed value
 */
export const parseRepeatedDecimal = (value: string, maxDecimals: number | undefined = undefined): {
    repeatedZeroes: number
    restDecimals: string
  } | null => {
    const [, decimalPart] = value.split('.')

    if (!decimalPart) {
        return null
    }
  
    const decimalPartLength = decimalPart.length
    const firstNonZeroIndex = decimalPart.split('').findIndex(v => Number(v) > 0)
  
    if (decimalPartLength < 4 || firstNonZeroIndex === -1 || firstNonZeroIndex <= 3) {
      return null
    }
  
    const maxDecimalsToShow = maxDecimals !== undefined ? Math.min(decimalPartLength, maxDecimals) : decimalPartLength
  
    return {
      repeatedZeroes: firstNonZeroIndex - 1,
      restDecimals: decimalPart.slice(firstNonZeroIndex, maxDecimalsToShow),
    }
  }

export const isScientificNotation = (num: number | string): boolean => {
    return num.toString().includes('e')
}
  
// examples of formatting: 1.1234567890 to 1.1234 or 0.00000000006448 to 0.00000000006
export const formatDecimalPoint = (amount: number | string, numbersBehindDecimalPoint = 4, showZeroes = true): string => {
    let stringAmount = ''
    if (typeof amount === 'number' && isScientificNotation(amount)) {
      stringAmount = amount.toFixed(20)
    } else {
      stringAmount = typeof amount === 'number' ? amount.toString() : amount.replace(/,/g, '')
    }
  
    const [integerPart = '', decimalPart = ''] = stringAmount.split('.')
  
    // Find the first non-zero digit in the decimal part
    const firstNonZeroIndex = decimalPart.split('').findIndex(char => char !== '0')
  
    // Determine the number of decimal places to keep
    const decimalPlacesToKeep = numbersBehindDecimalPoint === 0 ? 0 : Math.max(numbersBehindDecimalPoint, firstNonZeroIndex + 1)
  
    const repeatedZeroes = parseRepeatedDecimal(`${integerPart}.${decimalPart || 0}`)
    // Pad or truncate the decimal part
    let formattedDecimal = decimalPart.padEnd(decimalPlacesToKeep, '0')
  
    if (!repeatedZeroes?.repeatedZeroes) {
      formattedDecimal = decimalPart.slice(0, decimalPlacesToKeep)
    } else if (repeatedZeroes?.repeatedZeroes && repeatedZeroes.repeatedZeroes > 0) {
      formattedDecimal = decimalPart.slice(0, repeatedZeroes.repeatedZeroes + numbersBehindDecimalPoint)
    }
  
    // Remove trailing zeros
    let cleanedDecimal = formattedDecimal.replace(/0+$/, '')
  
    if (cleanedDecimal.length > numbersBehindDecimalPoint && firstNonZeroIndex !== -1 && firstNonZeroIndex < numbersBehindDecimalPoint) {
      cleanedDecimal = cleanedDecimal.slice(0, numbersBehindDecimalPoint)
    }
  
    const formattedIntegerPart = parseFloat(integerPart).toLocaleString('en-US')
  
    // Combine integer and decimal parts
    let result = formattedIntegerPart
  
    if (cleanedDecimal || showZeroes) {
      result += '.' + (showZeroes ? cleanedDecimal.padEnd(2, '0') : cleanedDecimal)
    }
  
    // Add .00 if there is no decimal point and showZeroes is true
    if (!result.includes('.') && showZeroes) {
      result += '.00'
    }
  
    return result
  }
