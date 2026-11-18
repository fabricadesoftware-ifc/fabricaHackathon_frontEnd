import { readonly, ref } from 'vue'

const pending = new Set<symbol>()
const visible = ref(false)
let revealTimer: ReturnType<typeof setTimeout> | undefined

export const navigationLoading = readonly(visible)

export function startNavigationLoading (): () => void {
  const id = Symbol('loading')
  pending.add(id)

  if (!visible.value && !revealTimer) {
    revealTimer = setTimeout(() => {
      revealTimer = undefined
      visible.value = pending.size > 0
    }, 120)
  }

  return () => {
    pending.delete(id)
    if (pending.size === 0) {
      clearTimeout(revealTimer)
      revealTimer = undefined
      visible.value = false
    }
  }
}
