<script setup lang="ts">
  withDefaults(defineProps<{ lines?: number }>(), { lines: 3 })
</script>

<template>
  <div aria-label="Carregando" class="flex flex-col gap-3 animate-pulse" role="status">
    <div v-for="n in lines" :key="n" class="h-5 rounded-lg bg-gray-200" :class="n === lines ? 'w-2/3' : 'w-full'" />
  </div>
</template>
