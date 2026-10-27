<script setup lang="ts">
import { computed, ref } from 'vue'

// Componentes
import HeroSection from '@/components/ui/HeroSection/heroSection.vue'
import EventCard from '@/components/ui/eventCard.vue'
import FilterChipGroup from '@/components/ui/FilterChipGroup/FilterChipGroup.vue'

import HomeSectionHeader from '@/components/layout/HomeSectionHeader/HomeSectionHeader.vue'
import HomeParticipantSection from '@/components/layout/HomeParticipantSection/HomeParticipantSection.vue'
import CardGrid from '@/components/layout/CardGrid/CardGrid.vue'

import { AsyncView } from '@/components/ui/AsyncView'

// Composables
import { useAsync } from '@/composables/useAsync'

// Serviços
import {
  listarTodasEdicoes,
  listarTodosProjetos,
} from '@/services'

// Tipos e mapeadores
import {
  edicaoParaCard,
  projetoParaCard,
} from '@/types'

import type { EdicaoStatusApi } from '@/types'

// Quantidade de itens nas seções de destaque
const EDICOES_EM_DESTAQUE = 3
const PROJETOS_EM_DESTAQUE = 3

// Filtros
const selectedFilter = ref('all')
const search = ref('')

// Busca os dados públicos da Home
const {
  data,
  loading,
  error,
  run,
} = useAsync(async () => {
  const [edicoes, projetos] = await Promise.all([
    listarTodasEdicoes(),
    listarTodosProjetos(),
  ])

  return {
    edicoes,
    projetos,
  }
})

// Busca do HeroSection
const termoBusca = computed(() =>
  search.value.trim().toLowerCase(),
)

// Índice das edições para associar aos projetos
const edicaoPorId = computed(() =>
  new Map(
    (data.value?.edicoes ?? []).map(edicao => [
      edicao.id,
      edicao,
    ]),
  ),
)

// Prioridade para exibição das edições
const prioridadeStatus: Record<EdicaoStatusApi, number> = {
  INSCRICAO: 0,
  EM_ANDAMENTO: 1,
  AVALIACAO: 2,
  FINALIZADO: 3,
}

// Verifica se a edição corresponde à busca
function correspondeBuscaEdicao(edicao: {
  nome: string
  local: string
  tipo_edicao: string
  ano: number
}) {
  const termo = termoBusca.value

  if (!termo) return true

  return [
    edicao.nome,
    edicao.local,
    edicao.tipo_edicao,
    edicao.ano,
  ]
    .join(' ')
    .toLowerCase()
    .includes(termo)
}

// ==============================
// INSCRIÇÕES ABERTAS
// ==============================

// Recupera somente edições com inscrições abertas
const edicoesAbertas = computed(() =>
  (data.value?.edicoes ?? [])
    .filter(edicao => edicao.status === 'INSCRICAO')
    .filter(correspondeBuscaEdicao)
    .sort((a, b) =>
      a.data_inicio.localeCompare(b.data_inicio),
    )
    .map(edicao => edicaoParaCard(edicao)),
)

// ==============================
// EDIÇÕES EM DESTAQUE
// ==============================

// Outras edições, sem repetir as inscrições abertas
const edicoesDestaque = computed(() =>
  [...(data.value?.edicoes ?? [])]
    .filter(edicao => edicao.status !== 'INSCRICAO')
    .filter(correspondeBuscaEdicao)
    .sort((a, b) => {
      const prioridade =
        prioridadeStatus[a.status] -
        prioridadeStatus[b.status]

      if (prioridade !== 0) {
        return prioridade
      }

      return b.data_inicio.localeCompare(a.data_inicio)
    })
    .slice(0, EDICOES_EM_DESTAQUE)
    .map(edicao => edicaoParaCard(edicao)),
)

// ==============================
// FILTROS DOS PROJETOS
// ==============================

// Tipos de edição disponíveis
const tipos = computed(() =>
  [
    ...new Set(
      (data.value?.edicoes ?? [])
        .map(edicao => edicao.tipo_edicao)
        .filter(Boolean),
    ),
  ],
)

// Opções apresentadas nos chips
const filters = computed(() => [
  {
    label: 'Todos',
    value: 'all',
  },
  ...tipos.value.map(tipo => ({
    label: tipo,
    value: tipo,
  })),
])

// ==============================
// PROJETOS DA COMUNIDADE
// ==============================

const projetosComunidade = computed(() => {
  const termo = termoBusca.value

  return (data.value?.projetos ?? [])
    .filter(projeto => {
      const edicao = edicaoPorId.value.get(projeto.edicao)

      // Filtro por tipo de edição
      const correspondeTipo =
        selectedFilter.value === 'all' ||
        edicao?.tipo_edicao === selectedFilter.value

      // Busca por projeto, equipe ou edição
      const correspondeBusca =
        !termo ||
        [
          projeto.nome_projeto,
          projeto.descricao_projeto,
          projeto.nome_equipe,
          edicao?.nome ?? '',
        ]
          .join(' ')
          .toLowerCase()
          .includes(termo)

      return correspondeTipo && correspondeBusca
    })
    .slice(0, PROJETOS_EM_DESTAQUE)
    .map(projeto => {
      const edicao = edicaoPorId.value.get(projeto.edicao)

      return {
        ...projetoParaCard(projeto, edicao),

        // Capa da edição utilizada no ProjectCard
        cover: edicao?.imagem_capa ?? null,
      }
    })
})
</script>

<template>
  <div class="pb-10">

    <!-- ================================== -->
    <!-- HERO SECTION ORIGINAL              -->
    <!-- ================================== -->

    <HeroSection
      v-model="search"
      highlight="HackIFC // 24H"
      subtitle="Acompanhe as edições, inscreva sua equipe e conheça os projetos feitos por estudantes."
      title="Desenvolva, colabore e inove no"
    />

    <!-- Conteúdo principal -->
    <div class="mt-8 space-y-12 px-1 sm:px-6">

      <!-- ================================== -->
      <!-- MINHAS EDIÇÕES E PROJETOS           -->
      <!-- ================================== -->

      <HomeParticipantSection
        :edicoes="data?.edicoes ?? []"
      />

      <!-- ================================== -->
      <!-- INSCRIÇÕES ABERTAS                 -->
      <!-- ================================== -->

      <section aria-label="Inscrições abertas">

        <HomeSectionHeader
          title="Inscrições abertas"
          subtitle="Encontre uma edição para participar com sua equipe."
          to="/edicoes"
          link-text="Ver todas as edições"
        />

        <AsyncView
          :loading="loading"
          :error="error"
          :empty="
            !loading &&
            !error &&
            edicoesAbertas.length === 0
          "
          :empty-message="
            termoBusca
              ? 'Nenhuma inscrição aberta corresponde à sua busca.'
              : 'Nenhuma edição com inscrições abertas no momento.'
          "
          skeleton="cards"
          :skeleton-count="3"
          @retry="run"
        >
          <div
            class="grid grid-cols-1 gap-5
                   sm:grid-cols-2 xl:grid-cols-3"
          >
            <EventCard
              v-for="edicao in edicoesAbertas"
              :key="edicao.id"
              v-bind="edicao"
            />
          </div>
        </AsyncView>

      </section>

      <!-- ================================== -->
      <!-- EDIÇÕES EM DESTAQUE                -->
      <!-- ================================== -->

      <section
        v-if="loading || error || edicoesDestaque.length > 0"
        aria-label="Edições em destaque"
      >

        <HomeSectionHeader
          title="Edições em destaque"
          subtitle="Acompanhe os hackathons em andamento e outras edições."
          to="/edicoes"
          link-text="Ver todas as edições"
        />

        <AsyncView
          :loading="loading"
          :error="error"
          :empty="
            !loading &&
            !error &&
            edicoesDestaque.length === 0
          "
          empty-message="Nenhuma edição encontrada."
          skeleton="cards"
          :skeleton-count="3"
          @retry="run"
        >
          <div
            class="grid grid-cols-1 gap-5
                   sm:grid-cols-2 xl:grid-cols-3"
          >
            <EventCard
              v-for="edicao in edicoesDestaque"
              :key="edicao.id"
              v-bind="edicao"
            />
          </div>
        </AsyncView>

      </section>

      <!-- Separador -->
      <div
        class="border-t border-slate-200"
        aria-hidden="true"
      />

      <!-- ================================== -->
      <!-- PROJETOS DA COMUNIDADE             -->
      <!-- ================================== -->

      <section aria-label="Projetos da comunidade">

        <HomeSectionHeader
          title="Projetos da comunidade"
          subtitle="Conheça as soluções desenvolvidas nas edições do HackIFC."
          to="/explorar"
          link-text="Ver todos os projetos"
        />

        <!-- Filtros -->
        <div class="mb-5">
          <FilterChipGroup
            v-model="selectedFilter"
            :options="filters"
          />
        </div>

        <!-- Projetos -->
        <AsyncView
          :loading="loading"
          :error="error"
          :empty="
            !loading &&
            !error &&
            projetosComunidade.length === 0
          "
          :empty-message="
            termoBusca
              ? 'Nenhum projeto encontrado para sua busca.'
              : 'Nenhum projeto encontrado.'
          "
          skeleton="cards"
          :skeleton-count="3"
          @retry="run"
        >
          <CardGrid
            :items="projetosComunidade"
            :columns="3"
          />
        </AsyncView>

      </section>

    </div>
  </div>
</template>