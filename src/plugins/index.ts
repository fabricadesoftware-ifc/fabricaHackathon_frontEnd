import type { App } from 'vue'
import { createPinia } from 'pinia'

import router from '../router'
import { connectThemes, themePlugin, vuetify } from './vuetify'

const pinia = createPinia()

export function registerPlugins (app: App) {
  app.use(pinia)
  app.use(vuetify)
  app.use(themePlugin)
  connectThemes(app)
  app.use(router)
}
