import { test, equal } from './harness.js'
import { convert, formatMoney } from '../scripts/currency.js'

const rates = { RWF: 1, USD: 0.001, EUR: 0.0009 }

test('convert from base to another currency and back', () => {
  equal(convert(1000, 'RWF', 'USD', rates), 1)
  equal(convert(1, 'USD', 'RWF', rates), 1000)
})

test('convert between two non-base currencies', () => {
  equal(Math.round(convert(1, 'USD', 'EUR', rates) * 1000) / 1000, 0.9)
})

test('convert to the same currency changes nothing', () => {
  equal(convert(25.5, 'EUR', 'EUR', rates), 25.5)
})

test('formatMoney shows the code and two decimals', () => {
  equal(formatMoney(12.5, 'USD'), 'USD 12.50')
  equal(formatMoney(0, 'RWF'), 'RWF 0.00')
})
