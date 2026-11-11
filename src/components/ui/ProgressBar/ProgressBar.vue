<template>
  <div>
    <div v-if="props.heading" class="mb-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-xs leading-5">
      <span class="text-app-text-secondary">{{ props.heading }}</span>
      <span class="font-medium tabular-nums text-app-text-body-strong">{{ props.current }} de {{ props.total }}<span class="sr-only"> {{ props.label }}</span></span>
    </div>

    <div
      :aria-label="props.heading || props.label"
      aria-valuemax="100"
      aria-valuemin="0"
      :aria-valuenow="porcentagem"
      class="flex w-full rounded-full overflow-hidden"
      :class="props.heading ? 'h-1.5 bg-app-surface-muted' : 'h-2 bg-app-surface-skeleton-neutral'"
      role="progressbar"
    >
      <div
        class="flex flex-col justify-center rounded-full overflow-hidden text-xs text-app-on-brand text-center whitespace-nowrap transition-all duration-700 "
        :class="props.heading ? 'bg-app-action' : 'bg-primary'"
        :style="{ width: `${porcentagem}%` }"
      />
    </div>

    <div v-if="!props.heading" class="mt-2 flex justify-between items-center">
      <h3 class="text-sm font-normal text-app-ink-secondary-neutral">
        {{ props.current }}/{{ props.total }} {{ props.label }}
      </h3>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  const props = defineProps<{
    current: number
    total: number
    label: string
    heading?: string
  }>()

  const porcentagem = computed(() => {
    if (props.total <= 0) return 0

    const calculo = (props.current / props.total) * 100

    return Math.min(Math.max(calculo, 0), 100)
  })
</script>
