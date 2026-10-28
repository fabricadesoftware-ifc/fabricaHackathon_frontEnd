<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  src?: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:file', file: File): void
}>()

const fileInput = ref<HTMLInputElement | null>(null)

function openFileInput() {
  fileInput.value?.click()
}

function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  emit('update:file', file)
  input.value = ''
}
</script>

<template>
  <div class="grid w-full grid-cols-[88px_minmax(0,1fr)] items-center gap-x-4 gap-y-2 lg:flex lg:flex-wrap lg:gap-4">
    <div class="row-span-2 flex h-[88px] w-[88px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100">
      <img v-if="src" :src="src" alt="Foto de perfil" class="h-full w-full object-cover">
      <span v-else class="mdi mdi-account text-4xl text-slate-400" role="img" aria-label="Sem foto de perfil" />
    </div>

    <div class="min-w-0 flex-1">
      <slot />
    </div>

    <button
      type="button"
      class="inline-flex min-h-10 items-center justify-self-start gap-2 rounded-lg border border-slate-200 px-3.5 text-sm font-medium text-slate-600 transition-colors hover:border-blue-300 hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
      :disabled="disabled"
      @click="openFileInput"
    >
      <span class="mdi mdi-camera-outline text-base" aria-hidden="true" />
      Alterar foto
    </button>

    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      :disabled="disabled"
      @change="handleFileChange"
    >
  </div>
</template>
