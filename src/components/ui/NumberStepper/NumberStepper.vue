<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: number
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

const value = computed(() => props.modelValue)

const canIncrement = computed(() => value.value < props.max)
const canDecrement = computed(() => value.value > props.min)

const buttonDesign =
  'flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white text-sm text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30'

function incrementar() {
  if (!canIncrement.value) return

  const newValue = Math.min(value.value + props.step, props.max)
  emit('update:modelValue', newValue)
}

function decrementar() {
  if (!canDecrement.value) return

  const newValue = Math.max(value.value - props.step, props.min)
  emit('update:modelValue', newValue)
}
</script>

<template>
  <div class="inline-flex shrink-0 items-center gap-2">
    <button
      type="button"
      :class="buttonDesign"
      :disabled="!canDecrement"
      aria-label="Diminuir nota"
      @click="decrementar"
    >
      <span class="mdi mdi-minus" />
    </button>

    <span
      class="min-w-10 text-center text-lg font-semibold text-blue-600 tabular-nums"
    >
      {{ value.toFixed(1) }}
    </span>

    <button
      type="button"
      :class="buttonDesign"
      :disabled="!canIncrement"
      aria-label="Aumentar nota"
      @click="incrementar"
    >
      <span class="mdi mdi-plus" />
    </button>
  </div>
</template>