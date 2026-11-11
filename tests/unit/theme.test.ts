import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readThemePreference, selectedTheme, setTheme, subscribeTheme, THEME_STORAGE_KEY, toggleTheme } from '../../src/theme/state.ts'

test('theme preference defaults to light and accepts only a saved dark preference', () => {
  for (const saved of [null, '', 'system', 'invalid', 'light']) {
    assert.equal(readThemePreference({ getItem: () => saved }), 'light')
  }
  assert.equal(readThemePreference({ getItem: () => 'dark' }), 'dark')
  assert.equal(readThemePreference({ getItem: () => {
    throw new Error('Storage denied')
  } }), 'light')
})

test('theme toggles, persists, notifies both providers and releases subscriptions', () => {
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'window')
  const writes: string[][] = []
  Object.defineProperty(globalThis, 'window', { configurable: true, value: {
    localStorage: { setItem: (key: string, value: string) => writes.push([key, value]) },
  } })
  const themes: string[] = []
  setTheme('light')
  const stop = subscribeTheme(theme => themes.push(theme))
  try {
    toggleTheme()
    assert.equal(selectedTheme.value, 'dark')
    assert.deepEqual(writes.at(-1), [THEME_STORAGE_KEY, 'dark'])
    toggleTheme()
    assert.equal(selectedTheme.value, 'light')
    assert.deepEqual(themes, ['light', 'dark', 'light'])
    stop()
    setTheme('dark')
    assert.deepEqual(themes, ['light', 'dark', 'light'])
  } finally {
    stop()
    setTheme('light')
    if (previous) {
      Object.defineProperty(globalThis, 'window', previous)
    } else {
      Reflect.deleteProperty(globalThis, 'window')
    }
  }
})

test('theme remains functional without browser storage', () => {
  setTheme('dark')
  assert.equal(selectedTheme.value, 'dark')
  toggleTheme()
  assert.equal(selectedTheme.value, 'light')
})

test('the real HTML bootstrap applies the saved theme before the application loads', async () => {
  const { readFile } = await import('node:fs/promises')
  const { runInNewContext } = await import('node:vm')
  const html = await readFile(new URL('../../index.html', import.meta.url), 'utf8')
  const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1]
  assert.ok(script)
  assert.ok(html.indexOf(script) < html.indexOf('/src/main.ts'))
  for (const saved of ['dark', 'light', null, 'invalid', 'blocked']) {
    const root = { dataset: {} as Record<string, string>, style: {} as Record<string, string> }
    runInNewContext(script, {
      document: { documentElement: root },
      localStorage: { getItem: (key: string) => {
        assert.equal(key, THEME_STORAGE_KEY)
        if (saved === 'blocked') {
          throw new Error('Storage denied')
        }
        return saved
      } },
    })
    assert.equal(root.dataset.theme, saved === 'dark' ? 'dark' : 'light')
    assert.equal(root.style.colorScheme, root.dataset.theme)
  }
})
