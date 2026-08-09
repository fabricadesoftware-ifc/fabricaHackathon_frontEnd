<template>
  <div class="px-[3vw]">
    <SectionCounterHeader
      class="mb-[2vw]"
      :count="count"
      :title="props.title"
    />

    <CardGrid
      :items="props.items"
    />
  </div>
</template>
<script setup lang="ts">
  import { computed } from 'vue'
  import { CardGrid } from '../CardGrid'
  import SectionCounterHeader from '../SectionCounterHeader'
  const count = computed(() => {
    return props.items.length
  })
  interface ProjectCardItem {
    id: string | number
    logo: string
    status: 'ativo' | 'finalizado'
    statusLabel: string
    description: string
    title: string
    team: string
    event: string
  }

  const props = defineProps<{
    title: string
    items: ProjectCardItem[]
  }>()
</script>
