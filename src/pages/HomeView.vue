<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { RouterLink } from 'vue-router'
  import CardGridSkeleton from '@/components/ui/LoadingSkeleton/CardGridSkeleton.vue'
  import CardGrid from '@/components/layout/CardGrid/CardGrid.vue'
  import Section from '@/components/layout/Section/Section.vue'
  import { AsyncView } from '@/components/ui/AsyncView'
  import FilterChipGroup from '@/components/ui/FilterChipGroup/FilterChipGroup.vue'
  import HeroSection from '@/components/ui/HeroSection/heroSection.vue'
  import { useAsync } from '@/composables/useAsync'
  import eventCard from '@/components/ui/eventCard.vue'
  import { listarTodasEdicoes, listarTodosProjetos } from '@/services'
  import { edicaoParaCard, projetoParaCard } from '@/types'

  const PROJETOS_POR_SECAO = 4

  const selectedFilter = ref('all')
  const search = ref('')

  const { data, loading, error, run } = useAsync(async () => {
    const [edicoes, projetos] = await Promise.all([listarTodasEdicoes(), listarTodosProjetos()])
    return { edicoes, projetos }
  })

  // Prioridade da Home: edições com inscrições abertas.
  const termoBusca = computed(() => search.value.trim().toLowerCase())

  // A busca do topo da Home filtra as edições abertas e os projetos ao mesmo tempo.
  const abertas = computed(() =>
    (data.value?.edicoes ?? [])
      .filter(e => e.status === 'INSCRICAO')
      .filter(e => !termoBusca.value || `${e.nome} ${e.local} ${e.tipo_edicao} ${e.ano}`.toLowerCase().includes(termoBusca.value))
      .map(e => edicaoParaCard(e)),
  )

  // Uma seção por tipo de edição (ex.: "2º Ano"), alimentada pelos projetos reais.
  const tipos = computed(() => [...new Set((data.value?.edicoes ?? []).map(e => e.tipo_edicao).filter(Boolean))])

  const filters = computed(() => [
    { label: 'Todos', value: 'all' },
    ...tipos.value.map(t => ({ label: t, value: t })),
  ])

  const secoes = computed(() => {
    const edicoes = new Map((data.value?.edicoes ?? []).map(e => [e.id, e]))
    const termo = termoBusca.value

    return tipos.value
      .filter(tipo => selectedFilter.value === 'all' || selectedFilter.value === tipo)
      .map(tipo => {
        const itens = (data.value?.projetos ?? [])
          .filter(p => edicoes.get(p.edicao)?.tipo_edicao === tipo)
          .filter(p => !termo || `${p.nome_projeto} ${p.nome_equipe}`.toLowerCase().includes(termo))
          .map(p => projetoParaCard(p, edicoes.get(p.edicao)))
        return { tipo, itens: itens.slice(0, PROJETOS_POR_SECAO) }
      })
      .filter(secao => secao.itens.length > 0)
  })
</script>

<template>
  <HeroSection
    v-model="search"
    highlight="HackIFC // 24H"
    subtitle="Acompanhe as edições, inscreva sua equipe e conheça os projetos feitos por estudantes."
    title="Desenvolva, colabore e inove no"
  />

  <!-- Inscrições abertas: o que mais importa para quem chega -->
  <section aria-labelledby="titulo-abertas" class="px-1 sm:px-6">
    <div class="mb-3 flex items-center justify-between">
      <h2 id="titulo-abertas" class="flex items-center gap-2 text-lg font-semibold text-gray-900">
        <span class="relative flex h-2.5 w-2.5">
          <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
          <span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
        </span>
        Inscrições abertas
      </h2>
      <RouterLink class="text-sm font-medium text-blue-600 hover:underline" to="/edicoes">Ver todas as edições</RouterLink>
    </div>

    <CardGridSkeleton v-if="loading" :count="3" />
    <div v-else-if="abertas.length" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <eventCard v-for="e in abertas" :key="e.id" v-bind="e" />
    </div>
    <p v-else-if="!error" class="rounded-lg border border-dashed border-gray-300 px-4 py-6 text-center text-sm text-gray-500">
      {{ termoBusca ? `Nenhuma edição aberta combina com “${search.trim()}”.` : 'Nenhuma edição com inscrições abertas no momento.' }}
    </p>
  </section>

  <!-- Projetos -->
  <div class="mt-8 px-1 sm:px-6">
    <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
      <h2 class="text-lg font-semibold text-gray-900">Projetos das edições</h2>
      <FilterChipGroup v-model="selectedFilter" :options="filters" />
    </div>

    <AsyncView
      :empty="!loading && !error && secoes.length === 0"
      :empty-message="termoBusca ? `Nenhum projeto encontrado para “${search.trim()}”.` : 'Nenhum projeto encontrado.'"
      :error="error"
      :loading="loading"
      skeleton="cards"
      @retry="run"
    >
      <div v-for="secao in secoes" :key="secao.tipo" class="mb-8">
        <Section link-text="Ver todos" :title="secao.tipo" to="/explorar">
          <CardGrid :items="secao.itens" />
        </Section>
      </div>
    </AsyncView>
  </div>
</template>
