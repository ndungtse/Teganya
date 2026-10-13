import { getState, subscribe } from '../state.js'

function applyTheme({ settings }) {
  const root = document.documentElement
  if (settings.theme === 'system') root.removeAttribute('data-theme')
  else root.setAttribute('data-theme', settings.theme)
}

export function mountTheme() {
  applyTheme(getState())
  subscribe(applyTheme)
}
