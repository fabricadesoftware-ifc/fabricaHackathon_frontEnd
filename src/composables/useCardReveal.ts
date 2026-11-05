import { computed, ref } from 'vue'

/** Mantém o mesmo painel disponível por ponteiro, teclado e toque. */
export function useCardReveal () {
  const hovering = ref(false)
  const focused = ref(false)
  const pinned = ref(false)
  const dismissed = ref(false)
  const isRevealed = computed(() => !dismissed.value && (hovering.value || focused.value || pinned.value))

  function onPointerEnter (event: PointerEvent) {
    if (event.pointerType !== 'touch') {
      hovering.value = true
      dismissed.value = false
    }
  }

  function onPointerLeave () {
    hovering.value = false
    if (!focused.value) {
      dismissed.value = false
    }
  }

  function onFocusIn (event: FocusEvent) {
    if (event.target instanceof HTMLElement && event.target.matches(':focus-visible')) {
      focused.value = true
      dismissed.value = false
    }
  }

  function onFocusOut (event: FocusEvent) {
    const card = event.currentTarget as HTMLElement
    if (!(event.relatedTarget instanceof Node) || !card.contains(event.relatedTarget)) {
      focused.value = false
      dismissed.value = false
    }
  }

  function toggleReveal () {
    const next = !isRevealed.value
    pinned.value = next
    dismissed.value = !next
  }

  function closeReveal () {
    pinned.value = false
    dismissed.value = true
  }

  return { isRevealed, onPointerEnter, onPointerLeave, onFocusIn, onFocusOut, toggleReveal, closeReveal }
}
