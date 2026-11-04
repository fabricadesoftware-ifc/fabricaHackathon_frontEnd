<script setup lang="ts">
  import { computed, ref, useId, watch } from 'vue'

  const props = withDefaults(
    defineProps<{
      modelValue?: number | null
      disabled?: boolean
      label?: string
      min?: number
      max?: number
      step?: number
    }>(),
    {
      modelValue: 0,
      label: 'Nota',
      min: 0,
      max: 10,
      step: 0.5,
    },
  )

  const emit = defineEmits<{
    (e: 'update:modelValue', value: number | null): void
  }>()

  const fieldId = useId()
  const draft = ref(props.modelValue === null ? '' : String(props.modelValue))

  const parsedScore = computed(() => {
    const text = draft.value.trim()
    if (!/^(?:\d+(?:[.,]\d*)?|[.,]\d+)$/.test(text)) {
      return null
    }
    const score = Number(text.replace(',', '.'))
    const steps = (score - props.min) / props.step
    return Number.isFinite(score) && score >= props.min && score <= props.max
      && Math.abs(steps - Math.round(steps)) < 1e-8
      ? score
      : null
  })

  const inputError = computed(() => draft.value.trim() !== '' && parsedScore.value === null
    ? `Use uma nota de ${props.min} a ${props.max}, em intervalos de ${String(props.step).replace('.', ',')}.`
    : '')

  watch(() => props.modelValue, score => {
    // Preserve a digitação em andamento e entradas inválidas até a correção.
    if (score !== parsedScore.value) {
      draft.value = score === null ? '' : String(score)
    }
  })

  const value = computed(() => props.modelValue ?? props.min)
  const canIncrement = computed(() => !props.disabled && value.value < props.max)
  const canDecrement = computed(() => !props.disabled && (props.modelValue === null || value.value > props.min))

  function updateInput (event: Event) {
    if (props.disabled) return
    draft.value = (event.target as HTMLInputElement).value
    emit('update:modelValue', parsedScore.value)
  }

  function setScore (score: number) {
    draft.value = String(score)
    emit('update:modelValue', score)
  }

  const buttonDesign
    = 'flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-sm text-slate-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30'

  function incrementar () {
    if (!canIncrement.value) return

    const newValue = Math.min(value.value + props.step, props.max)
    setScore(newValue)
  }

  function decrementar () {
    if (!canDecrement.value) return

    const newValue = Math.max(value.value - props.step, props.min)
    setScore(newValue)
  }
</script>

<template>
  <div class="flex shrink-0 flex-col items-start gap-2 sm:items-end" role="group">
    <div
      class="inline-flex items-center overflow-hidden rounded-lg border bg-white transition-colors focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100"
      :class="inputError ? 'border-red-400' : 'border-slate-200'"
    >
      <button
        aria-label="Diminuir nota"
        :class="buttonDesign"
        :disabled="!canDecrement"
        type="button"
        @click="decrementar"
      >
        <span aria-hidden="true" class="mdi mdi-minus" />
      </button>

      <input
        :id="fieldId"
        :aria-describedby="inputError ? `${fieldId}-error` : undefined"
        :aria-invalid="Boolean(inputError)"
        :aria-label="label"
        :aria-valuemax="max"
        :aria-valuemin="min"
        :aria-valuenow="modelValue ?? undefined"
        autocomplete="off"
        class="h-10 w-14 min-w-0 border-x border-slate-200 bg-slate-50 text-center text-base font-semibold tabular-nums text-slate-700 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="disabled"
        inputmode="decimal"
        placeholder="—"
        role="spinbutton"
        type="text"
        :value="draft"
        @input="updateInput"
        @keydown.down.prevent="decrementar"
        @keydown.up.prevent="incrementar"
      >

      <button
        aria-label="Aumentar nota"
        :class="buttonDesign"
        :disabled="!canIncrement"
        type="button"
        @click="incrementar"
      >
        <span aria-hidden="true" class="mdi mdi-plus" />
      </button>
    </div>

    <p v-if="inputError" :id="`${fieldId}-error`" class="max-w-52 text-xs leading-5 text-red-600 sm:text-right" role="status">{{ inputError }}</p>
  </div>
</template>
