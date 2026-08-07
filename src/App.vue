<script lang="ts" setup>
import { ref, computed } from 'vue';
import EventCard from './components/ui/eventCard.vue';
import StatusProject from './components/ui/statusProject.vue';
import ProjectCard from './components/ui/projectCard.vue';
import AppButton from './components/ui/AppButton/index.ts';
import HeaderActions from './components/ui/HeaderActions/index.ts';
import SearchBar from './components/ui/SearchBar'
import { Sidebar } from './components/ui/Sidebar'
import PageHeader from './components/ui/PageHeader/PageHeader.vue';
import AppPagination from './components/layout/AppPagination/AppPagination.vue';

type Status = 'finalizado' | 'ativo'

interface Project {
  id: number
  logo: string
  status: Status
  statusLabel: string
  title: string
  description: string
  team: string
  event: string
}

// 🔧 MOCK: lista fake só pra testar, sem backend
const mockProjects: Project[] = Array.from({ length: 23 }, (_, i) => ({
  id: i + 1,
  logo: 'https://via.placeholder.com/48',
  status: i % 2 === 0 ? 'ativo' : 'finalizado',
  statusLabel: i % 2 === 0 ? 'Ativo' : 'Finalizado',
  title: `Projeto ${i + 1}`,
  description: 'Descrição de exemplo para testar o layout do card.',
  team: `Equipe ${i + 1}`,
  event: 'Hackathon 2026',
}))

const itemsPerPage = 6
const currentPage = ref(1)

const totalPages = computed(() =>
  Math.ceil(mockProjects.length / itemsPerPage)
)

const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return mockProjects.slice(start, end)
})
const activeItem = ref('home')
const isLoggedIn = ref(true)

const search = ref('')
</script>
<template>

  <div class="flex">
    <Sidebar v-model:active-item="activeItem" :is-logged-in="isLoggedIn" />



    <main class="flex-1 flex-row">
      <SearchBar placeholder="Pesquisar hackathons ou projetos..." modelValue="asdasd"></SearchBar>
      <PageHeader title="Explore Hackathon" subtitle="Descubra edições passadas e em andamento"></PageHeader>


      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ProjectCard v-for="project in paginatedProjects" :key="project.id" :logo="project.logo"
          :status="project.status" :status-label="project.statusLabel" :title="project.title"
          :description="project.description" :team="project.team" :event="project.event" />
      </div>

      <!-- Paginação -->
      <AppPagination v-model="currentPage" :length="totalPages" />
  </main>
  </div>
</template>
<style></style>
