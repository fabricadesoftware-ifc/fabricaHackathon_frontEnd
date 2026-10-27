<script setup lang="ts">
import { computed } from 'vue'

type Status = 'inscricoes' | 'avaliacao' | 'andamento' | 'finalizado'

const props = defineProps<{
  status: Status
  label: string
}>()

const badgeClasses = computed(() => {
  const base =
    'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-white whitespace-nowrap shadow-sm'

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
      class="h-1.5 w-1.5 shrink-0 rounded-full bg-white"
      aria-hidden="true"
    />

    {{ label }}
  </span>
</template>