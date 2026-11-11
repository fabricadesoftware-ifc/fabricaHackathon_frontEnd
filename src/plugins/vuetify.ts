import type { App } from 'vue'
import { createThemePlugin, useTheme } from '@vuetify/v0'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { selectedTheme, subscribeTheme, type ThemeName } from '../theme/state'
import '../theme/tokens.css'

const palette = getComputedStyle(document.documentElement)
const colorKeys = [
  'background',
  'surface',
  'surface-bright',
  'surface-light',
  'surface-variant',
  'on-surface-variant',
  'primary',
  'primary-darken-1',
  'secondary',
  'secondary-darken-1',
  'error',
  'info',
  'success',
  'warning',
  'app-avatar',
  'app-on-brand',
]
function vuetifyColors (theme: ThemeName) {
  return Object.fromEntries(colorKeys.map(key => [
    key, palette.getPropertyValue(`--app-${theme}-vuetify-${key}`).trim(),
  ]))
}

export const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: selectedTheme.value,
    themes: {
      light: { dark: false, colors: vuetifyColors('light') },
      dark: { dark: true, colors: vuetifyColors('dark') },
    },
  },
})

const colors = {
  'primary': 'var(--app-brand-action)',
  'primary-hover': 'var(--app-brand-hover-surface)',
  'primary-light': 'var(--app-brand-light)',
  'secondary': 'var(--app-ink-muted)',
  'error': 'var(--app-status-error)',
  'info': 'var(--app-status-info)',
  'success': 'var(--app-status-success)',
  'warning': 'var(--app-status-warning)',
  'background': 'var(--app-surface-faint-neutral)',
  'background-alt': 'var(--app-surface-soft-neutral)',
  'background-dashboard': 'var(--app-canvas)',
  'surface': 'var(--app-surface-plain)',
  'surface-tint': 'var(--app-surface-faint-neutral)',
  'surface-variant': 'var(--app-surface-soft-neutral)',
  'divider': 'var(--app-line-neutral)',
  'on-primary': 'var(--app-on-brand)',
  'on-secondary': 'var(--app-on-brand)',
  'on-error': 'var(--app-on-brand)',
  'on-info': 'var(--app-on-brand)',
  'on-success': 'var(--app-on-brand)',
  'on-warning': 'var(--app-on-warning)',
  'on-background': 'var(--app-ink-strong-neutral)',
  'on-surface': 'var(--app-ink-strong-neutral)',
  'on-surface-variant': 'var(--app-ink-secondary-neutral)',
  'text-primary': 'var(--app-ink-strong-neutral)',
  'text-secondary': 'var(--app-ink-secondary-neutral)',
  'text-weak': 'var(--app-ink-placeholder)',
}
export const themePlugin = createThemePlugin({
  default: selectedTheme.value,
  target: 'html',
  themes: {
    light: { dark: false, colors },
    dark: { dark: true, colors },
  },
})

/** Keep both installed theme providers, including teleported UI, in sync. */
export function connectThemes (app: App) {
  const legacyTheme = app.runWithContext(() => useTheme())
  const stop = subscribeTheme(theme => {
    legacyTheme.select(theme)
    vuetify.theme.change(theme)
  })
  app.onUnmount(stop)
}
