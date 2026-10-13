import { patterns, isRealDate } from './validators.js'

export const STORAGE_KEY = 'teganya:data'

const themes = ['system', 'light', 'dark']
const currencies = ['RWF', 'USD', 'EUR']
const isObject = value => typeof value === 'object' && value !== null && !Array.isArray(value)
const isIsoDate = value => typeof value === 'string' && !Number.isNaN(Date.parse(value))

function recordErrors(record, index, categories) {
  const path = `records[${index}]`
  if (!isObject(record)) return [`${path} must be an object`]
  const errors = []
  const check = (field, valid, hint) => {
    if (!valid) errors.push(`${path}.${field} ${hint}`)
  }
  check('id', typeof record.id === 'string' && /^rec_\d{4,}$/.test(record.id), 'must look like rec_0001')
  check('description', typeof record.description === 'string' && patterns.description.test(record.description), 'must not start or end with a space')
  check('amount', typeof record.amount === 'number' && patterns.amount.test(String(record.amount)), 'must be a number with at most two decimals')
  check('category', typeof record.category === 'string' && categories.includes(record.category), 'must be one of the settings categories')
  check('date', typeof record.date === 'string' && isRealDate(record.date), 'must be a real date as YYYY-MM-DD')
  check('createdAt', isIsoDate(record.createdAt), 'must be an ISO timestamp')
  check('updatedAt', isIsoDate(record.updatedAt), 'must be an ISO timestamp')
  return errors
}

function settingsErrors(settings) {
  if (!isObject(settings)) return ['settings must be an object']
  const errors = []
  const check = (field, valid, hint) => {
    if (!valid) errors.push(`settings.${field} ${hint}`)
  }
  check('baseCurrency', typeof settings.baseCurrency === 'string' && settings.baseCurrency !== '', 'must be text')
  check('displayCurrency', currencies.includes(settings.displayCurrency), `must be one of ${currencies.join(', ')}`)
  check('cap', typeof settings.cap === 'number' && settings.cap >= 0, 'must be a number of 0 or more')
  check('theme', themes.includes(settings.theme), `must be one of ${themes.join(', ')}`)
  for (const code of ['USD', 'EUR']) {
    const rate = settings.rates?.[code]
    check(`rates.${code}`, typeof rate === 'number' && rate > 0, 'must be a number above 0')
  }
  if (!Array.isArray(settings.categories)) {
    errors.push('settings.categories must be a list')
  } else {
    settings.categories.forEach((name, index) =>
      check(`categories[${index}]`, typeof name === 'string' && patterns.category.test(name), 'must use letters, spaces or hyphens')
    )
  }
  return errors
}

export function validateImport(parsed) {
  if (!isObject(parsed)) return { ok: false, errors: ['File must contain an object with records and settings.'] }
  const errors = []
  if (!Array.isArray(parsed.records)) errors.push('records must be a list')
  errors.push(...settingsErrors(parsed.settings))
  if (Array.isArray(parsed.records)) {
    const categories = Array.isArray(parsed.settings?.categories) ? parsed.settings.categories : []
    const seen = new Set()
    parsed.records.forEach((record, index) => {
      errors.push(...recordErrors(record, index, categories))
      if (isObject(record) && seen.has(record.id)) errors.push(`records[${index}] has a duplicate id ${record.id}`)
      if (isObject(record)) seen.add(record.id)
    })
  }
  return { ok: errors.length === 0, errors }
}

export const exportJson = data => JSON.stringify(data, null, 2)

export function loadData() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return validateImport(parsed).ok ? parsed : null
  } catch {
    return null
  }
}

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return true
  } catch {
    return false
  }
}
