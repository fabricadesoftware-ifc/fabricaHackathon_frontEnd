<script setup lang="ts">
import AppButton from '../AppButton/AppButton.vue'

const props = defineProps<{
  title: string
  description: string
  buttonLabel: string
}>()

const emits = defineEmits<{
  (e: 'click'): void
}>()
</script>

<template>
  <div class="px-3 py-2 flex flex-col items-center">

    <!-- Ícone -->
    <div class="flex justify-center items-center mb-4">
      <span
        class="w-12 h-12 text-[1.6rem] bg-blue-500 rounded-full text-white flex justify-center items-center mdi mdi-check"
      ></span>
    </div>

    <!-- Título -->
    <h1 class="text-[1.5rem] mb-2 text-gray-900 text-center">
      {{ props.title }}
    </h1>

    <!-- Descrição -->
    <p class="text-[1.1rem] leading-[1.3rem] max-w-[400px] text-gray-500 text-center mb-4">
      {{ props.description }}
    </p>

    <!-- Botão -->
    <AppButton
      variant="primary"
      :label="buttonLabel"
      @click="emits('click')"
    />
  </div>
</template>