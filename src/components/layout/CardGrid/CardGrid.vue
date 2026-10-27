<script setup lang="ts">
import ProjectCard from '@/components/ui/projectCard.vue'

export interface ProjectCardItem {
  id: string | number

  title: string
  description: string
  team: string
  event: string

  logo: string
  cover?: string | null

  status: 'ativo' | 'finalizado'
  statusLabel: string

  deployUrl?: string | null
}

withDefaults(defineProps<{
  items: ProjectCardItem[]
  columns?: 3 | 4
}>(), {
  columns: 4,
})
</script>

<template>
  <div
    :class="[
      'grid grid-cols-1 gap-5 sm:grid-cols-2',
      columns === 3
        ? 'lg:grid-cols-3'
        : 'lg:grid-cols-3 xl:grid-cols-4',
    ]"
  >
    <ProjectCard
      v-for="item in items"
      :key="item.id"
      :title="item.title"
      :description="item.description"
      :team="item.team"
      :event="item.event"
      :logo="item.logo"
      :cover="item.cover"
      :status="item.status"
      :status-label="item.statusLabel"
      :deploy-url="item.deployUrl"
    />
  </div>
</template>