import { init, getState, subscribe } from './state.js'
import { loadData, saveData } from './storage.js'
import { mountRouter } from './ui/router.js'
import { mountForm } from './ui/form.js'
import { mountTable } from './ui/table.js'
import { mountDashboard } from './ui/dashboard.js'
import { mountSettings } from './ui/settings.js'
import { mountTheme } from './ui/theme.js'
import { mountMenu } from './ui/menu.js'

const loadSeed = () => fetch('seed.json').then(response => response.json())

async function boot() {
  init(loadData() ?? await loadSeed())
  saveData(getState())
  subscribe(saveData)
  mountTheme()
  mountMenu()
  mountForm()
  mountTable()
  mountDashboard()
  mountSettings()
  mountRouter()
}

boot()
