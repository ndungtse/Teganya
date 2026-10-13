import { getState, subscribe } from '../state.js'
import { totalAmount, topCategory, lastSevenDays, capStatus } from '../stats.js'
import { displayAmount } from './display.js'
import { announce } from './announce.js'

const today = () => new Date().toLocaleDateString('en-CA')
const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 })
const weekday = date => new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' })

let lastCapMessage = null

function renderStats({ records }) {
  document.getElementById('stat-total').textContent = records.length
  document.getElementById('stat-sum').textContent = displayAmount(totalAmount(records))
  document.getElementById('stat-top').textContent = topCategory(records) ?? 'None yet'
}

function renderTrend({ records }) {
  const days = lastSevenDays(records, today())
  const highest = Math.max(...days.map(day => day.total))
  document.getElementById('trend-chart').innerHTML = days.map(({ date, total }) => `
    <li>
      <span class="visually-hidden">${weekday(date)}: ${displayAmount(total)}</span>
      <span class="trend-day" aria-hidden="true">${weekday(date)}</span>
      <span class="trend-bar" aria-hidden="true" style="--ratio: ${highest ? total / highest : 0}"></span>
      <span class="trend-value" aria-hidden="true">${compact.format(total)}</span>
    </li>`).join('')
}

function capMessage(status, total, cap) {
  if (status.state === 'none') return 'No cap set. Add one in Settings.'
  const percent = Math.round((total / cap) * 100)
  if (status.state === 'over') return `Over the cap by ${displayAmount(status.overage)} (${percent}% used).`
  return `${displayAmount(status.remaining)} remaining of ${displayAmount(cap)} (${percent}% used).`
}

function renderCap({ records, settings }) {
  const total = totalAmount(records)
  const status = capStatus(total, settings.cap)
  const message = capMessage(status, total, settings.cap)
  const bar = document.getElementById('cap-bar')
  bar.style.setProperty('--ratio', settings.cap ? Math.min(total / settings.cap, 1) : 0)
  bar.classList.toggle('is-over', status.state === 'over')
  document.getElementById('cap-message').textContent = message
  if (lastCapMessage !== null && message !== lastCapMessage) {
    announce(message, status.state === 'over' ? 'assertive' : 'polite')
  }
  lastCapMessage = message
}

function render(state) {
  renderStats(state)
  renderTrend(state)
  renderCap(state)
}

export function mountDashboard() {
  subscribe(render)
  render(getState())
}
