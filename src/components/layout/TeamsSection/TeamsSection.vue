<template>
  <div>
    <SectionCounterHeader
      class="mb-[2vw]"
      :count="count"
      :title="props.items?.length ? props.title : 'Ainda sem equipes participantes'"
    />

    <CardGrid
      v-if="props.items"
      :items="props.items"
    />
  </div>
</template>
<script setup lang="ts">
  import { computed } from 'vue'
  import { CardGrid } from '../CardGrid'
  import SectionCounterHeader from '../SectionCounterHeader'
  const count = computed(() => {
    if (props.items !== undefined) return props.items.length
    return undefined
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
    title?: string
    items?: ProjectCardItem[]
  }>()
</script>
