<script setup lang="ts">
  import type { EdicaoStatusApi } from '@/types'

  import { computed, ref } from 'vue'
  import CardGrid from '@/components/layout/CardGrid/CardGrid.vue'
  import HomeParticipantSection from '@/components/layout/HomeParticipantSection/HomeParticipantSection.vue'
  import HomeSectionHeader from '@/components/layout/HomeSectionHeader/HomeSectionHeader.vue'
  import { AsyncView } from '@/components/ui/AsyncView'
  import EventCard from '@/components/ui/eventCard.vue'
  import FilterChipGroup from '@/components/ui/FilterChipGroup/FilterChipGroup.vue'
  // Componentes
  import HeroSection from '@/components/ui/HeroSection/heroSection.vue'
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
  function correspondeBuscaEdicao (edicao: {
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
      .filter(edicao => correspondeBuscaEdicao(edicao))
      // O alvo TypeScript do projeto ainda não inclui Array.toSorted.
      // eslint-disable-next-line unicorn/no-array-sort
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
      .filter(edicao => correspondeBuscaEdicao(edicao))
      // O alvo TypeScript do projeto ainda não inclui Array.toSorted.
      // eslint-disable-next-line unicorn/no-array-sort
      .sort((a, b) => {
        const prioridade
          = prioridadeStatus[a.status]
            - prioridadeStatus[b.status]

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
        const correspondeTipo
          = selectedFilter.value === 'all'
            || edicao?.tipo_edicao === selectedFilter.value

        // Busca por projeto, equipe ou edição
        const correspondeBusca
          = !termo
            || [
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
  <div class="home-view @container/home w-full min-w-0 pb-10 text-[#0f172a]">
    <a class="absolute w-px h-px [overflow:hidden] [clip-path:inset(50%)] focus:relative focus:inline-flex focus:items-center focus:min-h-11 focus:w-auto focus:h-auto focus:p-2 focus:overflow-visible focus:[clip-path:none] focus:text-[#1d4ed8]" href="#home-content">Ir para as edições e projetos</a>

    <HeroSection
      v-model="search"
      :photo="{
        src: '/images/ifc-araquari-aerial.webp',
        alt: 'Vista aérea do IFC Campus Araquari, com os prédios acadêmicos e áreas verdes',
      }"
      subtitle="Encontre edições para participar, forme sua equipe e transforme ideias em projetos reais no HackIFC."
      title="Ideias, tecnologia&#10;e colaboração"
    />

    <!-- Conteúdo principal -->
    <div id="home-content" class="home-content scroll-mt-8 mt-8 space-y-10" tabindex="-1">
      <p aria-live="polite" class="sr-only" role="status">
        {{ loading ? 'Carregando edições e projetos…' : error ? 'Não foi possível carregar edições e projetos.' : `Edições com inscrições abertas nesta busca: ${edicoesAbertas.length}. Projetos em destaque: ${projetosComunidade.length}.` }}
      </p>

      <!-- ================================== -->
      <!-- MINHAS EDIÇÕES E PROJETOS           -->
      <!-- ================================== -->

      <HomeParticipantSection
        :edicoes="data?.edicoes ?? []"
      />

      <div
        class="home-editions grid gap-10"
        :class="{ '[@container_home_(min-width:850px)]:grid-cols-2 [@container_home_(min-width:850px)]:gap-y-0 [@container_home_(min-width:850px)]:[&>section]:grid [@container_home_(min-width:850px)]:[&>section]:grid-rows-subgrid [@container_home_(min-width:850px)]:[&>section]:row-span-2': !loading && !error && edicoesAbertas.length === 1 && edicoesDestaque.length === 1 }"
      >
        <!-- ================================== -->
        <!-- INSCRIÇÕES ABERTAS                 -->
        <!-- ================================== -->

        <section id="inscricoes" aria-label="Inscrições abertas">

          <HomeSectionHeader
            link-text="Ver todas as edições"
            subtitle="Encontre uma edição para participar com sua equipe."
            title="Inscrições abertas"
            to="/edicoes"
          />

          <AsyncView
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
            :error="error"
            :loading="loading"
            skeleton="cards"
            :skeleton-count="3"
            @retry="run"
          >
            <div
              class="grid grid-cols-[repeat(auto-fill,minmax(min(100%,280px),1fr))] gap-5"
            >
              <EventCard
                v-for="edicao in edicoesAbertas"
                :key="edicao.id"
                v-bind="edicao"
                class="w-full"
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
            link-text="Ver todas as edições"
            subtitle="Acompanhe os hackathons em andamento e outras edições."
            title="Edições em destaque"
            to="/edicoes"
          />

          <AsyncView
            :empty="
              !loading &&
                !error &&
                edicoesDestaque.length === 0
            "
            empty-message="Nenhuma edição encontrada."
            :error="error"
            :loading="loading"
            skeleton="cards"
            :skeleton-count="3"
            @retry="run"
          >
            <div
              class="grid grid-cols-[repeat(auto-fill,minmax(min(100%,280px),1fr))] gap-5"
            >
              <EventCard
                v-for="edicao in edicoesDestaque"
                :key="edicao.id"
                v-bind="edicao"
                class="w-full"
              />
            </div>
          </AsyncView>

        </section>

      </div>

      <!-- Separador -->
      <div
        aria-hidden="true"
        class="border-t border-slate-200"
      />

      <!-- ================================== -->
      <!-- PROJETOS DA COMUNIDADE             -->
      <!-- ================================== -->

      <section id="projetos" aria-label="Projetos das edições">

        <HomeSectionHeader
          link-text="Ver todos os projetos"
          subtitle="Conheça as soluções desenvolvidas nas edições do HackIFC."
          title="Projetos das edições"
          to="/explorar"
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
          :error="error"
          :loading="loading"
          skeleton="cards"
          :skeleton-count="3"
          @retry="run"
        >
          <CardGrid
            compact
            :items="projetosComunidade"
          />
        </AsyncView>

      </section>

    </div>
  </div>
</template>

<style scoped>
@media (prefers-reduced-motion: reduce) {
  .home-view :deep(.animate-pulse) { animation: none; }
}
.home-view section[id] { scroll-margin-top: 6rem; }
.home-view :deep(::selection) { background: #dbeafe; color: #1e3a8a; }
.home-view :deep(a:focus-visible), .home-view :deep(button:focus-visible) { outline: 2px solid #2563eb; outline-offset: 4px; }
</style>
