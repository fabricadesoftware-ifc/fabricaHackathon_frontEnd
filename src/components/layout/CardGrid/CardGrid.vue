<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'
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

  const props = withDefaults(defineProps<{
    items?: ProjectCardItem[]
    columns?: 3 | 4
    compact?: boolean
  }>(), {
    items: () => [],
    compact: false,
  })
  const grid = useTemplateRef<HTMLElement>('grid')
  const availableWidth = ref(0)
  const gap = ref(0)
  let resizeObserver: ResizeObserver | undefined

  const columnCount = computed(() => {
    const minimumWidth = props.compact ? 280 : 300
    const available = Math.max(1, Math.floor((availableWidth.value + gap.value) / (minimumWidth + gap.value)))
    return props.columns ? Math.min(props.columns, available) : available
  })

  onMounted(() => {
    const element = grid.value
    if (!element) return
    const measure = () => {
      availableWidth.value = element.getBoundingClientRect().width
      gap.value = Number.parseFloat(getComputedStyle(element).columnGap) || 0
    }
    resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(element)
    measure()
  })
  onBeforeUnmount(() => resizeObserver?.disconnect())
</script>

<template>
  <div class="w-full min-w-0">
    <div
      ref="grid"
      class="card-grid grid w-full min-w-0 grid-cols-[repeat(var(--card-columns),minmax(0,var(--container-card)))] justify-start gap-5 [&>*]:max-w-full"
      :style="{ '--card-columns': columnCount }"
    >
      <slot>
        <ProjectCard
          v-for="item in items"
          :key="item.id"
          :cover="item.cover"
          :deploy-url="item.deployUrl"
          :description="item.description"
          :event="item.event"
          :logo="item.logo"
          :status="item.status"
          :status-label="item.statusLabel"
          :team="item.team"
          :title="item.title"
        />
      </slot>
    </div>
  </div>
</template>
