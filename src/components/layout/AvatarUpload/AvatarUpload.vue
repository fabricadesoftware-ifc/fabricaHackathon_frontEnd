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

  function openFileInput () {
    fileInput.value?.click()
  }

  function handleFileChange (event: Event) {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return
    emit('update:file', file)
    input.value = ''
  }
</script>

<template>
  <div class="grid w-full grid-cols-[88px_minmax(0,1fr)] items-center gap-x-4 gap-y-2 lg:flex lg:flex-wrap lg:gap-4">
    <div class="row-span-2 flex h-[88px] w-[88px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-app-border-default bg-app-surface-muted">
      <img v-if="src" alt="Foto de perfil" class="h-full w-full object-cover" :src="src">
      <span v-else aria-label="Sem foto de perfil" class="mdi mdi-account text-4xl text-app-text-placeholder" role="img" />
    </div>

    <div class="min-w-0 flex-1">
      <slot />
    </div>

    <button
      class="inline-flex min-h-10 items-center justify-self-start gap-2 rounded-lg border border-app-border-default px-3.5 text-sm font-medium text-app-text-secondary transition-colors hover:border-app-brand-border-300 hover:text-app-link-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-focus disabled:cursor-not-allowed disabled:opacity-50"
      :disabled="disabled"
      type="button"
      @click="openFileInput"
    >
      <span aria-hidden="true" class="mdi mdi-camera-outline text-base" />
      Alterar foto
    </button>

    <input
      ref="fileInput"
      accept="image/*"
      class="hidden"
      :disabled="disabled"
      type="file"
      @change="handleFileChange"
    >
  </div>
</template>
