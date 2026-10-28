<script setup lang="ts">
import { computed, watch } from 'vue'
import { RouterLink } from 'vue-router'

import HomeSectionHeader from '@/components/layout/HomeSectionHeader/HomeSectionHeader.vue'

import EventCard from '@/components/ui/eventCard.vue'
import ProjectCard from '@/components/ui/projectCard.vue'
import { AsyncView } from '@/components/ui/AsyncView'

import { useAsync } from '@/composables/useAsync'
import { useAuthStore } from '@/stores/auth'

import {
  listarMinhasEquipes,
  listarMeusProjetos,
} from '@/services/inscricoes'

import type {
  MeuProjeto,
  MinhaEquipe,
  StatusEdicao,
} from '@/services/inscricoes'

import type { Edicao } from '@/types'
import { edicaoParaCard } from '@/types'

const props = defineProps<{
  edicoes: Edicao[]
}>()

const authStore = useAuthStore()

// A área pessoal aparece somente para participantes.
const podeExibir = computed(() =>
  authStore.isAuthenticated &&
  authStore.userRole === 'PARTICIPANTE',
)

// Dados pessoais do usuário autenticado.
const {
  data,
  loading,
  error,
  run,
} = useAsync(async () => {
  const [equipes, projetos] = await Promise.all([
    listarMinhasEquipes(),
    listarMeusProjetos(),
  ])

  return {
    equipes,
    projetos,
  }
}, false)

// Carrega os dados quando o participante estiver autenticado.
watch(
  podeExibir,
  (permitido) => {
    if (permitido) {
      void run()
    } else {
      data.value = null
    }
  },
  { immediate: true },
)

// Prioridade dos status.
const prioridadeStatus: Record<StatusEdicao, number> = {
  EM_ANDAMENTO: 0,
  INSCRICAO: 1,
  AVALIACAO: 2,
  FINALIZADO: 3,
}

// Identifica projetos que ainda não foram finalizados.
const projetosAtivos = computed(() =>
  (data.value?.projetos ?? []).filter(
    projeto => projeto.edicao_status !== 'FINALIZADO',
  ),
)

// Controla a exibição do quadrado de projeto ativo.
const temProjetoAtivo = computed(() =>
  projetosAtivos.value.length > 0,
)

// Seleciona o projeto mais relevante.
// Projetos ativos têm prioridade sobre os finalizados.
const projetoDestaque = computed<MeuProjeto | null>(() => {
  const projetos = data.value?.projetos ?? []

  return [...projetos].sort(
    (a, b) =>
      prioridadeStatus[a.edicao_status] -
      prioridadeStatus[b.edicao_status],
  )[0] ?? null
})

// Seleciona a equipe vinculada ao projeto destacado.
// Se não houver projeto, utiliza uma equipe existente.
const equipeDestaque = computed<MinhaEquipe | null>(() => {
  const equipes = data.value?.equipes ?? []

  if (projetoDestaque.value) {
    const equipeDoProjeto = equipes.find(
      equipe =>
        equipe.id === projetoDestaque.value?.equipe.id,
    )

    if (equipeDoProjeto) {
      return equipeDoProjeto
    }
  }

  return [...equipes].sort(
    (a, b) =>
      prioridadeStatus[a.edicao_status] -
      prioridadeStatus[b.edicao_status],
  )[0] ?? null
})

// Edição vinculada à equipe destacada.
const edicaoDestaque = computed<Edicao | null>(() => {
  const equipe = equipeDestaque.value

  if (!equipe) return null

  return props.edicoes.find(
    edicao => edicao.id === equipe.edicao,
  ) ?? null
})

// Edição vinculada ao projeto destacado.
const edicaoDoProjeto = computed<Edicao | null>(() => {
  const projeto = projetoDestaque.value

  if (!projeto) return null

  return props.edicoes.find(
    edicao => edicao.id === projeto.edicao,
  ) ?? null
})

// Nome apresentado no status do projeto.
const statusLabel = computed(() => {
  switch (projetoDestaque.value?.edicao_status) {
    case 'INSCRICAO':
      return 'Inscrições abertas'

    case 'EM_ANDAMENTO':
      return 'Em andamento'

    case 'AVALIACAO':
      return 'Em avaliação'

    case 'FINALIZADO':
      return 'Finalizado'

    default:
      return 'Projeto'
  }
})

// Converte o projeto para o formato do ProjectCard.
const itemProjeto = computed(() => {
  const projeto = projetoDestaque.value

  if (!projeto) return null

  const finalizado = projeto.edicao_status === 'FINALIZADO'

  return {
    title: projeto.nome_projeto,

    description: projeto.descricao_projeto ?? '',

    team: projeto.equipe.nome_equipe,

    event:
      edicaoDoProjeto.value?.nome ??
      `Edição ${projeto.edicao}`,

    logo: projeto.logo_projeto ?? '',

    cover: edicaoDoProjeto.value?.imagem_capa ?? null,

    status: finalizado
      ? 'finalizado' as const
      : 'ativo' as const,

    statusLabel: statusLabel.value,

    deployUrl: projeto.link_deploy_projeto,

    notaFinal: finalizado
      ? projeto.nota_final
      : null,
  }
})
</script>

<template>
  <section
    v-if="podeExibir"
    aria-labelledby="titulo-minha-participacao"
  >
    <HomeSectionHeader
      title="Minhas edições e projetos"
      subtitle="Acompanhe as edições e os projetos de que você participa."
      to="/projetos"
      link-text="Ver meus projetos"
    />

    <AsyncView
      :loading="loading"
      :error="error"
      skeleton="cards"
      :skeleton-count="3"
      @retry="run"
    >
      <div
        class="grid grid-cols-[repeat(auto-fill,minmax(min(100%,280px),1fr))] gap-5"
      >
        <!-- Minha edição -->
        <EventCard
          v-if="edicaoDestaque"
          v-bind="edicaoParaCard(edicaoDestaque)"
          class="w-full max-w-[360px]"
        />

        <!-- Meu projeto -->
        <ProjectCard
          v-if="itemProjeto"
          v-bind="itemProjeto"
          class="w-full max-w-[360px]"
        />

        <!-- Aparece apenas quando não existe projeto ativo -->
        <RouterLink
          v-if="!temProjetoAtivo"
          to="/edicoes"
          class="group flex min-h-64 w-full max-w-[360px] flex-col items-center
                 justify-center rounded-lg border
                 border-dashed border-blue-200
                 bg-blue-50/30 px-6 py-8 text-center
                 transition-colors
                 hover:border-blue-400 hover:bg-blue-50"
        >
          <!-- Ícone -->
          <span
            class="mb-4 flex h-12 w-12
                   items-center justify-center
                   rounded-full border border-blue-200
                   bg-white text-blue-600"
          >
            <span
              class="mdi mdi-plus text-2xl"
              aria-hidden="true"
            />
          </span>

          <!-- Título -->
          <h3
            class="text-sm font-semibold text-slate-900"
          >
            Ainda não tem um projeto ativo?
          </h3>

          <!-- Descrição -->
          <p
            class="mt-2 max-w-56 text-sm leading-5
                   text-slate-500"
          >
            Participe de uma edição e desenvolva
            seu projeto com uma equipe.
          </p>

          <!-- Ação -->
          <span
            class="mt-5 inline-flex items-center
                   rounded-lg border border-blue-200
                   bg-white px-4 py-2
                   text-sm font-medium text-blue-600
                   transition-colors
                   group-hover:bg-blue-50"
          >
            Explorar edições
          </span>
        </RouterLink>
      </div>
    </AsyncView>
  </section>
</template>
