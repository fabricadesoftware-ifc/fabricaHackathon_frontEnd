<template>
  <section class="min-w-0 rounded-lg border border-app-border-default bg-app-surface p-4 sm:p-5">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="min-w-0 flex-1">
        <h3 :id="`${fieldId}-title`" class="break-words text-base font-semibold text-app-text-body-strong">{{ criteriaName }}</h3>
        <p class="mt-1 text-xs text-app-text-muted">{{ modelValue === null ? 'Aguardando nota' : 'Nota preenchida' }} · de {{ min }} a {{ max }}</p>
      </div>

      <NumberStepper
        :aria-labelledby="`${fieldId}-title`"
        :disabled="disabled"
        :label="`Nota de ${criteriaName}`"
        :max="max"
        :min="min"
        :model-value="modelValue"
        :step="step"
        @update:model-value="updateScore"
      />
    </div>

    <button
      :aria-controls="`${fieldId}-comment`"
      :aria-expanded="isCommentVisible"
      class="mt-2 inline-flex min-h-9 items-center gap-1.5 text-sm text-app-link hover:underline disabled:opacity-50"
      :disabled="disabled"
      type="button"
      @click="toggleComment"
    >
      <span aria-hidden="true" class="mdi mdi-comment-text-outline" />
      {{ isCommentVisible ? 'Ocultar comentário' : 'Adicionar comentário' }}
      <span class="text-xs text-app-text-muted">(opcional)</span>
    </button>

    <div v-if="isCommentVisible" :id="`${fieldId}-comment`" class="mt-3">
      <label class="mb-2 block text-sm text-app-text-secondary" :for="`${fieldId}-input`">Comentário sobre {{ criteriaName }}</label>

      <textarea
        :id="`${fieldId}-input`"
        class="w-full resize-y rounded-lg border border-app-border-default bg-app-surface p-3 text-sm text-app-text-body-strong focus:border-app-brand-border-600 focus:outline-none focus:ring-2 focus:ring-app-focus-halo"
        :disabled="disabled"
        placeholder="Inclua uma observação sobre este critério"
        rows="3"
        :value="comment"
        @input="updateComment"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
  import { ref, useId } from 'vue'
  import NumberStepper from '../NumberStepper/NumberStepper.vue'

  withDefaults(defineProps<{
    criteriaName: string
    modelValue: number | null
    disabled?: boolean
    comment?: string
    min?: number
    max?: number
    step?: number
  }>(), {
    comment: '',
    min: 0,
    max: 10,
    step: 0.5,
  })

  const emit = defineEmits<{
    (e: 'update:modelValue', value: number | null): void
    (e: 'update:comment', value: string): void
  }>()

  const fieldId = useId()
  const isCommentVisible = ref(false)

  function toggleComment () {
    isCommentVisible.value = !isCommentVisible.value
  }

  function updateScore (newValue: number | null) {
    emit('update:modelValue', newValue)
  }

  function updateComment (event: Event) {
    const target = event.target as HTMLTextAreaElement
    emit('update:comment', target.value)
  }
</script>
