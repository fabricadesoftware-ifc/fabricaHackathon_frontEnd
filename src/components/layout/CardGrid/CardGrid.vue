<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    <ProjectCard
      v-for="item in items"
      :key="item.id"
      :description="item.description"
      :event="item.event"
      :logo="item.logo"
      :status="item.status"
      :status-label="item.statusLabel"
      :team="item.team"
      :title="item.title"
    />
  </div>
</template>

<script setup lang="ts">
  import ProjectCard from '@/components/ui/projectCard.vue'

  export interface ProjectCardItem {
    id: string | number
    logo: string
    status: 'ativo' | 'finalizado'
    statusLabel: string
    description: string
    title: string
    team: string
    event: string
  }

  defineProps<{
    items: ProjectCardItem[]
  }>()
</script>
