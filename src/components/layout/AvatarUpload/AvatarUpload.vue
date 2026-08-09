<template>
  <div class="inline-flex flex-col items-center gap-6">
    <div class="relative h-[168px] w-[168px] shrink-0">
      <img
        v-if="preview"
        alt="Foto de perfil"
        class="h-[168px] w-[168px] rounded-full object-cover block"
        :src="preview"
      >

      <div
        v-else
        class="flex h-[168px] w-[168px] items-center justify-center rounded-full bg-gray-200"
      >
        <span class="mdi mdi-account text-[80px] text-gray-500" />
      </div>

      <button
        class="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-md"
        type="button"
        @click="openFileInput"
      >
        <span class="mdi mdi-camera-outline text-[20px]" />
      </button>
    </div>

    <input
      ref="fileInput"
      accept="image/*"
      class="hidden"
      type="file"
      @change="handleFileChange"
    >

    <button
      class="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border-[0.1px] border-solid border-[#b7beca] bg-[#F3F4F6] px-4 py-1.5 text-[15px] text-[#111827]"
      type="button"
      @click="openFileInput"
    >
      <span class="mdi mdi-pencil-outline text-[19px] text-[#111827]" />
      <span>Editar foto</span>
    </button>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'

  const props = defineProps<{
    src?: string
  }>()

  const emit = defineEmits<{
    (e: 'update:file', file: File): void
  }>()

  const fileInput = ref<HTMLInputElement | null>(null)
  const selectedFile = ref<File | null>(null)

  const preview = computed(() => {
    if (selectedFile.value) {
      return URL.createObjectURL(selectedFile.value)
    }

    return props.src
  })

  function openFileInput () {
    fileInput.value?.click()
  }

  function handleFileChange (event: Event) {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]

    if (!file) return

    selectedFile.value = file

    emit('update:file', file)
  }
</script>