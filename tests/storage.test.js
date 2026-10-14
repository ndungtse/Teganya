import { test, equal } from './harness.js'
import { validateImport, exportJson } from '../scripts/storage.js'

const record = {
  id: 'rec_0001', description: 'Lunch', amount: 12.5, category: 'Food', date: '2025-09-25',
  createdAt: '2025-09-25T10:00:00.000Z', updatedAt: '2025-09-25T10:00:00.000Z'
}
const settings = {
  baseCurrency: 'RWF', displayCurrency: 'RWF', rates: { USD: 0.0007, EUR: 0.0006 },
  categories: ['Food'], cap: 1000, theme: 'system'
}
const good = { records: [record], settings }
const messages = data => validateImport(data).errors.join('\n')

test('valid data passes', () => {
  equal(validateImport(good), { ok: true, errors: [] })
})

test('non objects and missing keys fail', () => {
  equal(validateImport(null).ok, false)
  equal(validateImport([]).ok, false)
  equal(validateImport({}).ok, false)
})

test('bad record fields are listed by record and field', () => {
  const bad = { ...good, records: [{ ...record, amount: 'x', date: '2025-02-30', description: ' Lunch' }] }
  const text = messages(bad)
  equal(validateImport(bad).ok, false)
  equal(text.includes('records[0].amount'), true)
  equal(text.includes('records[0].date'), true)
  equal(text.includes('records[0].description'), true)
})

test('missing fields and bad timestamps fail', () => {
  const { updatedAt, ...partial } = record
  equal(messages({ ...good, records: [partial] }).includes('records[0].updatedAt'), true)
  equal(messages({ ...good, records: [{ ...record, createdAt: 'yesterday' }] }).includes('records[0].createdAt'), true)
})

test('duplicate ids fail', () => {
  equal(messages({ ...good, records: [record, record] }).includes('duplicate id'), true)
})

test('record category must exist in settings', () => {
  const other = { ...record, category: 'Books' }
  equal(messages({ ...good, records: [other] }).includes('records[0].category'), true)
})

test('bad settings are listed by field', () => {
  const bad = { ...good, settings: { ...settings, cap: -5, theme: 'neon', rates: { USD: 0, EUR: 'x' }, categories: ['Food2'] } }
  const text = messages(bad)
  equal(text.includes('settings.cap'), true)
  equal(text.includes('settings.theme'), true)
  equal(text.includes('settings.rates.USD'), true)
  equal(text.includes('settings.rates.EUR'), true)
  equal(text.includes('settings.categories[0]'), true)
})

test('export then import round-trips', () => {
  equal(JSON.parse(exportJson(good)), good)
  equal(validateImport(JSON.parse(exportJson(good))).ok, true)
})
