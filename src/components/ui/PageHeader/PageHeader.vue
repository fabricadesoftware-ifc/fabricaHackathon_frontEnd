<template>
  <div class="flex flex-col gap-1 my-[1rem]">
    <h1 class="text-gray-900 md:text-2xl">{{ title }}</h1>
    <p class="text-gray-600 md:text-base">{{ subtitle }}</p>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    title: string
    subtitle: string
  }>()
</script>
