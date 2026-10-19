import type { App } from 'vue'
import { createPinia } from 'pinia'

import router from '../router'
import { vuetify, themePlugin } from './vuetify'

const pinia = createPinia()

export function registerPlugins(app: App) {
  app.use(pinia)
  app.use(vuetify)
  app.use(themePlugin)
  app.use(router)
}