<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import EvaluationCard from '@/components/ui/EvaluationCard/EvaluationCard.vue'
import SearchFilterBar from '@/components/ui/SearchFilterBar'
import { hackathons } from '@/data/hackathons'

type Status = 'inscricoes' | 'avaliacao' | 'andamento' | 'finalizado'

interface EvaluationEdition {
  id: number
  title: string
  image: string
  status: Status
  endDate: string
  startDate: string
  currentEvaluations?: number
  totalProjects?: number
  progressLabel?: string
  tags?: string[]
}

const STATUS_FILTER_CODES: Record<Status, string> = {
  inscricoes: '1',
  avaliacao: '2',
  andamento: '3',
  finalizado: '4',
}

const router = useRouter()

const searchQuery = ref('')
const tipo = ref('')
const status = ref('')
const ano = ref('')

const loading = ref(false)
const error = ref(false)
const editions = ref<EvaluationEdition[]>([])

function extractYear(date: string): string {
  const parts = date.split('/')
  return parts.length === 3 ? parts[2] ?? '' : ''
}

// Temporário: identifica o tipo pelo título até a integração com a API.
function extractType(title: string): string {
  const normalized = title.toLowerCase()

  if (normalized.includes('fábrica') || normalized.includes('fabrica')) {
    return '3'
  }

  if (normalized.includes('2º') || normalized.includes('2 ano')) {
    return '1'
  }

  if (normalized.includes('3º') || normalized.includes('3 ano')) {
    return '2'
  }

  return ''
}

const filteredEditions = computed(() => {
  return editions.value.filter((edition) => {
    const matchesSearch =
      searchQuery.value === '' ||
      edition.title.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesTipo =
      tipo.value === '' ||
      extractType(edition.title) === tipo.value

    const matchesStatus =
      status.value === '' ||
      STATUS_FILTER_CODES[edition.status] === status.value

    const matchesAno =
      ano.value === '' ||
      extractYear(edition.endDate) === ano.value ||
      extractYear(edition.startDate) === ano.value

    return matchesSearch && matchesTipo && matchesStatus && matchesAno
  })
})

function navigateToProjects(editionId: number) {
  router.push(`/avaliacao/${editionId}`)
}

async function fetchEditions() {
  loading.value = true
  error.value = false

  try {
    await new Promise(resolve => setTimeout(resolve, 400))
    editions.value = [...hackathons]
  } catch (err) {
    console.error('Erro ao carregar edições para avaliação:', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchEditions()
})
</script>

<template>
  <div class="px-4 py-6 sm:px-6 lg:px-8">
    <h1 class="mb-2 text-xl font-semibold text-gray-900 sm:text-2xl">
      Avaliações
    </h1>

    <p class="mb-1 text-sm text-gray-600 sm:text-base">
      Edições que você foi designado como avaliador.
    </p>

    <p class="mb-6 text-sm text-gray-600 sm:text-base">
      Escolha uma para ver os projetos
    </p>

    <SearchFilterBar
      v-model:ano="ano"
      v-model:search="searchQuery"
      v-model:status="status"
      v-model:tipo="tipo"
    />

    <!-- Carregamento -->
    <div
      v-if="loading"
      class="flex items-center justify-center py-12"
    >
      <span class="text-gray-600">
        Carregando edições...
      </span>
    </div>

    <!-- Erro -->
    <div
      v-else-if="error"
      class="flex flex-col items-center justify-center gap-3 py-12"
    >
      <span class="text-red-600">
        Erro ao carregar edições. Tente novamente.
      </span>

      <button
        class="text-sm font-medium text-blue-600 underline"
        type="button"
        @click="fetchEditions"
      >
        Tentar novamente
      </button>
    </div>
    <div
      v-else-if="filteredEditions.length === 0"
      class="flex items-center justify-center py-12"
    >
      <span class="text-gray-600">
        Nenhuma edição disponível para avaliação
      </span>
    </div>

    <!-- Lista de edições -->
    <div
      v-else
      class="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
    >
      <EvaluationCard
        v-for="edition in filteredEditions"
        :key="edition.id"
        :current="edition.currentEvaluations || 0"
        :deadline="edition.endDate"
        :image="edition.image"
        :progress-label="edition.progressLabel || 'projetos avaliados'"
        :status="edition.status"
        :title="edition.title"
        :total="edition.totalProjects || 0"
        @click="navigateToProjects(edition.id)"
      />
    </div>
  </div>
</template>