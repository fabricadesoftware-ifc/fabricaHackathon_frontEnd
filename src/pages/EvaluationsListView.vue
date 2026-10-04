    
    <script setup lang="ts">
    import { computed, onMounted, ref } from 'vue'
    import { useRouter } from 'vue-router'
    import searchFilterBar from '@/components/ui/SearchFilterBar/searchFilterBar.vue'
    import EvaluationCard from '@/components/ui/EvaluationCard/EvaluationCard.vue'
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
    
    const router = useRouter()
    
    const searchQuery = ref('')
    const tipo = ref('')
    const status = ref('')
    const ano = ref('')
    
    const loading = ref(false)
    const error = ref(false)
    const editions = ref<EvaluationEdition[]>([...hackathons])
    
    const extractYear = (date: string): string => {
      const parts = date.split('/')
      return parts.length === 3 ? parts[2] : ''
    }
    
    const extractType = (title: string): string => {
      if (title.toLowerCase().includes('fábrica')) return '3'
      if (title.toLowerCase().includes('2º') || title.toLowerCase().includes('2 ano')) return '1'
      if (title.toLowerCase().includes('3º') || title.toLowerCase().includes('3 ano')) return '2'
      return ''
    }
    
    const mapStatus = (status: Status): string => {
      if (status === 'inscricoes') return '1'
      if (status === 'andamento') return '2'
      if (status === 'finalizado') return '3'
      if (status === 'avaliacao') return '2'
      return ''
    }
    
    
    const filteredEditions = computed(() => {
      return editions.value.filter(edition => {
        const matchesSearch = searchQuery.value === '' || 
          edition.title.toLowerCase().includes(searchQuery.value.toLowerCase())
        
        const matchesTipo = tipo.value === '' || extractType(edition.title) === tipo.value
        
        const matchesStatus = status.value === '' || mapStatus(edition.status) === status.value
        
        const matchesAno = ano.value === '' || extractYear(edition.endDate) === ano.value || extractYear(edition.startDate) === ano.value
        
        return matchesSearch && matchesTipo && matchesStatus && matchesAno
      })
    })
    
    const navigateToProjects = (editionId: number) => {
      router.push(`/avaliacao/${editionId}`)
    }
    
    onMounted(() => {
      console.log('Carregar dados aqui...');
    })
    </script>
<template>
  <main class="px-4 sm:px-6 lg:px-8 py-6">
    <h1 class="text-gray-900 text-xl sm:text-2xl font-semibold mb-2">Avaliações</h1>
    <p class="text-gray-600 text-sm sm:text-base mb-1">Edições que você foi designado como avaliador.</p>
    <p class="text-gray-600 text-sm sm:text-base mb-6">Escolha uma para ver os projetos</p>

    <searchFilterBar
      v-model:search="searchQuery"
      v-model:tipo="tipo"
      v-model:status="status"
      v-model:ano="ano"
    />

    <div v-if="loading" class="flex justify-center items-center py-12">
      <span class="text-gray-600">Carregando edições...</span>
    </div>

    <div v-else-if="error" class="flex justify-center items-center py-12">
      <span class="text-red-600">Erro ao carregar edições. Tente novamente.</span>
    </div>

    <div v-else-if="filteredEditions.length === 0" class="flex justify-center items-center py-12">
      <span class="text-gray-600">Nenhuma edição disponível para avaliação</span>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  max-w-full gap-6 mt-6">
      <EvaluationCard
        v-for="edition in filteredEditions"
        :key="edition.id"
        :image="edition.image"
        :title="edition.title"
        :deadline="edition.endDate"
        :current="edition.currentEvaluations || 0"
        :total="edition.totalProjects || 0"
        :progress-label="edition.progressLabel || 'projetos avaliados'"
        :status="edition.status"
        @click="navigateToProjects(edition.id)"
      />
    </div>
  </main>
</template>
