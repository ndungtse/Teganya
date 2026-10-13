import { getState, updateRecord, removeRecord } from '../state.js'
import { validateRecord, collapseSpaces } from '../validators.js'
import { escapeHtml } from '../search.js'
import { announce } from './announce.js'

const fieldNames = ['description', 'amount', 'category', 'date']
const labels = { description: 'Description', amount: 'Amount (RWF)', category: 'Category', date: 'Date' }
let pendingDelete = null

const iconButton = (action, label, icon) =>
  `<button type="button" class="icon-button" data-action="${action}" aria-label="${label}"><span class="icon ${icon}" aria-hidden="true"></span></button>`

export function actionButtons(record) {
  const name = escapeHtml(record.description)
  return iconButton('edit', `Edit ${name}`, 'icon-edit') + iconButton('delete', `Delete ${name}`, 'icon-trash')
}

function inputHtml(name, record) {
  if (name === 'category') {
    const options = getState().settings.categories
      .map(category => `<option${category === record.category ? ' selected' : ''}>${category}</option>`)
      .join('')
    return `<select id="edit-category" aria-describedby="edit-category-error">${options}</select>`
  }
  const type = name === 'date' ? 'date' : 'text'
  return `<input id="edit-${name}" type="${type}" value="${escapeHtml(String(record[name]))}" aria-describedby="edit-${name}-error">`
}

function editFormHtml(record) {
  const fields = fieldNames.map(name => `
    <div class="field">
      <label for="edit-${name}">${labels[name]}</label>
      ${inputHtml(name, record)}
      <p id="edit-${name}-error" class="field-error"></p>
    </div>`).join('')
  return `<form class="edit-form" data-id="${record.id}" novalidate>
    ${fields}
    <div class="actions">
      <button type="submit" class="button button-primary">Save</button>
      <button type="button" class="button" data-action="cancel">Cancel</button>
    </div>
  </form>`
}

function startEdit(item) {
  const record = getState().records.find(entry => entry.id === item.dataset.id)
  item.innerHTML = item.tagName === 'TR'
    ? `<td colspan="5">${editFormHtml(record)}</td>`
    : editFormHtml(record)
  item.querySelector('#edit-description').focus()
}

function showEditErrors(form, errors) {
  fieldNames.forEach(name => {
    form.querySelector(`#edit-${name}-error`).textContent = errors[name] ?? ''
    form.querySelector(`#edit-${name}`).toggleAttribute('aria-invalid', Boolean(errors[name]))
  })
}

function focusEditButton(id) {
  const tableShown = getComputedStyle(document.querySelector('.table-wrap')).display !== 'none'
  const list = tableShown ? '#records-body' : '#records-cards'
  document.querySelector(`${list} [data-id="${id}"] [data-action="edit"]`)?.focus()
}

function saveEdit(form) {
  const values = {
    description: collapseSpaces(form.querySelector('#edit-description').value),
    amount: form.querySelector('#edit-amount').value.trim(),
    category: form.querySelector('#edit-category').value,
    date: form.querySelector('#edit-date').value.trim()
  }
  const errors = validateRecord(values)
  showEditErrors(form, errors)
  const firstInvalid = fieldNames.find(name => errors[name])
  if (firstInvalid) {
    form.querySelector(`#edit-${firstInvalid}`).focus()
    return
  }
  updateRecord(form.dataset.id, values)
  announce('Record updated')
  focusEditButton(form.dataset.id)
}

function askDelete(id, trigger) {
  const record = getState().records.find(entry => entry.id === id)
  pendingDelete = { id, trigger }
  document.getElementById('delete-text').textContent = `"${record.description}" will be removed.`
  document.getElementById('delete-dialog').showModal()
}

const motionAllowed = () => !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

function finishDelete(id) {
  removeRecord(id)
  announce('Record deleted')
  document.getElementById('records-title').focus()
}

function onDialogClose(dialog) {
  const { id, trigger } = pendingDelete
  if (dialog.returnValue === 'confirm') {
    document.querySelectorAll(`[data-id="${id}"]`).forEach(item => item.classList.add('is-leaving'))
    setTimeout(() => finishDelete(id), motionAllowed() ? 160 : 0)
  } else {
    trigger.focus()
  }
  pendingDelete = null
  dialog.returnValue = ''
}

export function mountRowEdit(rerender) {
  const dialog = document.getElementById('delete-dialog')
  dialog.addEventListener('close', () => onDialogClose(dialog))

  const cancelEdit = id => {
    rerender()
    focusEditButton(id)
  }

  for (const list of [document.getElementById('records-body'), document.getElementById('records-cards')]) {
    list.addEventListener('click', event => {
      const button = event.target.closest('[data-action]')
      if (!button) return
      const item = button.closest('[data-id]')
      if (button.dataset.action === 'edit') startEdit(item)
      if (button.dataset.action === 'delete') askDelete(item.dataset.id, button)
      if (button.dataset.action === 'cancel') cancelEdit(item.dataset.id)
    })
    list.addEventListener('submit', event => {
      event.preventDefault()
      saveEdit(event.target)
    })
    list.addEventListener('keydown', event => {
      const form = event.target.closest('.edit-form')
      if (event.key === 'Escape' && form) cancelEdit(form.dataset.id)
    })
  }
}
