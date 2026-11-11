<script setup lang="ts">
  withDefaults(defineProps<{ count?: number }>(), { count: 4 })
</script>

<template>
  <div
    aria-label="Carregando"
    class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    role="status"
  >
    <div
      v-for="n in count"
      :key="n"
      class="flex animate-pulse flex-col gap-3 rounded-md bg-app-surface p-3 shadow-md"
    >
      <div class="h-28 w-full rounded-md bg-app-surface-skeleton-neutral" />
      <div class="h-4 w-3/4 rounded bg-app-surface-skeleton-neutral" />
      <div class="h-3 w-1/2 rounded bg-app-surface-skeleton-neutral" />

      <div class="flex gap-2">
        <div class="h-5 w-16 rounded-full bg-app-surface-skeleton-neutral" />
        <div class="h-5 w-12 rounded-full bg-app-surface-skeleton-neutral" />
      </div>
    </div>
  </div>
</template>
