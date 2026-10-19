<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import AppButton from '@/components/ui/AppButton/AppButton.vue'
import EvaluationProjectCardList from '@/components/ui/EvaluationProjectCardList/EvaluationProjectCardList.vue'
import FilterChipGroup from '@/components/ui/FilterChipGroup/FilterChipGroup.vue'

import { useEvaluationsStore } from '@/stores/evaluations'

type FilterType = 'todos' | 'avaliados' | 'pendentes'

const route = useRoute()
const router = useRouter()
const evaluationsStore = useEvaluationsStore()

const editionId = computed(() => Number(route.params.editionId))

// Projetos obtidos diretamente da store Pinia.
const projects = computed(() =>
  evaluationsStore.getProjectsByEdition(editionId.value),
)

const loading = ref(false)
const error = ref(false)
const selectedFilter = ref<FilterType>('todos')

// Contadores atualizados automaticamente.
const totalCount = computed(() => projects.value.length)

const evaluatedCount = computed(() =>
  projects.value.filter(project => project.status === 'avaliado').length,
)

const pendingCount = computed(() =>
  projects.value.filter(project => project.status === 'pendente').length,
)

// Opções dos filtros.
const filterOptions = computed(() => [
  { label: `Todos (${totalCount.value})`, value: 'todos' },
  { label: `Avaliados (${evaluatedCount.value})`, value: 'avaliados' },
  { label: `Pendentes (${pendingCount.value})`, value: 'pendentes' },
])

// Filtra os projetos conforme o status selecionado.
const filteredProjects = computed(() => {
  if (selectedFilter.value === 'avaliados') {
    return projects.value.filter(project => project.status === 'avaliado')
  }

  if (selectedFilter.value === 'pendentes') {
    return projects.value.filter(project => project.status === 'pendente')
  }

  return projects.value
})

// Valida a edição e simula o carregamento.
async function fetchProjects() {
  loading.value = true
  error.value = false

  try {
    if (!Number.isInteger(editionId.value) || editionId.value <= 0) {
      throw new Error('Edição inválida.')
    }

    await new Promise(resolve => setTimeout(resolve, 350))
  } catch (err) {
    console.error('Erro ao carregar projetos para avaliação:', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

// Apenas projetos pendentes podem ser abertos para avaliação.
function handleProjectClick(projectId: number) {
  const project = projects.value.find(item => item.id === projectId)

  if (!project || project.status === 'avaliado') return

  router.push(`/avaliacao/${editionId.value}/projeto/${projectId}`)
}

function handleBackToEditions() {
  router.push('/avaliacao')
}

function resetFilter() {
  selectedFilter.value = 'todos'
}

// Atualiza a visualização quando a edição mudar.
watch(
  editionId,
  () => {
    selectedFilter.value = 'todos'
    fetchProjects()
  },
  { immediate: true },
)
</script>

<template>
  <div class="mx-auto w-full px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
    <!-- Cabeçalho -->
    <header class="mb-5 sm:mb-6">
      <h1 class="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
        Projetos para avaliar
      </h1>

      <p class="mt-1 text-sm text-gray-500">
        {{ evaluatedCount }} de {{ totalCount }} projetos avaliados
      </p>
    </header>

    <!-- Filtros -->
    <div class="mb-5 sm:mb-6">
      <FilterChipGroup
        v-model="selectedFilter"
        :options="filterOptions"
      />
    </div>

    <!-- Conteúdo -->
    <main>
      <!-- Carregamento -->
      <div
        v-if="loading"
        class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center"
      >
        <span class="mdi mdi-loading animate-spin text-3xl text-blue-600" />

        <p class="mt-3 text-sm font-medium text-gray-600">
          Carregando projetos para avaliação...
        </p>
      </div>

      <!-- Erro -->
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

      <!-- Lista vazia -->
      <div
        v-else-if="filteredProjects.length === 0"
        class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center"
      >
        <div
          class="flex size-14 items-center justify-center rounded-full bg-gray-100 text-gray-400"
        >
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

      <!-- Lista de projetos -->
      <div
        v-else
        class="flex flex-col gap-3 sm:gap-4"
      >
        <template
          v-for="project in filteredProjects"
          :key="project.id"
        >
          <!-- Projeto avaliado -->
          <EvaluationProjectCardList
            v-if="project.status === 'avaliado'"
            :avatar="project.avatar"
            :name="project.name"
            :score="project.score ?? 0"
            status="avaliado"
            :team-name="project.teamName"
            class="cursor-not-allowed opacity-55"
            :disabled="true"
          />

          <!-- Projeto pendente -->
          <EvaluationProjectCardList
            v-else
            :avatar="project.avatar"
            :name="project.name"
            status="pendente"
            :team-name="project.teamName"
            class="cursor-pointer"
            @click="handleProjectClick(project.id)"
          />
        </template>
      </div>

      <!-- Rodapé -->
      <footer class="mt-6 flex items-center justify-start sm:mt-8">
        <AppButton
          icon="←"
          icon-position="left"
          label="Voltar para edições"
          variant="secondary"
          class="!h-auto !rounded-xl !bg-[#EFF6FF] !px-4.5 !py-3 !text-sm font-medium !text-[#2563EB] !shadow-none hover:!bg-[#DBEAFE] sm:!text-base"
          @click="handleBackToEditions"
        />
      </footer>
    </main>
  </div>
</template>