import { readonly, ref } from 'vue'

export type ThemeName = 'light' | 'dark'
export const THEME_STORAGE_KEY = 'hackifc.theme'

export function readThemePreference (storage?: Pick<Storage, 'getItem'>): ThemeName {
  try {
    return (storage ?? window.localStorage).getItem(THEME_STORAGE_KEY) === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

const current = ref<ThemeName>(readThemePreference())
const listeners = new Set<(theme: ThemeName) => void>()
export const selectedTheme = readonly(current)

function applyTheme (theme: ThemeName) {
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
  }
  current.value = theme
  for (const listener of listeners) {
    listener(theme)
  }
}

export function setTheme (theme: ThemeName) {
  applyTheme(theme)
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // The selected theme remains usable when browser storage is unavailable.
  }
}

export function toggleTheme () {
  setTheme(current.value === 'light' ? 'dark' : 'light')
}

export function subscribeTheme (listener: (theme: ThemeName) => void) {
  listeners.add(listener)
  listener(current.value)
  return () => {
    listeners.delete(listener)
  }
}

applyTheme(current.value)
if (typeof window !== 'undefined') {
  window.addEventListener('storage', event => {
    if (event.key === THEME_STORAGE_KEY || event.key === null) {
      applyTheme(readThemePreference())
    }
  })
}
