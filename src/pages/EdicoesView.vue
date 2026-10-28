<template>
  <PageHeader
    subtitle="Descubra edições passadas e em andamento"
    title="Explore Hackathon"
  />

  <div class="w-full min-w-0">
    <SearchFilterBar
      v-model:ano="ano"
      v-model:search="search"
      v-model:status="status"
      v-model:tipo="tipo"
      :options-ano="opcoesAno"
      :options-status="opcoesStatus"
      :options-tipo="opcoesTipo"
      appearance="toolbar"
      placeholder="Buscar edições por nome ou local"
    />

    <AsyncView
      skeleton="cards"
      :empty="!loading && !error && filtradas.length === 0"
      :empty-message="search || tipo || status || ano
        ? 'Nenhuma edição corresponde aos critérios informados.'
        : 'Nenhuma edição encontrada.'"
      :error="error"
      :loading="loading"
      @retry="run"
    >
      <ResultsBar
        :end="endIndex"
        :start="filtradas.length > 0 ? startIndex + 1 : 0"
        :total="filtradas.length"
      />

      <div class="mt-4 grid grid-cols-[repeat(auto-fill,minmax(min(100%,280px),1fr))] gap-5">
        <eventCard v-for="h in paginadas" :key="h.id" v-bind="h" class="w-full max-w-[360px]" />
      </div>

      <AppPagination v-model="currentPage" :length="totalPages" />
    </AsyncView>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import AppPagination from '@/components/layout/AppPagination/AppPagination.vue'
  import { AsyncView } from '@/components/ui/AsyncView'
  import eventCard from '@/components/ui/eventCard.vue'
  import PageHeader from '@/components/ui/PageHeader/PageHeader.vue'
  import ResultsBar from '@/components/ui/ResultsBar/ResultsBar.vue'
  import SearchFilterBar from '@/components/ui/SearchFilterBar'
  import { useAsync } from '@/composables/useAsync'
  import { listarTodasEdicoes } from '@/services'
  import { edicaoParaCard, mapearStatus } from '@/types'

  const { data, loading, error, run } = useAsync(() => listarTodasEdicoes())

  // --- Filtros (client-side: a API devolve todas as edições em poucas páginas) ---
  const search = ref('')
  const tipo = ref('')
  const status = ref('')
  const ano = ref('')

  const edicoes = computed(() => data.value ?? [])

  const statusDisponiveis = [
    { label: 'Inscrições', value: 'inscricoes' },
    { label: 'Andamento', value: 'andamento' },
    { label: 'Avaliação', value: 'avaliacao' },
    { label: 'Finalizado', value: 'finalizado' },
  ]
  const opcoesStatus = computed(() =>
    statusDisponiveis.filter(option =>
      edicoes.value.some(edicao => mapearStatus(edicao.status) === option.value),
    ),
  )
  const opcoesTipo = computed(() =>
    [...new Set(edicoes.value.map(e => e.tipo_edicao).filter(Boolean))].map(t => ({ label: t, value: t })),
  )
  const opcoesAno = computed(() => {
    // eslint-disable-next-line unicorn/no-array-sort -- lib do projeto não inclui toSorted
    const anos = [...new Set(edicoes.value.map(e => e.ano))].sort((a, b) => b - a)
    return anos.map(a => ({ label: String(a), value: String(a) }))
  })

  const filtradas = computed(() => {
    const termo = search.value.trim().toLowerCase()
    return edicoes.value
      .filter(e => !termo || `${e.nome} ${e.local} ${e.tipo_edicao} ${e.ano} ${e.status_label}`.toLowerCase().includes(termo))
      .filter(e => !tipo.value || e.tipo_edicao === tipo.value)
      .filter(e => !status.value || mapearStatus(e.status) === status.value)
      .filter(e => !ano.value || String(e.ano) === ano.value)
  })

  // --- Paginação ---
  const currentPage = ref(1)
  const itemsPerPage = 8

  const totalPages = computed(() => Math.max(1, Math.ceil(filtradas.value.length / itemsPerPage)))
  const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
  const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, filtradas.value.length))
  const paginadas = computed(() => filtradas.value.slice(startIndex.value, endIndex.value).map(e => edicaoParaCard(e)))

  watch([search, tipo, status, ano], () => {
    currentPage.value = 1
  })
</script>
