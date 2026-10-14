import { test, equal } from './harness.js'
import { totalAmount, topCategory, lastSevenDays, capStatus } from '../scripts/stats.js'

const records = [
  { category: 'Food', amount: 10, date: '2026-10-14' },
  { category: 'Food', amount: 5.5, date: '2026-10-14' },
  { category: 'Books', amount: 20, date: '2026-10-10' },
  { category: 'Books', amount: 1, date: '2026-09-01' }
]

test('totalAmount sums without floating point noise', () => {
  equal(totalAmount(records), 36.5)
  equal(totalAmount([{ amount: 0.1 }, { amount: 0.2 }]), 0.3)
})

test('topCategory ranks by count then amount and is null when empty', () => {
  equal(topCategory(records), 'Books')
  equal(topCategory([]), null)
})

test('lastSevenDays returns seven days oldest first with zero fill', () => {
  const days = lastSevenDays(records, '2026-10-14')
  equal(days.length, 7)
  equal(days[0], { date: '2026-10-08', total: 0 })
  equal(days[2], { date: '2026-10-10', total: 20 })
  equal(days[6], { date: '2026-10-14', total: 15.5 })
})

test('lastSevenDays crosses month boundaries', () => {
  equal(lastSevenDays([], '2026-03-02').map(day => day.date)[0], '2026-02-24')
})

test('capStatus handles none, under and over', () => {
  equal(capStatus(50, 0), { state: 'none', remaining: 0, overage: 0 })
  equal(capStatus(50, 200), { state: 'under', remaining: 150, overage: 0 })
  equal(capStatus(250, 200), { state: 'over', remaining: 0, overage: 50 })
  equal(capStatus(200, 200), { state: 'under', remaining: 0, overage: 0 })
})
