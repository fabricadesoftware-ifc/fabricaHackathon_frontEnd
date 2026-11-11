<script setup lang="ts">
  import { computed } from 'vue'

  type Status = 'ativo' | 'finalizado'

  const props = defineProps<{
    status: Status
    label: string
    variant?: 'default' | 'card'
  }>()

  const projectStatus = computed(() => {
    if (props.variant === 'card') {
      return 'inline-flex items-center gap-[.45rem] rounded-[999px] bg-[transparent] px-2 py-1 text-[.6875rem] font-medium leading-[1.4] whitespace-nowrap text-app-ink-heading'
    }

    const base
      = 'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold whitespace-nowrap'

    const variants: Record<Status, string> = {
      ativo: 'bg-app-positive-surface-50 text-app-positive-text-700 border-app-positive-border-100',
      finalizado: 'bg-app-surface-muted text-app-text-secondary border-app-border-default',
    }

    return `${base} ${variants[props.status]}`
  })

  const dotColor = computed(() => {
    if (props.variant === 'card') {
      return props.status === 'finalizado' ? 'bg-app-ink-subtle-surface' : 'bg-app-brand-action'
    }
    return props.status === 'finalizado' ? 'bg-app-surface-step-strong' : 'bg-app-positive-surface-500'
  })

</script>

<template>
  <span :class="projectStatus">
    <span
      aria-hidden="true"
      class="rounded-full"
      :class="[dotColor, props.variant === 'card' ? 'size-[7px] shrink-0' : 'size-1.5']"
    />

    {{ label }}
  </span>
</template>
