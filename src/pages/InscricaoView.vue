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
  import { edicaoParaCard } from '@/types'

  const PAGE_SIZE = 8

  // Só edições com inscrições abertas.
  const { data, loading, error, run } = useAsync(() => listarTodasEdicoes({ status: 'inscricoes' }))

  const search = ref('')
  const cards = computed(() => (data.value ?? []).map(e => edicaoParaCard(e)))
  const cardsFiltrados = computed(() => {
    const termo = search.value.trim().toLowerCase()
    return (data.value ?? [])
      .filter(edicao => !termo ||
        `${edicao.nome} ${edicao.local} ${edicao.tipo_edicao} ${edicao.ano}`.toLowerCase().includes(termo),
      )
      .map(edicao => edicaoParaCard(edicao))
  })
  const currentPage = ref(1)
  const totalPages = computed(() => Math.max(1, Math.ceil(cardsFiltrados.value.length / PAGE_SIZE)))
  const startIndex = computed(() => (currentPage.value - 1) * PAGE_SIZE)
  const paginadas = computed(() => cardsFiltrados.value.slice(startIndex.value, startIndex.value + PAGE_SIZE))
  const endIndex = computed(() => startIndex.value + paginadas.value.length)

  watch(totalPages, v => {
    if (currentPage.value > v) currentPage.value = v
  })
  watch(search, () => { currentPage.value = 1 })
</script>

<template>
  <PageHeader subtitle="Escolha uma edição com inscrições abertas e abra a página dela para inscrever sua equipe" title="Inscreva-se em edições" />

  <div class="w-full min-w-0">
    <SearchFilterBar
      v-if="cards.length > 1"
      v-model:search="search"
      appearance="toolbar"
      placeholder="Buscar edições com inscrições abertas"
    />

    <AsyncView
      skeleton="cards"
      :empty="!loading && !error && cardsFiltrados.length === 0"
      :empty-message="search ? 'Nenhuma edição aberta corresponde à sua busca.' : 'Nenhuma edição com inscrições abertas no momento.'"
      :error="error"
      :loading="loading"
      @retry="run"
    >
      <ResultsBar :end="endIndex" :start="cardsFiltrados.length > 0 ? startIndex + 1 : 0" :total="cardsFiltrados.length" />

      <div class="mt-4 grid grid-cols-[repeat(auto-fill,minmax(min(100%,280px),1fr))] gap-5">
        <eventCard v-for="h in paginadas" :key="h.id" v-bind="h" class="w-full max-w-[360px]" />
      </div>

      <AppPagination v-model="currentPage" :length="totalPages" />
    </AsyncView>
  </div>
</template>
