<script setup lang="ts">
  import { computed, ref } from 'vue'
  import CardGrid from '@/components/layout/CardGrid/CardGrid.vue'
  import Section from '@/components/layout/Section/Section.vue'
  import { AsyncView } from '@/components/ui/AsyncView'
  import FilterChipGroup from '@/components/ui/FilterChipGroup/FilterChipGroup.vue'
  import HeroSection from '@/components/ui/HeroSection/heroSection.vue'
  import { useAsync } from '@/composables/useAsync'
  import { listarTodasEdicoes, listarTodosProjetos } from '@/services'
  import { projetoParaCard } from '@/types'

  const PROJETOS_POR_SECAO = 4

  const selectedFilter = ref('all')
  const search = ref('')

  const { data, loading, error, run } = useAsync(async () => {
    const [edicoes, projetos] = await Promise.all([listarTodasEdicoes(), listarTodosProjetos()])
    return { edicoes, projetos }
  })

  // Uma seção por tipo de edição (ex.: "2º Ano"), alimentada pelos projetos reais.
  const tipos = computed(() => [...new Set((data.value?.edicoes ?? []).map(e => e.tipo_edicao).filter(Boolean))])

  const filters = computed(() => [
    { label: 'Todos', value: 'all' },
    ...tipos.value.map(t => ({ label: t, value: t })),
  ])

  const secoes = computed(() => {
    const edicoes = new Map((data.value?.edicoes ?? []).map(e => [e.id, e]))
    const termo = search.value.trim().toLowerCase()

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
    subtitle="Desenvolva, colabore e inove no HackIFC // 24H"
    title="Desenvolva, colabore e inove no HackIFC // 24H"
  />

  <div class="flex justify-center w-full">
    <FilterChipGroup v-model="selectedFilter" :options="filters" />
  </div>

  <div class="gap-10 mt-10">
    <AsyncView
      :empty="!loading && !error && secoes.length === 0"
      empty-message="Nenhum projeto encontrado."
      :error="error"
      :loading="loading"
      @retry="run"
    >
      <div v-for="secao in secoes" :key="secao.tipo" class="p-6">
        <Section link-text="Ver todos" :title="secao.tipo" to="/explorar">
          <CardGrid :items="secao.itens" />
        </Section>
      </div>
    </AsyncView>
  </div>
</template>
