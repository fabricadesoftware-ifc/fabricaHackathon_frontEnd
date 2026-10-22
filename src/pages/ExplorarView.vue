<template>
  <PageHeader
    subtitle="Descubra os projetos de todas as edições"
    title="Explorar projetos"
  />

  <div>
    <SearchFilterBar
      v-model:search="search"
      v-model:tipo="edicaoId"
      :options-tipo="opcoesEdicao"
      placeholder="Buscar projetos..."
    />

    <AsyncView
      :empty="!loading && !error && itens.length === 0"
      empty-message="Nenhum projeto encontrado."
      :error="error"
      :loading="loading"
      @retry="run"
    >
      <ResultsBar
        :end="endIndex"
        label="projeto(s)"
        :start="total ? startIndex + 1 : 0"
        :total="total"
      />

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-4">
        <projectCard v-for="p in itens" :key="p.id" v-bind="p" />
      </div>

      <AppPagination v-model="currentPage" :length="totalPages" />
    </AsyncView>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import AppPagination from '@/components/layout/AppPagination/AppPagination.vue'
  import { AsyncView } from '@/components/ui/AsyncView'
  import PageHeader from '@/components/ui/PageHeader/PageHeader.vue'
  import projectCard from '@/components/ui/projectCard.vue'
  import ResultsBar from '@/components/ui/ResultsBar/ResultsBar.vue'
  import SearchFilterBar from '@/components/ui/SearchFilterBar'
  import { useAsync } from '@/composables/useAsync'
  import { listarProjetosPaginado, listarTodasEdicoes } from '@/services'
  import { projetoParaCard } from '@/types'

  const PAGE_SIZE = 8

  const search = ref('')
  const edicaoId = ref('')
  const currentPage = ref(1)

  // Edições: alimentam o filtro e dão nome/status ao card do projeto.
  const { data: edicoes } = useAsync(() => listarTodasEdicoes())
  const opcoesEdicao = computed(() =>
    (edicoes.value ?? []).map(e => ({ label: e.nome, value: String(e.id) })),
  )
  const edicaoPorId = computed(() => new Map((edicoes.value ?? []).map(e => [e.id, e])))

  // Projetos: paginação e busca feitas pelo servidor.
  const { data, loading, error, run } = useAsync(() =>
    listarProjetosPaginado({
      page: currentPage.value,
      page_size: PAGE_SIZE,
      search: search.value.trim() || undefined,
      edicao: edicaoId.value ? Number(edicaoId.value) : undefined,
    }),
  )

  const total = computed(() => data.value?.count ?? 0)
  const itens = computed(() =>
    (data.value?.results ?? []).map(p => projetoParaCard(p, edicaoPorId.value.get(p.edicao))),
  )
  const totalPages = computed(() => Math.max(1, Math.ceil(total.value / PAGE_SIZE)))
  const startIndex = computed(() => (currentPage.value - 1) * PAGE_SIZE)
  const endIndex = computed(() => startIndex.value + itens.value.length)

  let debounce: ReturnType<typeof setTimeout> | undefined
  watch([search, edicaoId], () => {
    clearTimeout(debounce)
    debounce = setTimeout(recarregarDaPrimeiraPagina, 300)
  })

  function recarregarDaPrimeiraPagina () {
    // Volta à página 1; se já estava nela, a mudança de página não dispara, então recarrega aqui.
    if (currentPage.value === 1) {
      run()
    } else {
      currentPage.value = 1
    }
  }
  watch(currentPage, run)
</script>
