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
  (e: 'cancel'): void
  (e: 'save'): void
}>()

const isVisible = computed(() => props.visible ?? props.hasChanges ?? false)
</script>

<template>
  <Teleport to="body">
    <Transition name="unsaved-changes-bar-fade">
      <div
        v-if="isVisible"
        class="fixed inset-x-4 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-50 mx-auto flex max-w-[960px] flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-lg sm:flex-row sm:items-center sm:justify-between md:bottom-4"
      >
        <div class="flex min-w-0 items-start gap-3">
          <span class="mdi mdi-content-save-outline mt-0.5 text-xl text-blue-600" aria-hidden="true" />
          <div>
            <p class="text-sm font-medium text-slate-700" role="status">{{ title }}</p>
            <p class="text-xs text-slate-500">{{ description }}</p>
          </div>
        </div>

        <div class="flex shrink-0 items-center justify-end gap-2">
          <button
            type="button"
            class="min-h-10 rounded-lg px-3.5 text-sm font-medium text-slate-600 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
            :disabled="saving"
            @click="emit('cancel')"
          >
            {{ cancelLabel }}
          </button>
          <button
            type="button"
            class="min-h-10 rounded-lg bg-[#2563EB] px-3.5 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
            :disabled="saving"
            :aria-busy="saving"
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
