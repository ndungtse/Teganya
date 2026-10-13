export function compileRegex(input, flags = 'i') {
  try {
    return input ? new RegExp(input, flags) : null
  } catch {
    return null
  }
}

const htmlEscapes = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }

export const escapeHtml = text => text.replace(/[&<>"']/g, char => htmlEscapes[char])

export function highlight(text, re) {
  if (!re) return escapeHtml(text)
  const flags = re.flags.includes('g') ? re.flags : re.flags + 'g'
  let html = ''
  let last = 0
  for (const match of text.matchAll(new RegExp(re.source, flags))) {
    if (match[0] === '') continue
    html += escapeHtml(text.slice(last, match.index)) + `<mark>${escapeHtml(match[0])}</mark>`
    last = match.index + match[0].length
  }
  return html + escapeHtml(text.slice(last))
}

const searchableText = record =>
  [record.description, record.category, record.date, record.amount.toFixed(2)]

export function filterRecords(records, re) {
  if (!re) return records
  return records.filter(record => searchableText(record).some(text => re.test(text)))
}

export function sortRecords(records, key, direction) {
  const factor = direction === 'asc' ? 1 : -1
  const compare = key === 'description'
    ? (a, b) => a.description.localeCompare(b.description)
    : (a, b) => (a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0)
  return [...records].sort((a, b) => factor * compare(a, b))
}
