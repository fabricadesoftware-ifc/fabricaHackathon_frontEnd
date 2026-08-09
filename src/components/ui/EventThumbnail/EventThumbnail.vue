<script setup lang="ts">
  import { computed } from 'vue'
  import statusSelect from '../statusSelect.vue'
  type Status = 'inscricoes' | 'avaliacao' | 'andamento' | 'finalizado'
  const props = defineProps<{
    title: string
    image: string
    status: Status
  }>()
  const label = computed(() => {
    if (props.status === 'inscricoes') return 'Inscrições'
    if (props.status === 'avaliacao') return 'Avaliação'
    if (props.status === 'andamento') return 'Andamento'
    return 'Finalizado'
  })
</script>
<template>
  <div class="max-w-max max-h-max relative rounded-lg">
    <img
      :alt="props.title"
      class="h-max w-max object-cover"
      :src="props.image"
    >

    <statusSelect
      class="absolute top-6.5 left-8"
      :label="label"
      :status="props.status"
    />
  </div>
</template>
