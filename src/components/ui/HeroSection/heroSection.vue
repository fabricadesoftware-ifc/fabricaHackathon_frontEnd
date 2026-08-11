<script setup lang="ts">
import { ref } from 'vue';
import heroTitle from '../HeroTitle/heroTitle.vue';
import searchBar from '../SearchBar/searchBar.vue';
const value = ref('');

defineProps<{
  title: string
  subtitle: string
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
  <div class="min-h-40 grid grid-cols-1 justify-items-center text-black py-10 min-w-full">
    <heroTitle
      :title="title"
      :subtitle="subtitle"
    />

    <searchBar
      :model-value="modelValue"
      @update:model-value="emit('update:modelValue', $event)"
    />
  </div>
</template>

<style scoped>

</style>