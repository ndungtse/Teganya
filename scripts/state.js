let state = { records: [], settings: {} }
const listeners = new Set()

const notify = () => listeners.forEach(listener => listener(state))

export const getState = () => state

export function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function init(data) {
  state = structuredClone(data)
  notify()
}

export function replaceAll(data) {
  init(data)
}

export function nextId(records) {
  const highest = Math.max(0, ...records.map(record => Number(record.id.slice(4))))
  return `rec_${String(highest + 1).padStart(4, '0')}`
}

function cleanInput({ description, amount, category, date }) {
  return { description, amount: Number(amount), category, date }
}

export function addRecord(input) {
  const now = new Date().toISOString()
  const record = { id: nextId(state.records), ...cleanInput(input), createdAt: now, updatedAt: now }
  state = { ...state, records: [...state.records, record] }
  notify()
  return record
}

export function updateRecord(id, input) {
  const updatedAt = new Date().toISOString()
  const records = state.records.map(record =>
    record.id === id ? { ...record, ...cleanInput(input), updatedAt } : record
  )
  state = { ...state, records }
  notify()
}

export function removeRecord(id) {
  state = { ...state, records: state.records.filter(record => record.id !== id) }
  notify()
}

export function updateSettings(patch) {
  state = { ...state, settings: { ...state.settings, ...patch } }
  notify()
}
