import { getState, subscribe } from '../state.js'
import { compileRegex, highlight, filterRecords, sortRecords } from '../search.js'
import { displayAmount } from './display.js'
import { actionButtons, mountRowEdit } from './row-edit.js'

const view = { query: '', ignoreCase: true, sort: 'date:desc' }
let activeRegex = null
let knownIds = null
let elements

function updateRegex() {
  const regex = compileRegex(view.query, view.ignoreCase ? 'i' : '')
  const invalid = view.query !== '' && regex === null
  elements.error.textContent = invalid ? 'That is not a valid regular expression yet.' : ''
  elements.search.toggleAttribute('aria-invalid', invalid)
  if (!invalid) activeRegex = regex
}

function visibleRecords() {
  const [key, direction] = view.sort.split(':')
  return sortRecords(filterRecords(getState().records, activeRegex), key, direction)
}

const newClass = record => (knownIds && !knownIds.has(record.id) ? ' class="is-new"' : '')

function rowHtml(record) {
  return `<tr data-id="${record.id}"${newClass(record)}>
    <td>${highlight(record.description, activeRegex)}</td>
    <td>${highlight(record.category, activeRegex)}</td>
    <td>${highlight(record.date, activeRegex)}</td>
    <td class="num">${highlight(displayAmount(record.amount), activeRegex)}</td>
    <td class="actions-cell">${actionButtons(record)}</td>
  </tr>`
}

function cardHtml(record) {
  return `<li data-id="${record.id}"${newClass(record)}>
    <span class="card-title">${highlight(record.description, activeRegex)}</span>
    <div class="card-meta">
      <span>${highlight(record.category, activeRegex)}</span>
      <span>${highlight(record.date, activeRegex)}</span>
      <span class="num">${highlight(displayAmount(record.amount), activeRegex)}</span>
    </div>
    <div class="actions">${actionButtons(record)}</div>
  </li>`
}

export function renderTable() {
  const records = visibleRecords()
  const total = getState().records.length
  elements.body.innerHTML = records.map(rowHtml).join('')
  elements.cards.innerHTML = records.map(cardHtml).join('')
  elements.empty.hidden = records.length > 0
  elements.count.textContent = `Showing ${records.length} of ${total} records`
  knownIds = new Set(getState().records.map(record => record.id))
}

function refresh() {
  updateRegex()
  renderTable()
}

export function mountTable() {
  elements = {
    search: document.getElementById('search-input'),
    error: document.getElementById('search-error'),
    count: document.getElementById('records-count'),
    body: document.getElementById('records-body'),
    cards: document.getElementById('records-cards'),
    empty: document.getElementById('records-empty')
  }
  document.getElementById('records-controls').addEventListener('submit', event => event.preventDefault())
  elements.search.addEventListener('input', () => { view.query = elements.search.value; refresh() })
  document.getElementById('search-ignore-case').addEventListener('change', event => {
    view.ignoreCase = event.target.checked
    refresh()
  })
  document.getElementById('sort-select').addEventListener('change', event => {
    view.sort = event.target.value
    renderTable()
  })
  mountRowEdit(renderTable)
  subscribe(renderTable)
  renderTable()
}
