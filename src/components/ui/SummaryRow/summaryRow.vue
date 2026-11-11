<script setup lang="ts">
  import { computed } from 'vue'

  const props = defineProps<{
    label: string
    values: string | string[]
  }>()
  const values = computed(() => {
    return Array.isArray(props.values) ? props.values : [props.values]
  })
</script>

<template>
  <div class="flex min-w-full flex-col gap-1 border-b border-app-line-neutral px-0 py-3 sm:flex-row sm:justify-between sm:gap-4">
    <span class="text-app-text-muted-neutral">
      {{ props.label }}
    </span>

    <div class="flex min-w-0 flex-wrap gap-x-3 gap-y-0.5 text-app-text-strong-neutral sm:justify-end sm:text-right">
      <span v-for="(valor, index) in values" :key="index" class="break-all">
        {{ valor }}
      </span>
    </div>
  </div>
</template>
