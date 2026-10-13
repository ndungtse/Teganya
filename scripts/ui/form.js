import { getState, subscribe, addRecord } from '../state.js'
import { validateRecord, collapseSpaces, findDuplicateWord } from '../validators.js'
import { announce } from './announce.js'

const fieldNames = ['description', 'amount', 'category', 'date']
const today = () => new Date().toLocaleDateString('en-CA')

let form

function renderCategories() {
  const select = form.elements.category
  const chosen = select.value
  select.innerHTML = getState().settings.categories
    .map(name => `<option value="${name}">${name}</option>`)
    .join('')
  if (chosen) select.value = chosen
}

function showErrors(errors) {
  fieldNames.forEach(name => {
    const input = form.elements[name]
    const message = errors[name] ?? ''
    document.getElementById(`${name}-error`).textContent = message
    if (message) input.setAttribute('aria-invalid', 'true')
    else input.removeAttribute('aria-invalid')
  })
}

function showDuplicateNote() {
  const word = findDuplicateWord(form.elements.description.value)
  document.getElementById('description-note').textContent =
    word ? `The word "${word}" appears twice in a row. Check that this is intended.` : ''
}

function readValues() {
  return {
    description: collapseSpaces(form.elements.description.value),
    amount: form.elements.amount.value.trim(),
    category: form.elements.category.value,
    date: form.elements.date.value.trim()
  }
}

function resetForm() {
  form.reset()
  form.elements.date.value = today()
  showErrors({})
  showDuplicateNote()
}

function onSubmit(event) {
  event.preventDefault()
  const values = readValues()
  form.elements.description.value = values.description
  const errors = validateRecord(values)
  showErrors(errors)
  const firstInvalid = fieldNames.find(name => errors[name])
  if (firstInvalid) {
    form.elements[firstInvalid].focus()
    return
  }
  addRecord(values)
  resetForm()
  announce('Record added')
  location.hash = '#/records'
}

export function mountForm() {
  form = document.getElementById('record-form')
  renderCategories()
  subscribe(renderCategories)
  form.addEventListener('submit', onSubmit)
  form.elements.description.addEventListener('input', showDuplicateNote)
  form.elements.date.value = today()
}
