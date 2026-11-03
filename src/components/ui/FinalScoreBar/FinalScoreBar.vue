<template>
  <div class="flex items-center justify-between gap-4 border-y border-slate-200 py-4">
    <p class="text-sm text-slate-600">{{ props.label }}</p>
    <p class="text-2xl font-semibold tabular-nums text-blue-600">{{ formattedScore }}</p>
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

  const formattedScore = computed(() => props.score.toFixed(1))
</script>
