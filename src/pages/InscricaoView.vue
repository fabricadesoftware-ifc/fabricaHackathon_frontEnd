<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import AppPagination from '@/components/layout/AppPagination/AppPagination.vue'
  import { AsyncView } from '@/components/ui/AsyncView'
  import eventCard from '@/components/ui/eventCard.vue'
  import PageHeader from '@/components/ui/PageHeader/PageHeader.vue'
  import ResultsBar from '@/components/ui/ResultsBar/ResultsBar.vue'
  import { useAsync } from '@/composables/useAsync'
  import { listarTodasEdicoes } from '@/services'
  import { edicaoParaCard } from '@/types'

  const PAGE_SIZE = 8

  // Só edições com inscrições abertas.
  const { data, loading, error, run } = useAsync(() => listarTodasEdicoes({ status: 'inscricoes' }))

  const cards = computed(() => (data.value ?? []).map(e => edicaoParaCard(e)))
  const currentPage = ref(1)
  const totalPages = computed(() => Math.max(1, Math.ceil(cards.value.length / PAGE_SIZE)))
  const startIndex = computed(() => (currentPage.value - 1) * PAGE_SIZE)
  const paginadas = computed(() => cards.value.slice(startIndex.value, startIndex.value + PAGE_SIZE))
  const endIndex = computed(() => startIndex.value + paginadas.value.length)

  watch(totalPages, v => {
    if (currentPage.value > v) currentPage.value = v
  })
</script>

<template>
  <PageHeader subtitle="Escolha uma edição com inscrições abertas e abra a página dela para inscrever sua equipe" title="Inscreva-se em edições" />

  <div>
    <AsyncView
      :empty="!loading && !error && cards.length === 0"
      empty-message="Nenhuma edição com inscrições abertas no momento."
      :error="error"
      :loading="loading"
      @retry="run"
    >
      <ResultsBar :end="endIndex" :start="cards.length > 0 ? startIndex + 1 : 0" :total="cards.length" />

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-4">
        <eventCard v-for="h in paginadas" :key="h.id" v-bind="h" />
      </div>

      <AppPagination v-model="currentPage" :length="totalPages" />
    </AsyncView>
  </div>
</template>
