<template>
  <div class="flex items-center justify-between gap-4 py-2">
    <p class="text-sm text-slate-600">{{ props.label }}</p>
    <p class="text-3xl font-semibold tabular-nums text-blue-600">{{ formattedScore }}</p>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  const props = withDefaults(defineProps<{
    label?: string
    score: number
  }>(), {
    label: 'Nota final (média)',
  })

  const formattedScore = computed(() => props.score.toFixed(1).replace('.', ','))
</script>
