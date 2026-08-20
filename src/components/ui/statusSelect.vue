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
      inscricoes: 'bg-[#1DA422]',
      avaliacao: 'bg-[#6238CF]',
      andamento: 'bg-[#1C74FB]',
      finalizado: 'bg-[#161B22]',
    }

    return `${base} ${variants[props.status]}`
  })
</script>