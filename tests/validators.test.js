import { test, equal } from './harness.js'
import { patterns, collapseSpaces, isRealDate, findDuplicateWord, validateRecord } from '../scripts/validators.js'

test('description rejects leading and trailing spaces', () => {
  equal(patterns.description.test(' Lunch'), false)
  equal(patterns.description.test('Lunch '), false)
  equal(patterns.description.test('Lunch at cafeteria'), true)
})

test('collapseSpaces collapses doubles and trims', () => {
  equal(collapseSpaces('  Bus   pass '), 'Bus pass')
})

test('amount accepts valid numbers and rejects bad ones', () => {
  ;['0', '12.5', '12.50', '99999.99'].forEach(v => equal(patterns.amount.test(v), true))
  ;['012', '1.234', '-3', '', '1.'].forEach(v => equal(patterns.amount.test(v), false))
})

test('date pattern and real calendar check', () => {
  equal(patterns.date.test('2025-09-29'), true)
  equal(patterns.date.test('2025-13-01'), false)
  equal(isRealDate('2025-02-30'), false)
  equal(isRealDate('2024-02-29'), true)
})

test('category allows letters, spaces and hyphens only', () => {
  equal(patterns.category.test('Food'), true)
  equal(patterns.category.test('Side-Gigs Income'), true)
  equal(patterns.category.test('Food2'), false)
  equal(patterns.category.test('-Food'), false)
})

test('findDuplicateWord uses a back-reference', () => {
  equal(findDuplicateWord('Coffee coffee with friends'), 'Coffee')
  equal(findDuplicateWord('Lunch at cafeteria'), null)
})

test('validateRecord returns a message per bad field', () => {
  equal(validateRecord({ description: 'Lunch', amount: '12.50', date: '2025-09-25', category: 'Food' }), {})
  const errors = validateRecord({ description: ' x', amount: 'abc', date: '2025-02-30', category: '1' })
  equal(Object.keys(errors).sort(), ['amount', 'category', 'date', 'description'])
})

test('rate allows up to eight decimals', () => {
  equal(patterns.rate.test('0.00069'), true)
  equal(patterns.rate.test('1'), true)
  equal(patterns.rate.test('0.123456789'), false)
  equal(patterns.rate.test('-1'), false)
})
