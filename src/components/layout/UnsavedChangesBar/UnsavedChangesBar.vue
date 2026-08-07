<template>
  <Teleport to="body">
    <Transition name="unsaved-changes-bar-fade">
      <div
        v-if="isVisible"
        class="fixed inset-x-0 z-50 mx-auto flex w-[92%] max-w-[70vw] flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm sm:gap-5 sm:px-6 sm:py-4"
        style="bottom: calc(1rem + env(safe-area-inset-bottom))"
      >
        <div class="flex items-center gap-3">
          <span
            class="mdi mdi-alert flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[1.6rem] text-gray-500"
          />

          <div class="flex flex-col">
            <span class="text-[1.4rem] font-medium text-black">
              {{ title }}
            </span>
            <span class="text-[1.1rem] leading-snug text-gray-500">
              {{ description }}
            </span>
          </div>
        </div>

        <div class="flex w-full shrink-0 items-center justify-end gap-3 sm:w-auto">
          <AppButton
            variant="text"
            :label="cancelLabel"
            @click="onCancel"
          />

          <AppButton
            variant="primary"
            :label="saveLabel"
            @click="onSave"
          />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import AppButton from '@/components/ui/AppButton/AppButton.vue' 

  interface Props {

    visible?: boolean
    hasChanges?: boolean
    title?: string
    description?: string
    cancelLabel?: string
    saveLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    visible: undefined,
    hasChanges: undefined,
    title: 'Você possui alterações não salvas',
    description: 'Salve suas alterações para manter as alterações atualizadas',
    cancelLabel: 'Cancelar',
    saveLabel: 'Salvar alterações',
  })

  const emit = defineEmits<{
    (e: 'cancel'): void
    (e: 'save'): void
  }>()

  const isVisible = computed(() => props.visible ?? props.hasChanges ?? false)

  function onCancel() {
    emit('cancel')
  }

  function onSave() {
    emit('save')
  }
</script>

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