<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import AppButton from '@/components/ui/AppButton/AppButton.vue'
  import EvaluationProjectCardList from '@/components/ui/EvaluationProjectCardList/EvaluationProjectCardList.vue'
  import FilterChipGroup from '@/components/ui/FilterChipGroup/FilterChipGroup.vue'
  import { type EvaluationProject, getProjectsByEdition } from '@/data/evaluationProjects'
  import { hackathons } from '@/data/hackathons'

  type FilterType = 'todos' | 'avaliados' | 'pendentes'

  const route = useRoute()
  const router = useRouter()

  const editionId = computed(() => {
    const rawId = route.params.editionId
    return Number(Array.isArray(rawId) ? rawId[0] : rawId) || 1
  })

  const edition = computed(() => {
    return hackathons.find(h => h.id === editionId.value)
  })

  const projects = ref<EvaluationProject[]>([])
  const loading = ref(true)
  const error = ref(false)
  const selectedFilter = ref<FilterType>('todos')

  const totalCount = computed(() => projects.value.length)
  const evaluatedCount = computed(() => projects.value.filter(p => p.status === 'avaliado').length)
  const pendingCount = computed(() => projects.value.filter(p => p.status === 'pendente').length)

  const filterOptions = computed(() => [
    { label: `Todos (${totalCount.value})`, value: 'todos' },
    { label: `Avaliados (${evaluatedCount.value})`, value: 'avaliados' },
    { label: `Pendentes (${pendingCount.value})`, value: 'pendentes' },
  ])

  const filteredProjects = computed(() => {
    if (selectedFilter.value === 'avaliados') {
      return projects.value.filter(p => p.status === 'avaliado')
    }
    if (selectedFilter.value === 'pendentes') {
      return projects.value.filter(p => p.status === 'pendente')
    }
    return projects.value
  })

  async function fetchProjects () {
    loading.value = true
    error.value = false

    try {
      projects.value = await getProjectsByEdition(editionId.value)
    } catch (err) {
      console.error('Erro ao buscar projetos para avaliação:', err)
      error.value = true
    } finally {
      loading.value = false
    }
  }

  function handleProjectClick (projectId: number) {
    router.push(`/avaliacao/${editionId.value}/projeto/${projectId}`)
  }

  function handleBackToEditions () {
    router.push('/avaliacao')
  }

  function resetFilter () {
    selectedFilter.value = 'todos'
  }

  onMounted(() => {
    fetchProjects()
  })
</script>

<template>
  <div class="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
    <!-- Cabeçalho -->
    <header class="mb-6">
      <div v-if="edition?.title" class="mb-2 flex items-center gap-2">
        <span class="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
          <span class="mdi mdi-trophy-outline text-sm" />
          {{ edition.title }}
        </span>
      </div>

      <h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
        Projetos para avaliar
      </h1>

      <p class="mt-1 text-sm text-gray-500 sm:text-base">
        {{ evaluatedCount }} de {{ totalCount }} projetos avaliados
      </p>
    </header>

    <!-- Filtro de status -->
    <div class="mb-6 overflow-x-auto pb-1">
      <FilterChipGroup
        v-model="selectedFilter"
        :options="filterOptions"
      />
    </div>

    <!-- Conteúdo principal -->
    <main>
      <!-- Estado de Carregamento -->
      <div
        v-if="loading"
        class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center"
      >
        <span class="mdi mdi-loading animate-spin text-3xl text-blue-600" />
        <p class="mt-3 text-sm font-medium text-gray-600">
          Carregando projetos para avaliação...
        </p>
      </div>

      <!-- Estado de Erro -->
      <div
        v-else-if="error"
        class="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50/50 p-8 text-center"
      >
        <span class="mdi mdi-alert-circle-outline text-4xl text-red-500" />
        <h3 class="mt-2 text-base font-semibold text-gray-900">
          Erro ao carregar projetos
        </h3>
        <p class="mt-1 text-sm text-gray-600">
          Não foi possível carregar a lista de projetos desta edição.
        </p>
        <button
          class="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
          type="button"
          @click="fetchProjects"
        >
          Tentar novamente
        </button>
      </div>

      <!-- Estado Vazio -->
      <div
        v-else-if="filteredProjects.length === 0"
        class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center"
      >
        <div class="flex size-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
          <span class="mdi mdi-folder-open-outline text-2xl" />
        </div>
        <h3 class="mt-4 text-base font-semibold text-gray-900">
          Nenhum projeto encontrado
        </h3>
        <p class="mt-1 text-sm text-gray-500">
          <template v-if="selectedFilter === 'avaliados'">
            Nenhum projeto foi avaliado ainda nesta edição.
          </template>
          <template v-else-if="selectedFilter === 'pendentes'">
            Todos os projetos desta edição já foram avaliados!
          </template>
          <template v-else>
            Não há projetos cadastrados para esta edição.
          </template>
        </p>
        <button
          v-if="selectedFilter !== 'todos' && totalCount > 0"
          class="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
          type="button"
          @click="resetFilter"
        >
          Ver todos os projetos
        </button>
      </div>

      <!-- Lista de Projetos -->
      <div v-else class="space-y-3">
        <EvaluationProjectCardList
          v-for="project in filteredProjects"
          :key="project.id"
          :avatar="project.avatar"
          :name="project.name"
          :score="project.status === 'avaliado' ? project.score! : undefined"
          :status="project.status"
          :team-name="project.teamName"
          @click="handleProjectClick(project.id)"
        />
      </div>

      <!-- Rodapé / Ação de Voltar -->
      <footer class="mt-8 flex items-center justify-start border-t border-gray-100 pt-6">
        <AppButton
          icon="←"
          icon-position="left"
          label="Voltar para edições"
          variant="secondary"
          @click="handleBackToEditions"
        />
      </footer>
    </main>
  </div>
</template>
