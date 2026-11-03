<script setup lang="ts">
  import { computed } from 'vue'

  const props = withDefaults(
    defineProps<{
      modelValue?: number | null
      disabled?: boolean
      min?: number
      max?: number
      step?: number
    }>(),
    {
      modelValue: 0,
      min: 0,
      max: 10,
      step: 0.5,
    },
  )

  const emit = defineEmits<{
    (e: 'update:modelValue', value: number): void
  }>()

  const value = computed(() => props.modelValue ?? props.min)

  const canIncrement = computed(() => !props.disabled && value.value < props.max)
  const canDecrement = computed(() => !props.disabled && (props.modelValue === null || value.value > props.min))

  const buttonDesign
    = 'flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30'

  function incrementar () {
    if (!canIncrement.value) return

    const newValue = Math.min(value.value + props.step, props.max)
    emit('update:modelValue', newValue)
  }

  function decrementar () {
    if (!canDecrement.value) return

    const newValue = Math.max(value.value - props.step, props.min)
    emit('update:modelValue', newValue)
  }
</script>

<template>
  <div class="inline-flex shrink-0 items-center gap-1 self-start rounded-lg bg-slate-50 p-1" role="group">
    <button
      aria-label="Diminuir nota"
      :class="buttonDesign"
      :disabled="!canDecrement"
      type="button"
      @click="decrementar"
    >
      <span class="mdi mdi-minus" />
    </button>

    <button
      :aria-label="modelValue === null ? 'Definir nota zero' : `Nota ${value.toFixed(1)}`"
      class="min-h-11 min-w-14 rounded-md text-center text-lg font-semibold text-blue-600 tabular-nums focus-visible:outline-2 focus-visible:outline-blue-600"
      :disabled="disabled"
      type="button"
      @click="modelValue === null && emit('update:modelValue', min)"
    >
      {{ modelValue === null ? '—' : value.toFixed(1) }}
    </button>

    <button
      aria-label="Aumentar nota"
      :class="buttonDesign"
      :disabled="!canIncrement"
      type="button"
      @click="incrementar"
    >
      <span class="mdi mdi-plus" />
    </button>
  </div>
</template>
