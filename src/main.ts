/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Composables
import { createApp } from 'vue'
import { createVuetify } from 'vuetify/lib/entry-bundler.mjs'

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Styles
import '@mdi/font/css/materialdesignicons.css'
import './tailwind.css'
import 'unfonts.css'

const vuetify = createVuetify()

const app = createApp(App)

registerPlugins(app)

app.use(vuetify).mount('#app')
