<script setup lang="ts">
import { computed } from 'vue'

type Status = 'ativo' | 'finalizado'

const props = defineProps<{
  status: Status
  label: string
}>()

const projectStatus = computed(() => {
  const base =
    'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold whitespace-nowrap'

  const variants: Record<Status, string> = {
    ativo: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    finalizado: 'bg-slate-100 text-slate-600 border-slate-200',
  }

  return `${base} ${variants[props.status]}`
})

const dotColor = computed(() =>
  props.status === 'finalizado'
    ? 'bg-slate-500'
    : 'bg-emerald-500',
)
</script>

<template>
  <span :class="projectStatus">
    <span
      class="h-1.5 w-1.5 rounded-full"
      :class="dotColor"
      aria-hidden="true"
    />

    {{ label }}
  </span>
</template>