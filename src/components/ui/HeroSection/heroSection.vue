<script setup lang="ts">
import searchBar from '../SearchBar/searchBar.vue'

defineProps<{
  /** Parte inicial do título, em texto normal. */
  title: string
  /** Trecho em destaque (azul animado). */
  highlight?: string
  subtitle: string
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
  <div class="flex min-w-full flex-col items-center gap-4 py-6 text-center md:py-8">
    <h1 class="text-[1.75rem] font-semibold leading-tight text-gray-900 sm:text-4xl">
      {{ title }}
      <span v-if="highlight" class="hero-highlight">{{ highlight }}</span>
    </h1>
    <p class="max-w-2xl text-base text-[#565F6D] sm:text-lg">
      {{ subtitle }}
    </p>

    <searchBar
      class="w-full max-w-xl"
      placeholder="Buscar projetos ou equipes..."
      :model-value="modelValue"
      @update:model-value="emit('update:modelValue', $event)"
    />
  </div>
</template>

<style scoped>
.hero-highlight {
  background-image: linear-gradient(90deg, #1d4ed8, #3b82f6, #06b6d4, #3b82f6, #1d4ed8);
  background-size: 200% 100%;
  background-position: 0% 50%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  white-space: nowrap;
  animation: hero-shimmer 4s ease-in-out infinite alternate;
}

@keyframes hero-shimmer {
  from { background-position: 0% 50%; }
  to { background-position: 100% 50%; }
}

@media (prefers-reduced-motion: reduce) {
  .hero-highlight { animation: none; background-position: 0 0; }
}
</style>
