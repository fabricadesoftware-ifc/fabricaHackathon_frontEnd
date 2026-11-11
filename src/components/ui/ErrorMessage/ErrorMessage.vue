<script setup lang="ts">
  import AppButton from '../AppButton/AppButton.vue'

  defineProps<{ message: string }>()
  defineEmits<{ (e: 'retry'): void }>()
</script>

<template>
  <div class="flex flex-col items-center gap-3 px-3 py-6 text-center" role="alert">
    <span class="mdi mdi-alert-circle-outline text-[2rem] text-app-danger-text-500" />
    <p class="text-app-text-strong-neutral">{{ message }}</p>
    <AppButton label="Tentar novamente" variant="secondary" @click="$emit('retry')" />
  </div>
</template>
