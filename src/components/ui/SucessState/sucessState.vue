<script setup lang="ts">
  import { onMounted, useTemplateRef } from 'vue'
  import AppButton from '../AppButton/AppButton.vue'

  const props = defineProps<{
    title: string
    description: string
    buttonLabel: string
    fullscreen?: boolean
    projectName?: string
    editionName?: string
    secondaryButtonLabel?: string
  }>()

  const emits = defineEmits<{
    (e: 'click' | 'secondary-click'): void
  }>()
  const completionTitle = useTemplateRef<HTMLHeadingElement>('completionTitle')

  onMounted(() => {
    if (props.fullscreen) completionTitle.value?.focus()
  })
</script>

<template>
  <section v-if="fullscreen" aria-labelledby="completion-title" class="success-completion flex min-h-svh w-full min-w-0 items-center justify-center bg-app-surface-subtle">
    <div class="success-content flex w-full max-w-xl flex-col items-center px-6 py-12 text-center sm:px-8">
      <div aria-hidden="true" class="mb-6 flex size-16 items-center justify-center rounded-full border border-app-brand-border-100 bg-app-selection-soft text-app-link">
        <span class="mdi mdi-check text-4xl" />
      </div>

      <h1 id="completion-title" ref="completionTitle" class="text-2xl font-semibold leading-tight text-app-text-body-strong outline-none sm:text-3xl" tabindex="-1">{{ title }}</h1>
      <p class="mt-4 text-base leading-7 text-app-text-secondary">{{ description }}</p>
      <p v-if="projectName" class="mt-2 w-full break-words text-lg font-semibold leading-7 text-app-text-body-strong">{{ projectName }}</p>

      <p v-if="editionName" class="mt-3 flex max-w-full items-start justify-center gap-2 text-sm leading-6 text-app-text-muted">
        <span aria-hidden="true" class="mdi mdi-calendar-outline shrink-0" />
        <span class="min-w-0 break-words">{{ editionName }}</span>
      </p>

      <div class="success-actions mt-8 flex w-full flex-col items-stretch gap-3 sm:w-auto">
        <AppButton :label="buttonLabel" variant="primary" @click="emits('click')" />

        <AppButton
          v-if="secondaryButtonLabel"
          class="success-secondary"
          :label="secondaryButtonLabel"
          variant="text"
          @click="emits('secondary-click')"
        />
      </div>
    </div>
  </section>

  <div v-else class="px-3 py-2 flex flex-col items-center">

    <!-- Ícone -->
    <div class="flex justify-center items-center mb-4">
      <span
        class="w-12 h-12 text-[1.6rem] bg-app-action-indicator rounded-full text-app-on-brand flex justify-center items-center mdi mdi-check"
      />
    </div>

    <!-- Título -->
    <h1 class="text-[1.5rem] mb-2 text-app-text-strong-neutral text-center">
      {{ props.title }}
    </h1>

    <!-- Descrição -->
    <p class="text-[1.1rem] leading-[1.3rem] max-w-[400px] text-app-text-muted-neutral text-center mb-4">
      {{ props.description }}
    </p>

    <!-- Botão -->
    <AppButton
      :label="buttonLabel"
      variant="primary"
      @click="emits('click')"
    />
  </div>
</template>
<style scoped>
.success-content {
  animation: completion-enter 240ms ease-out;
}

.success-actions :deep(.app-btn) {
  min-height: 44px;
  padding: 0.75rem 1.25rem;
  font-size: 0.875rem;
  box-shadow: none;
}

.success-actions :deep(.success-secondary) {
  background: transparent !important;
  color: var(--app-ink-secondary) !important;
}

.success-actions :deep(.success-secondary:hover) {
  background: var(--app-line) !important;
}

.success-completion :deep(button:focus-visible) {
  outline: 2px solid var(--app-brand-accent);
  outline-offset: 3px;
}

@keyframes completion-enter {
  from { opacity: 0.85; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .success-content { animation: none; }
}
</style>
