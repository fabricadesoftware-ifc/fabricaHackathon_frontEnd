<template>
  <div class="flex flex-col items-center gap-9">
    <div class="relative">
      <img
        v-if="preview"
        alt="Foto de perfil"
        class="h-42 w-42 rounded-full object-cover"
        :src="preview"
      >

      <div
        v-else
        class="flex h-42 w-42 items-center justify-center rounded-full bg-gray-200"
      >
        <span class="mdi mdi-account text-9xl text-gray-500" />
      </div>

      <button
        class="text-[30px] absolute bottom-0 right-0 flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-md"
        type="button"
        @click="openFileInput"
      >
        <span class="mdi mdi-camera-outline" />
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
      class="bg-[#F3F4F6] text-[15px] rounded-lg border-[0.1px] border-solid border-[#b7beca] text-[#111827] flex gap-2 justify-center items-center px-4 py-px"
      type="button"
      @click="openFileInput"
    >
      <span class="text-[19px] mdi mdi-pencil-outline text-[#111827]" />
      <p>Editar foto</p>
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
