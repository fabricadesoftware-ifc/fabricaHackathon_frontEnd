import assert from 'node:assert/strict'
import { test } from 'node:test'
import { navigationLoading, startNavigationLoading } from '../../src/composables/useNavigationLoading.ts'

test('quick loads stay hidden and slow overlapping loads remain visible until all finish', async () => {
  const quick = startNavigationLoading()
  quick()
  await new Promise(resolve => setTimeout(resolve, 140))
  assert.equal(navigationLoading.value, false)

  const first = startNavigationLoading()
  await new Promise(resolve => setTimeout(resolve, 140))
  assert.equal(navigationLoading.value, true)

  const second = startNavigationLoading()
  first()
  assert.equal(navigationLoading.value, true)

  second()
  assert.equal(navigationLoading.value, false)
})
