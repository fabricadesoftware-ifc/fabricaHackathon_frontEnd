<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import EvaluationCard from '@/components/ui/EvaluationCard/EvaluationCard.vue'
  import SearchFilterBar from '@/components/ui/SearchFilterBar/SearchFilterBar.vue'
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

  const STATUS_LABELS: Record<Status, string> = {
    inscricoes: 'Inscrições',
    avaliacao: 'Avaliação',
    andamento: 'Andamento',
    finalizado: 'Finalizado',
  }

  // Códigos usados pelo filtro "Status" do SearchFilterBar.
  // Cada status tem seu próprio código — antes "avaliacao" e "andamento"
  // dividiam o mesmo valor ('2'), o que fazia o filtro misturar os dois.
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

  function extractYear (date: string): string {
    const parts = date.split('/')
    return parts.length === 3 ? parts[2] : ''
  }

  // ⚠️ Temporário: infere o "tipo" a partir do título porque o dado mockado
  // ainda não tem um campo próprio. Quando a API existir (ou o mock for
  // ajustado para incluir "type"), trocar isso por edition.type direto,
  // igual já fizemos com "status".
  function extractType (title: string): string {
    const normalized = title.toLowerCase()
    if (normalized.includes('fábrica') || normalized.includes('fabrica')) return '3'
    if (normalized.includes('2º') || normalized.includes('2 ano')) return '1'
    if (normalized.includes('3º') || normalized.includes('3 ano')) return '2'
    return ''
  }

  const filteredEditions = computed(() => {
    return editions.value.filter(edition => {
      const matchesSearch = searchQuery.value === ''
        || edition.title.toLowerCase().includes(searchQuery.value.toLowerCase())

      const matchesTipo = tipo.value === '' || extractType(edition.title) === tipo.value

      const matchesStatus = status.value === '' || STATUS_FILTER_CODES[edition.status] === status.value

      const matchesAno = ano.value === ''
        || extractYear(edition.endDate) === ano.value
        || extractYear(edition.startDate) === ano.value

      return matchesSearch && matchesTipo && matchesStatus && matchesAno
    })
  })

  function navigateToProjects (editionId: number) {
    router.push(`/avaliacao/${editionId}`)
  }

  // Simula uma chamada assíncrona com o dado mockado.
  // Quando a API existir, troque o corpo do try por uma chamada real
  // (ex: `editions.value = await getEvaluationEditions()`), mantendo
  // o mesmo loading/error já implementado aqui.
  async function fetchEditions () {
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
  <div class="px-4 sm:px-6 lg:px-8 py-6">
    <h1 class="text-gray-900 text-xl sm:text-2xl font-semibold mb-2">Avaliações</h1>
    <p class="text-gray-600 text-sm sm:text-base mb-1">Edições que você foi designado como avaliador.</p>
    <p class="text-gray-600 text-sm sm:text-base mb-6">Escolha uma para ver os projetos</p>

    <SearchFilterBar
      v-model:ano="ano"
      v-model:search="searchQuery"
      v-model:status="status"
      v-model:tipo="tipo"
    />

    <div v-if="loading" class="flex justify-center items-center py-12">
      <span class="text-gray-600">Carregando edições...</span>
    </div>

    <div v-else-if="error" class="flex flex-col items-center justify-center gap-3 py-12">
      <span class="text-red-600">Erro ao carregar edições. Tente novamente.</span>
      <button
        class="text-blue-600 text-sm font-medium underline"
        type="button"
        @click="fetchEditions"
      >
        Tentar novamente
      </button>
    </div>

    <div v-else-if="filteredEditions.length === 0" class="flex justify-center items-center py-12">
      <span class="text-gray-600">Nenhuma edição disponível para avaliação</span>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
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
