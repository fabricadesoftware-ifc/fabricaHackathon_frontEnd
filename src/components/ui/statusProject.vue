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
      return 'inline-flex items-center gap-[.45rem] rounded-[999px] bg-[transparent] px-2 py-1 text-[.6875rem] font-medium leading-[1.4] whitespace-nowrap text-[#334155]'
    }

    const base
      = 'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold whitespace-nowrap'

    const variants: Record<Status, string> = {
      ativo: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      finalizado: 'bg-slate-100 text-slate-600 border-slate-200',
    }

    return `${base} ${variants[props.status]}`
  })

  const dotColor = computed(() => {
    if (props.variant === 'card') {
      return props.status === 'finalizado' ? 'bg-[#94a3b8]' : 'bg-[#2563eb]'
    }
    return props.status === 'finalizado' ? 'bg-slate-500' : 'bg-emerald-500'
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
