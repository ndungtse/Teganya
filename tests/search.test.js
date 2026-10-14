import { test, equal } from './harness.js'
import { compileRegex, escapeHtml, highlight, filterRecords, sortRecords } from '../scripts/search.js'

const records = [
  { id: 'a', description: 'Coffee with friends', category: 'Entertainment', amount: 8.75, date: '2025-09-28' },
  { id: 'b', description: 'Bus pass', category: 'Transport', amount: 45, date: '2025-09-20' },
  { id: 'c', description: 'Chemistry textbook', category: 'Books', amount: 89.99, date: '2025-09-23' }
]

test('compileRegex returns null for empty or invalid input', () => {
  equal(compileRegex(''), null)
  equal(compileRegex('('), null)
  equal(compileRegex('coffee') instanceof RegExp, true)
})

test('compileRegex respects the case flag', () => {
  equal(compileRegex('COFFEE').test('coffee'), true)
  equal(compileRegex('COFFEE', '').test('coffee'), false)
})

test('escapeHtml escapes markup characters', () => {
  equal(escapeHtml('<b>"a" & \'b\'</b>'), '&lt;b&gt;&quot;a&quot; &amp; &#39;b&#39;&lt;/b&gt;')
})

test('highlight wraps matches and escapes html', () => {
  equal(highlight('a <b> coffee', /coffee/i), 'a &lt;b&gt; <mark>coffee</mark>')
  equal(highlight('plain', null), 'plain')
})

test('highlight marks every match and skips empty matches', () => {
  equal(highlight('tea tea', /tea/i), '<mark>tea</mark> <mark>tea</mark>')
  equal(highlight('abc', /x*/), 'abc')
})

test('filterRecords matches description or category', () => {
  equal(filterRecords(records, /coffee|books/i).map(r => r.id), ['a', 'c'])
  equal(filterRecords(records, null).length, 3)
})

test('filterRecords also matches the date and the amount with cents', () => {
  equal(filterRecords(records, /\.75$/).map(r => r.id), ['a'])
  equal(filterRecords(records, /^2025-09-2[03]$/).map(r => r.id), ['b', 'c'])
})

test('filterRecords supports lookahead and back-reference patterns', () => {
  equal(filterRecords(records, /^(?=.*bus)(?!.*tea)/i).map(r => r.id), ['b'])
  equal(filterRecords([{ id: 'd', description: 'tea tea time', category: 'Food', amount: 1, date: '2025-09-01' }], /\b(\w+)\s+\1\b/).length, 1)
})

test('sortRecords orders by amount, description and date in both directions', () => {
  equal(sortRecords(records, 'amount', 'asc').map(r => r.id), ['a', 'b', 'c'])
  equal(sortRecords(records, 'amount', 'desc').map(r => r.id), ['c', 'b', 'a'])
  equal(sortRecords(records, 'description', 'asc').map(r => r.id), ['b', 'c', 'a'])
  equal(sortRecords(records, 'date', 'desc').map(r => r.id), ['a', 'c', 'b'])
})

test('sortRecords does not change the original array', () => {
  const copy = [...records]
  sortRecords(records, 'amount', 'desc')
  equal(records, copy)
})
