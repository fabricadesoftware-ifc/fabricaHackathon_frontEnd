<script setup lang="ts">
  import { computed } from 'vue'

  const props = withDefaults(defineProps<{
    visible?: boolean
    hasChanges?: boolean
    saving?: boolean
    title?: string
    description?: string
    cancelLabel?: string
    saveLabel?: string
  }>(), {
    visible: undefined,
    hasChanges: undefined,
    saving: false,
    title: 'Alterações não salvas',
    description: 'Salve ou descarte as mudanças no perfil.',
    cancelLabel: 'Cancelar',
    saveLabel: 'Salvar alterações',
  })

  const emit = defineEmits<{
    (e: 'cancel' | 'save'): void
  }>()

  const isVisible = computed(() => props.visible ?? props.hasChanges ?? false)
</script>

<template>
  <Teleport to="body">
    <Transition name="unsaved-changes-bar-fade">
      <div
        v-if="isVisible"
        class="fixed inset-x-4 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-50 mx-auto flex max-w-[960px] flex-col gap-3 rounded-lg border border-app-border-default bg-app-surface p-4 shadow-lg sm:flex-row sm:items-center sm:justify-between md:bottom-4"
      >
        <div class="flex min-w-0 items-start gap-3">
          <span aria-hidden="true" class="mdi mdi-content-save-outline mt-0.5 text-xl text-app-link" />

          <div>
            <p class="text-sm font-medium text-app-text-body-strong" role="status">{{ title }}</p>
            <p class="text-xs text-app-text-muted">{{ description }}</p>
          </div>
        </div>

        <div class="flex shrink-0 items-center justify-end gap-2">
          <button
            class="min-h-10 rounded-lg px-3.5 text-sm font-medium text-app-text-secondary hover:bg-app-surface-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-focus disabled:opacity-50"
            :disabled="saving"
            type="button"
            @click="emit('cancel')"
          >
            {{ cancelLabel }}
          </button>

          <button
            :aria-busy="saving"
            class="min-h-10 rounded-lg bg-app-brand-action px-3.5 text-sm font-medium text-app-on-brand hover:bg-app-action-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-focus disabled:opacity-50"
            :disabled="saving"
            type="button"
            @click="emit('save')"
          >
            {{ saving ? 'Salvando...' : saveLabel }}
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.unsaved-changes-bar-fade-enter-active,
.unsaved-changes-bar-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.unsaved-changes-bar-fade-enter-from,
.unsaved-changes-bar-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
