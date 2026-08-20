<template>
  <div class="flex items-center justify-between bg-blue-300/60 px-4 py-3 rounded-sm">
    <p class="text-sm text-blue-600">{{ props.label }}</p>
    <p class="text-xl font-bold text-blue-600">{{ formattedScore }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  label?: string
  score: number
}>(), {
  label: 'Nota final(média)',
})

const formattedScore = computed(() => props.score.toFixed(1))
</script>