<template>
  <div class="flex flex-row justify-between">
    <p class="text-gray-500 text-xs md:text-sm">{{ total }} {{ label }} encontrado(s)</p>
    <p class="text-gray-500 text-xs md:text-sm">mostrando {{ start }}-{{ end }} de {{ total }}</p>
  </div>
</template>

<script setup lang="ts">
  withDefaults(defineProps<{
    total: number
    start: number
    end: number
    label?: string
  }>(), { label: 'hackathons' })
</script>
