<template>
  <PageHeader
    subtitle="Descubra edições passadas e em andamento"
    title="Explore Hackathon"
  />

  <div>
    <SearchFilterBar />

    <ResultsBar
      :end="endIndex"
      :start="startIndex + 1"
      :total="hackathons.length"
    />

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-4">
      <eventCard v-for="h in paginatedHackathons" :key="h.id" v-bind="h" />
    </div>

    <AppPagination v-model="currentPage" :length="totalPages" />
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import AppPagination from '@/components/layout/AppPagination/AppPagination.vue'
  import eventCard from '@/components/ui/eventCard.vue'
  import PageHeader from '@/components/ui/PageHeader/PageHeader.vue'
  import ResultsBar from '@/components/ui/ResultsBar/ResultsBar.vue'
  import SearchFilterBar from '@/components/ui/SearchFilterBar'
  import { hackathons } from '@/data/hackathons'

  /*
  type Status = 'inscricoes' | 'avaliacao' | 'andamento' | 'finalizado'

    interface Hackathon {
    id: number
    title: string
    image: string
    status: Status
    statusLabel: string
    startDate: string
    endDate: string
    teams: number
    location: string
    tags: string[]
  }
  */

  // --- Paginação ---
  const currentPage = ref(1)
  const itemsPerPage = 8

  const totalPages = computed (() =>
    Math.max(1, Math.ceil(hackathons.length / itemsPerPage)),
  )

  const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
  const endIndex = computed(() =>
    Math.min(startIndex.value + itemsPerPage, hackathons.length),
  )

  const paginatedHackathons = computed(() =>
    hackathons.slice(startIndex.value, endIndex.value),
  )
</script>
