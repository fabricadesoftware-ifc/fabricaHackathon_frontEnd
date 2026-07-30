// src/plugins/index.ts

import router from '../router';

// Types
import type { App } from 'vue'

// Plugins
import { vuetify, themePlugin } from './vuetify'

export function registerPlugins (app: App) {
  app.use(vuetify)
  app.use(themePlugin)
  app.use(router);
}