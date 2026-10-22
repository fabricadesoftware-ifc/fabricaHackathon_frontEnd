// src/plugins/vuetify.ts

import { createThemePlugin } from '@vuetify/v0'
import { createVuetify } from 'vuetify'

import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export const vuetify = createVuetify({
  components,
  directives,
})

export const themePlugin = createThemePlugin({
  default: 'light',
  target: 'html',
  themes: {
    light: {
      dark: false,
      colors: {
        // 🔵 Cor principal
        'primary': '#2563EB',
        'primary-hover': '#1D4ED8',
        'primary-light': '#3B82F6',

        'secondary': '#64748b',
        'error': '#ef4444',
        'info': '#1867c0',
        'success': '#22c55e',
        'warning': '#f59e0b',

        // ⚪ Fundo
        'background': '#F9FAFB',
        'background-alt': '#F3F4F6',
        'background-dashboard': '#FFFFFF',

        // 🧾 Cards
        'surface': '#FFFFFF',
        'surface-tint': '#F9FAFB',
        'surface-variant': '#F3F4F6',
        'divider': '#E5E7EB',

        // Textos "on-*" (usados em cima das cores acima)
        'on-primary': '#ffffff',
        'on-secondary': '#ffffff',
        'on-error': '#ffffff',
        'on-info': '#ffffff',
        'on-success': '#ffffff',
        'on-warning': '#1a1a1a',
        'on-background': '#111827',
        'on-surface': '#111827',
        'on-surface-variant': '#4B5563',

        // 📝 Textos (hierarquia) — cores customizadas extras
        'text-primary': '#111827',   // título / texto principal
        'text-secondary': '#4B5563', // subtítulo / texto secundário
        'text-weak': '#9CA3AF',      // label / informações menores
      },
    },
    dark: {
      dark: true,
      colors: {
        'primary': '#c4b5fd',
        'secondary': '#94a3b8',
        'error': '#f87171',
        'info': '#38bdf8',
        'success': '#4ade80',
        'warning': '#fb923c',
        'background': '#121212',
        'surface': '#1a1a1a',
        'surface-tint': '#2a2a2a',
        'surface-variant': '#1e1e1e',
        'divider': '#404040',
        'on-primary': '#1a1a1a',
        'on-secondary': '#1a1a1a',
        'on-error': '#1a1a1a',
        'on-info': '#1a1a1a',
        'on-success': '#1a1a1a',
        'on-warning': '#1a1a1a',
        'on-background': '#e0e0e0',
        'on-surface': '#e0e0e0',
        'on-surface-variant': '#a0a0a0',
      },
    },
  },
})