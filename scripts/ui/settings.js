import { getState, subscribe, updateSettings, replaceAll } from '../state.js'
import { patterns } from '../validators.js'
import { validateImport, exportJson } from '../storage.js'
import { escapeHtml } from '../search.js'
import { announce } from './announce.js'

const $ = id => document.getElementById(id)

function fillFields() {
  const { cap, rates, displayCurrency, theme } = getState().settings
  $('cap-input').value = cap
  $('rate-usd').value = rates.USD
  $('rate-eur').value = rates.EUR
  $('display-currency').value = displayCurrency
  $('theme-select').value = theme
}

function setError(id, message) {
  $(`${id}-error`).textContent = message
  $(id).toggleAttribute('aria-invalid', Boolean(message))
}

const validRate = text => patterns.rate.test(text) && Number(text) > 0

function saveSettings(event) {
  event.preventDefault()
  const cap = $('cap-input').value.trim()
  const usd = $('rate-usd').value.trim()
  const eur = $('rate-eur').value.trim()
  setError('cap-input', patterns.amount.test(cap) ? '' : 'Use a number like 250000, or 0 for no cap.')
  setError('rate-usd', validRate(usd) ? '' : 'Use a number above 0, like 0.00069.')
  setError('rate-eur', validRate(eur) ? '' : 'Use a number above 0, like 0.00063.')
  const firstInvalid = ['cap-input', 'rate-usd', 'rate-eur'].find(id => $(id).hasAttribute('aria-invalid'))
  if (firstInvalid) return $(firstInvalid).focus()
  updateSettings({ cap: Number(cap), rates: { USD: Number(usd), EUR: Number(eur) } })
  announce('Settings saved')
}

function renderCategories() {
  $('category-list').innerHTML = getState().settings.categories.map(name => `
    <li>
      <span>${escapeHtml(name)}</span>
      <button type="button" class="icon-button" data-category="${escapeHtml(name)}" aria-label="Remove category ${escapeHtml(name)}">
        <span class="icon icon-trash" aria-hidden="true"></span>
      </button>
    </li>`).join('')
}

function categoryProblem(name) {
  const { categories } = getState().settings
  if (!patterns.category.test(name)) return 'Use letters, spaces or hyphens only.'
  if (categories.some(existing => existing.toLowerCase() === name.toLowerCase())) return 'That category already exists.'
  return ''
}

function addCategory(event) {
  event.preventDefault()
  const name = $('category-input').value.trim().replace(/\s{2,}/g, ' ')
  const problem = categoryProblem(name)
  setError('category-input', problem)
  if (problem) return $('category-input').focus()
  updateSettings({ categories: [...getState().settings.categories, name] })
  $('category-input').value = ''
  announce(`Category ${name} added`)
}

function removeCategory(event) {
  const button = event.target.closest('[data-category]')
  if (!button) return
  const name = button.dataset.category
  const inUse = getState().records.some(record => record.category === name)
  if (inUse) {
    setError('category-input', `${name} is used by existing records and cannot be removed.`)
    return announce(`${name} is in use and cannot be removed`, 'assertive')
  }
  setError('category-input', '')
  updateSettings({ categories: getState().settings.categories.filter(item => item !== name) })
  announce(`Category ${name} removed`)
  $('category-input').focus()
}

function exportData() {
  const blob = new Blob([exportJson(getState())], { type: 'application/json' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `teganya-${new Date().toLocaleDateString('en-CA')}.json`
  link.click()
  URL.revokeObjectURL(link.href)
  announce('Export downloaded')
}

function showImportErrors(errors) {
  $('import-errors').innerHTML = errors.map(message => `<li>${escapeHtml(message)}</li>`).join('')
  if (errors.length) announce(`Import failed with ${errors.length} problems. Nothing was changed.`, 'assertive')
}

async function importData(event) {
  const file = event.target.files[0]
  event.target.value = ''
  if (!file) return
  let parsed
  try {
    parsed = JSON.parse(await file.text())
  } catch {
    return showImportErrors(['The file is not valid JSON.'])
  }
  const { ok, errors } = validateImport(parsed)
  showImportErrors(errors)
  if (!ok) return
  replaceAll(parsed)
  fillFields()
  announce(`Imported ${parsed.records.length} records`)
}

export function mountSettings() {
  fillFields()
  renderCategories()
  subscribe(renderCategories)
  window.addEventListener('hashchange', () => {
    if (location.hash === '#/settings') fillFields()
  })
  $('settings-form').addEventListener('submit', saveSettings)
  $('category-form').addEventListener('submit', addCategory)
  $('category-list').addEventListener('click', removeCategory)
  $('export-btn').addEventListener('click', exportData)
  $('import-file').addEventListener('change', importData)
  $('display-currency').addEventListener('change', event => {
    updateSettings({ displayCurrency: event.target.value })
    announce(`Showing amounts in ${event.target.value}`)
  })
  $('theme-select').addEventListener('change', event => updateSettings({ theme: event.target.value }))
}
