import { getState } from '../state.js'
import { convert, formatMoney } from '../currency.js'

export function displayAmount(amount) {
  const { baseCurrency, displayCurrency, rates } = getState().settings
  const table = { [baseCurrency]: 1, ...rates }
  return formatMoney(convert(amount, baseCurrency, displayCurrency, table), displayCurrency)
}
