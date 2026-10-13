export const patterns = {
  description: /^\S(?:.*\S)?$/,
  amount: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
  rate: /^(0|[1-9]\d*)(\.\d{1,8})?$/,
  date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
  category: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/
}

export const collapseSpaces = text => text.trim().replace(/\s{2,}/g, ' ')

export function isRealDate(text) {
  if (!patterns.date.test(text)) return false
  const [year, month, day] = text.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCMonth() === month - 1 && date.getUTCDate() === day
}

export function findDuplicateWord(text) {
  const match = text.match(/\b(\w+)\s+\1\b/i)
  return match ? match[1] : null
}

export function validateRecord({ description, amount, date, category }) {
  const errors = {}
  if (!patterns.description.test(description)) errors.description = 'Remove spaces at the start or end.'
  if (!patterns.amount.test(amount)) errors.amount = 'Use a number like 12 or 12.50.'
  if (!isRealDate(date)) errors.date = 'Use a real date as YYYY-MM-DD.'
  if (!patterns.category.test(category)) errors.category = 'Use letters, spaces or hyphens only.'
  return errors
}
