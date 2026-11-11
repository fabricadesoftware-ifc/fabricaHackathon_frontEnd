<template>
  <div class="flex flex-row justify-between">
    <p class="text-app-text-muted-neutral text-xs md:text-sm">{{ total }} {{ label }} encontrado(s)</p>
    <p class="text-app-text-muted-neutral text-xs md:text-sm">mostrando {{ start }}-{{ end }} de {{ total }}</p>
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
