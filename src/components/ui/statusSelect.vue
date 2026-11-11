<script setup lang="ts">
  import { computed } from 'vue'

  type Status = 'inscricoes' | 'avaliacao' | 'andamento' | 'finalizado'

  const props = defineProps<{
    status: Status
    label: string
    variant?: 'default' | 'card' | 'evaluation'
  }>()

  const evaluationColors: Record<Status, string> = {
    inscricoes: 'bg-[#f0fdf4] text-[#15803d]',
    avaliacao: 'bg-[#eff6ff] text-[#2563eb]',
    andamento: 'bg-[#eff6ff] text-[#2563eb]',
    finalizado: 'bg-[#f1f5f9] text-[#475569]',
  }
  const cardDots: Record<Status, string> = {
    inscricoes: 'bg-[#15803d]',
    avaliacao: 'bg-[#7c3aed]',
    andamento: 'bg-[#2563eb]',
    finalizado: 'bg-[#64748b]',
  }

  const dotClasses = computed(() => {
    if (props.variant === 'card') return cardDots[props.status]
    return props.variant === 'evaluation' ? 'bg-current text-inherit' : 'bg-white'
  })

  const badgeClasses = computed(() => {
    if (props.variant === 'card') {
      return 'inline-flex w-fit items-center gap-[.45rem] rounded-[5px] bg-[#fff] px-[.65rem] py-[.4rem] text-[.6875rem] font-bold leading-[1.4] text-[#172331]'
    }
    if (props.variant === 'evaluation') {
      return `inline-flex items-center gap-1.5 whitespace-nowrap rounded-[.375rem] px-2 py-[.125rem] text-xs font-medium leading-[1.5] shadow-none ${evaluationColors[props.status]}`
    }

    const base
      = 'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-white whitespace-nowrap shadow-sm'

    const variants: Record<Status, string> = {
      inscricoes: 'bg-[#1DA422]',
      avaliacao: 'bg-[#6238CF]',
      andamento: 'bg-[#1C74FB]',
      finalizado: 'bg-[#161B22]',
    }

    return `${base} ${variants[props.status]}`
  })
</script>

<template>
  <span :class="badgeClasses">
    <!-- Indicador de status -->
    <span
      aria-hidden="true"
      class="size-1.5 shrink-0 rounded-full"
      :class="dotClasses"
    />

    {{ label }}
  </span>
</template>
