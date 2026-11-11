<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useRouter } from 'vue-router'

  import { AsyncView } from '@/components/ui/AsyncView'
  import EvaluationCard from '@/components/ui/EvaluationCard/EvaluationCard.vue'
  import SearchFilterBar from '@/components/ui/SearchFilterBar'
  import { useAsync } from '@/composables/useAsync'
  import { listarMinhasAvaliacoes, listarTodasEdicoes } from '@/services'
  import { useAuthStore } from '@/stores/auth'
  import { edicaoParaCard, mapearStatus } from '@/types'
  import { agruparPorEdicao } from '@/utils/avaliacao'

  const router = useRouter()
  const auth = useAuthStore()

  // Avaliador vê só as edições em que está vinculado; professor e admin veem todas, somente leitura.
  const isAvaliador = computed(() => auth.userRole === 'AVALIADOR')

  const { data, loading, error, run } = useAsync(async () => {
    const [edicoes, avaliacoes] = await Promise.all([
      listarTodasEdicoes(),
      isAvaliador.value ? listarMinhasAvaliacoes() : Promise.resolve([]),
    ])
    return { edicoes, avaliacoes }
  })

  // Filtros.
  const searchQuery = ref('')
  const tipo = ref('')
  const status = ref('')
  const ano = ref('')

  const opcoesStatus = [
    { label: 'Inscrições', value: 'inscricoes' },
    { label: 'Andamento', value: 'andamento' },
    { label: 'Avaliação', value: 'avaliacao' },
    { label: 'Finalizado', value: 'finalizado' },
  ]
  const opcoesTipo = computed(() =>
    [...new Set((data.value?.edicoes ?? []).map(e => e.tipo_edicao).filter(Boolean))]
      .map(t => ({ label: t, value: t })),
  )
  const opcoesAno = computed(() => {
    // eslint-disable-next-line unicorn/no-array-sort -- lib do projeto não inclui toSorted
    const anos = [...new Set((data.value?.edicoes ?? []).map(e => e.ano))].sort((a, b) => b - a)
    return anos.map(a => ({ label: String(a), value: String(a) }))
  })

  // Edições exibidas, já com o progresso do avaliador.
  const cards = computed(() => {
    const edicoes = data.value?.edicoes ?? []
    const progresso = new Map(agruparPorEdicao(data.value?.avaliacoes ?? []).map(p => [p.id, p]))
    const termo = searchQuery.value.trim().toLowerCase()

    return edicoes
      .filter(e => !isAvaliador.value || progresso.has(e.id))
      .filter(e => !termo || e.nome.toLowerCase().includes(termo))
      .filter(e => !tipo.value || e.tipo_edicao === tipo.value)
      .filter(e => !status.value || mapearStatus(e.status) === status.value)
      .filter(e => !ano.value || String(e.ano) === ano.value)
      .map(e => {
        const card = edicaoParaCard(e)
        const p = progresso.get(e.id)
        return {
          id: e.id,
          image: card.image,
          title: card.title,
          status: card.status,
          deadline: card.endDate,
          current: p?.avaliados,
          total: p?.total,
        }
      })
  })

  function navigateToProjects (editionId: number) {
    router.push(`/avaliacao/${editionId}`)
  }
</script>

<template>
  <div class="evaluation-flow pt-4 text-app-ink-heading w-full min-w-0">
    <h1 class="mb-2 text-xl font-semibold text-app-text-body-strong sm:text-2xl">
      Avaliações
    </h1>

    <p class="mb-1 text-sm text-app-text-secondary sm:text-base">
      {{ isAvaliador ? 'Edições em que você foi designado como avaliador.' : 'Visão somente leitura de todas as edições.' }}
    </p>

    <p class="mb-6 text-sm text-app-text-secondary sm:text-base">
      Escolha uma para ver os projetos
    </p>

    <SearchFilterBar
      v-model:ano="ano"
      v-model:search="searchQuery"
      v-model:status="status"
      v-model:tipo="tipo"
      appearance="toolbar"
      :options-ano="opcoesAno"
      :options-status="opcoesStatus"
      :options-tipo="opcoesTipo"
      placeholder="Buscar edições por nome"
    />

    <AsyncView
      :empty="!loading && !error && cards.length === 0"
      :empty-message="searchQuery || tipo || status || ano ? 'Nenhuma edição corresponde aos filtros selecionados.' : isAvaliador ? 'Você ainda não foi vinculado a nenhuma edição como avaliador.' : 'Nenhuma edição encontrada.'"
      :error="error"
      :loading="loading"
      skeleton="cards"
      @retry="run"
    >
      <div class="mt-5 grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-4">
        <EvaluationCard
          v-for="edition in cards"
          :key="edition.id"
          :current="edition.current"
          :deadline="edition.deadline"
          :image="edition.image"
          progress-label="projetos avaliados"
          :status="edition.status"
          :title="edition.title"
          :total="edition.total"
          @click="navigateToProjects(edition.id)"
        />
      </div>
    </AsyncView>
  </div>
</template>

<style scoped src="./evaluation-flow.css"></style>
