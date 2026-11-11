<script setup lang="ts">
  import { computed } from 'vue'

  type Status = 'inscricoes' | 'avaliacao' | 'andamento' | 'finalizado'

  const props = defineProps<{
    status: Status
    label: string
    variant?: 'default' | 'card' | 'evaluation'
  }>()

  const evaluationColors: Record<Status, string> = {
    inscricoes: 'bg-app-success-surface text-app-success-strong',
    avaliacao: 'bg-app-brand-surface text-app-brand-text',
    andamento: 'bg-app-brand-surface text-app-brand-text',
    finalizado: 'bg-app-surface-soft text-app-ink-secondary',
  }
  const cardDots: Record<Status, string> = {
    inscricoes: 'bg-app-success-strong',
    avaliacao: 'bg-app-evaluation-marker',
    andamento: 'bg-app-brand-action',
    finalizado: 'bg-app-ink-muted-surface',
  }

  const dotClasses = computed(() => {
    if (props.variant === 'card') return cardDots[props.status]
    return props.variant === 'evaluation' ? 'bg-current text-inherit' : 'bg-app-surface'
  })

  const badgeClasses = computed(() => {
    if (props.variant === 'card') {
      return 'inline-flex w-fit items-center gap-[.45rem] rounded-[5px] bg-app-surface-plain px-[.65rem] py-[.4rem] text-[.6875rem] font-bold leading-[1.4] text-app-ink-on-control'
    }
    if (props.variant === 'evaluation') {
      return `inline-flex items-center gap-1.5 whitespace-nowrap rounded-[.375rem] px-2 py-[.125rem] text-xs font-medium leading-[1.5] shadow-none ${evaluationColors[props.status]}`
    }

    const base
      = 'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-app-on-brand whitespace-nowrap shadow-sm'

    const variants: Record<Status, string> = {
      inscricoes: 'bg-app-registration-marker',
      avaliacao: 'bg-app-evaluation-solid',
      andamento: 'bg-app-progress-solid',
      finalizado: 'bg-app-finished-solid',
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
