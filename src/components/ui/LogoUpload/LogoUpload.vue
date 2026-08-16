<template>
  <div class="flex items-start gap-4">
    <div
      class="bg-[#F9FAFB] flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-[#E5E7EB]"
    >
      <img
        v-if="previewUrl"
        alt="Sem logo"
        class="h-full w-full flex items-center justify-center object-contain text-[15px] text-[#9CA3AF]"
        :src="previewUrl"
      >
    </div>

    <div class="">
      <input
        ref="fileInput"
        :accept="acceptedFormats.join(',')"
        class="hidden"
        type="file"
        @change="handleFile"
      >

      <AppButton
        class="mdi mdi-upload-outline flex gap-1 px-6 py-5"
        label="Enviar logo"
        variant="primary"
        @click="fileInput?.click()"
      />

      <div class="flex flex-col">
        <span class="text-[15px] text-[#4B5563]">
          PNG ou JPG · quadrado · até {{ maxSizeMb }}MB
        </span>

        <span
          v-if="errorMessage && aviso"
          class="text-[15px] text-red-500"
        >
          {{ errorMessage }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onUnmounted, ref } from 'vue'

  import AppButton from '../AppButton'

  const props = withDefaults(
    defineProps<{
      modelValue: File | string | null
      maxSizeMb?: number
      acceptedFormats?: string[]
    }>(),
    {
      maxSizeMb: 2,
      acceptedFormats: () => ['image/png', 'image/jpeg'],
    },
  )

  const emit = defineEmits<{
    'update:modelValue': [value: File | null]
    'error': [message: string]
  }>()

  const fileInput = ref<HTMLInputElement | null>(null)
  const previewUrl = ref<string | null>(
    typeof props.modelValue === 'string'
      ? props.modelValue
      : null,
  )

  const errorMessage = ref<string | null>(null)

  function handleFile (event: Event) {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]

    if (!file) return

    errorMessage.value = null

    if (!props.acceptedFormats.includes(file.type)) {
      showError('Formato de arquivo não aceito.')
      emit('error', errorMessage.value!)
      return
    }
    const maxSize = props.maxSizeMb * 1024 * 1024

    if (file.size > maxSize) {
      const message = `O arquivo deve ter no máximo ${props.maxSizeMb}MB.`

      showError(message)
      emit('error', message)
      return
    }

    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
    }

    previewUrl.value = URL.createObjectURL(file)

    emit('update:modelValue', file)
  }
  const aviso = ref(false)

  function showError (message: string) {
    errorMessage.value = message
    aviso.value = true

    setTimeout(() => {
      aviso.value = false
    }, 2000)
  }

  onUnmounted(() => {
    if (previewUrl.value?.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl.value)
    }
  })
</script>
