import assert from 'node:assert/strict'
import { test } from 'node:test'
import { useCardReveal } from '../../src/composables/useCardReveal.ts'
import { resolveMediaUrl } from '../../src/utils/media.ts'

test('media URLs preserve absolute, inline, public and empty sources', () => {
  for (const source of ['', 'https://res.cloudinary.com/demo/image.png', 'http://example.com/logo.png', '//example.com/logo.png', 'data:image/png;base64,abc', 'blob:https://example.com/logo', '/images/logo.png']) {
    assert.equal(resolveMediaUrl(`  ${source}  `), source)
  }
})

test('relative media paths use the API origin and preserve invalid sources', () => {
  const previousWindow = globalThis.window
  try {
    Object.assign(globalThis, { window: { __APP_CONFIG__: { API_URL: 'https://api.example.com/api/' } } })
    assert.equal(resolveMediaUrl('media/logo.png'), 'https://api.example.com/api/media/logo.png')
    assert.equal(resolveMediaUrl('/media/logo.png'), 'https://api.example.com/media/logo.png')
    Object.assign(globalThis, { window: { __APP_CONFIG__: { API_URL: 'invalid-base' } } })
    assert.equal(resolveMediaUrl('media/logo.png'), 'media/logo.png')
  } finally {
    if (previousWindow === undefined) {
      Reflect.deleteProperty(globalThis, 'window')
    } else {
      globalThis.window = previousWindow
    }
  }
})

test('mouse hover opens and leaves the card; touch requires explicit expansion', () => {
  const card = useCardReveal()
  card.onPointerEnter({ pointerType: 'touch' } as PointerEvent)
  assert.equal(card.isRevealed.value, false)
  card.onPointerEnter({ pointerType: 'mouse' } as PointerEvent)
  assert.equal(card.isRevealed.value, true)
  card.onPointerLeave()
  assert.equal(card.isRevealed.value, false)
  card.toggleReveal()
  card.onPointerLeave()
  assert.equal(card.isRevealed.value, true)
  card.toggleReveal()
  assert.equal(card.isRevealed.value, false)
})

test('Escape closes a hovered or pinned card and a fresh hover opens it again', () => {
  const card = useCardReveal()
  card.onPointerEnter({ pointerType: 'mouse' } as PointerEvent)
  card.closeReveal()
  assert.equal(card.isRevealed.value, false)
  card.onPointerLeave()
  card.onPointerEnter({ pointerType: 'mouse' } as PointerEvent)
  assert.equal(card.isRevealed.value, true)
  card.onPointerLeave()
  card.toggleReveal()
  assert.equal(card.isRevealed.value, true)
  card.closeReveal()
  assert.equal(card.isRevealed.value, false)
})
