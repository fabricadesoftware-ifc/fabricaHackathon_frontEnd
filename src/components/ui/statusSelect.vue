<template>
    <span :class="badgeClasses">
        {{ label }}
    </span>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  type Status = 'inscricoes' | 'avaliacao' | 'andamento' | 'finalizado'
  const props = defineProps<{
    status: Status
    label: string
  }>()

  const badgeClasses = computed(() => {
    const base = 'px-3 py-1 rounded-full text-sm font-medium text-white'

    const variants: Record<Status, string> = {
      inscricoes: 'bg-green-500',
      avaliacao: 'bg-purple-500',
      andamento: 'bg-blue-500',
      finalizado: 'bg-neutral-900',
    }

    return `${base} ${variants[props.status]}`
  })
</script>