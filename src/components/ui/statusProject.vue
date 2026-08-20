<template>
    <span :class="projectStatus">
        {{ label }}
    </span>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  type Status = 'ativo' | 'finalizado'
  const props = defineProps<{
    status: Status
    label: string
  }>()

  const projectStatus = computed(() => {
    const base = 'px-3 py-1 rounded-full text-sm font-medium text-white'

    const variants: Record<Status, string> = {
      ativo: 'bg-green-500',
      finalizado: 'bg-neutral-700',
    }

    return `${base} ${variants[props.status]}`
  })
</script>