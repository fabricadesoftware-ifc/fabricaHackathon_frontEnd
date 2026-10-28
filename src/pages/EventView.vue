<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import EventDetailsHero from '@/components/layout/EventDetails/EventDetailsHero.vue'
import EventDetailsFacts from '@/components/layout/EventDetails/EventDetailsFacts.vue'
import EventDetailsSidebar from '@/components/layout/EventDetails/EventDetailsSidebar.vue'

import TeamsSection from '@/components/layout/TeamsSection'
import SponsorList from '@/components/ui/SponsorList'
import ProgressStepper from '@/components/ui/progressStepper.vue'
import { AsyncView } from '@/components/ui/AsyncView'

import { useAsync } from '@/composables/useAsync'
import { useAuthStore } from '@/stores/auth'

import { listarRanking, obterEdicao } from '@/services'
import { equipeParaCard, mapearStatus } from '@/types'

type Aba = 'visao' | 'equipes' | 'ranking'

const route = useRoute()
const auth = useAuthStore()

const edicaoId = computed(() => String(route.params.id))

const abaAtiva = ref<Aba>('visao')
const linkCopiado = ref(false)

let temporizador: ReturnType<typeof setTimeout> | null = null

// Dados da edição
const {
  data: edicao,
  loading,
  error,
  run,
} = useAsync(() => obterEdicao(edicaoId.value))

// Status atual
const status = computed(() =>
  edicao.value
    ? mapearStatus(edicao.value.status)
    : null,
)

// Permissão para inscrição
const podeInscrever = computed(() =>
  !auth.isAuthenticated ||
  auth.userRole === 'PARTICIPANTE',
)

// Etapas da edição
const STEPS = {
  inscricoes: 0,
  andamento: 1,
  avaliacao: 2,
  finalizado: 3,
} as const

const step = computed(() =>
  status.value ? STEPS[status.value] : 0,
)

// Equipes e projetos
const equipes = computed(() => {
  const e = edicao.value

  if (!e) return []

  return e.equipes.map(equipe =>
    equipeParaCard(equipe, {
      nome: e.nome,
      status: e.status,
    }),
  )
})

// Logos dos apoiadores
const patrocinadores = computed(() =>
  (edicao.value?.apoiadores ?? [])
    .filter(apoiador => apoiador.logo_apoiador)
    .map(apoiador => ({
      name: apoiador.nome,
      imageUrl: apoiador.logo_apoiador as string,
    })),
)

// Ranking
const ranking = useAsync(
  () => listarRanking(edicaoId.value),
  false,
)

// Abas disponíveis
const abas = computed<Array<{
  id: Aba
  label: string
  icon: string
}>>(() => {
  const items: Array<{
    id: Aba
    label: string
    icon: string
  }> = [
    {
      id: 'visao',
      label: 'Visão geral',
      icon: 'mdi-information-outline',
    },
    {
      id: 'equipes',
      label: `Equipes (${edicao.value?.equipes.length ?? 0})`,
      icon: 'mdi-account-group-outline',
    },
  ]

  if (status.value === 'finalizado') {
    items.push({
      id: 'ranking',
      label: 'Ranking',
      icon: 'mdi-trophy-outline',
    })
  }

  return items
})

// Compartilhar edição
async function compartilhar() {
  const url = window.location.href

  try {
    await navigator.clipboard.writeText(url)

    linkCopiado.value = true

    if (temporizador) {
      clearTimeout(temporizador)
    }

    temporizador = setTimeout(() => {
      linkCopiado.value = false
    }, 2500)
  } catch {
    // Alternativa quando a área de transferência
    // não está disponível no navegador.
    if (navigator.share) {
      try {
        await navigator.share({
          title: edicao.value?.nome,
          url,
        })
      } catch {
        // O usuário pode cancelar o compartilhamento.
      }
    } else {
      window.prompt('Copie o link da edição:', url)
    }
  }
}

// Atualiza ao navegar entre edições
watch(edicaoId, () => {
  abaAtiva.value = 'visao'
  linkCopiado.value = false

  void run()
})

// Só consulta o ranking quando a edição terminou
watch(status, novoStatus => {
  if (novoStatus === 'finalizado') {
    void ranking.run()
  }
})

onBeforeUnmount(() => {
  if (temporizador) {
    clearTimeout(temporizador)
  }
})
</script>

<template>
  <main
    class="mx-auto w-full max-w-7xl
           px-4 pb-12 pt-5 sm:px-6"
  >
    <AsyncView
      :error="error"
      :loading="loading"
      :lines="8"
      @retry="run"
    >
      <template v-if="edicao && status">

        <!-- Navegação -->
        <nav
          aria-label="Navegação da edição"
          class="mb-5 flex flex-wrap
                 items-center gap-2
                 text-sm text-slate-500"
        >
          <RouterLink
            to="/edicoes"
            class="transition-colors hover:text-blue-600"
          >
            Edições
          </RouterLink>

          <span
            class="mdi mdi-chevron-right text-base"
            aria-hidden="true"
          />

          <span class="font-medium text-slate-800">
            {{ edicao.nome }}
          </span>
        </nav>

        <!-- Capa e título -->
        <EventDetailsHero
          :edicao="edicao"
          :status="status"
          :pode-inscrever="podeInscrever"
          :link-copiado="linkCopiado"
          @compartilhar="compartilhar"
        />

        <!-- Informações essenciais -->
        <div class="mt-4">
          <EventDetailsFacts :edicao="edicao" />
        </div>

        <!-- Abas -->
        <nav
          aria-label="Seções da edição"
          class="mt-7 flex gap-2 overflow-x-auto
                 border-b border-slate-200"
        >
          <button
            v-for="aba in abas"
            :key="aba.id"
            type="button"
            :aria-pressed="abaAtiva === aba.id"
            :class="[
              'inline-flex min-h-11 shrink-0 items-center',
              'gap-2 border-b-2 px-4 py-3',
              'text-sm font-medium transition-colors',

              abaAtiva === aba.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800',
            ]"
            @click="abaAtiva = aba.id"
          >
            <span
              :class="['mdi', aba.icon]"
              class="text-lg"
              aria-hidden="true"
            />

            {{ aba.label }}
          </button>
        </nav>

        <!-- ================================= -->
        <!-- VISÃO GERAL                       -->
        <!-- ================================= -->

        <div
          v-if="abaAtiva === 'visao'"
          class="mt-6 grid grid-cols-1
                 items-start gap-5
                 lg:grid-cols-[minmax(0,1.65fr)_minmax(300px,1fr)]"
        >
          <!-- Coluna principal -->
          <div class="min-w-0 space-y-5">

            <!-- Sobre a edição -->
            <section
              class="rounded-lg border border-slate-200
                     bg-white p-5 sm:p-6"
            >
              <h2
                class="text-lg font-semibold
                       tracking-tight text-slate-900"
              >
                Sobre o {{ edicao.nome }}
              </h2>

              <p
                class="mt-3 whitespace-pre-line
                       text-sm leading-6 text-slate-600"
              >
                {{
                  edicao.descricao ||
                  'Esta edição ainda não possui uma descrição.'
                }}
              </p>

              <!-- Critérios -->
              <div
                v-if="edicao.criterios.length"
                class="mt-6"
              >
                <h3
                  class="text-sm font-semibold
                         text-slate-900"
                >
                  Critérios de avaliação
                </h3>

                <div class="mt-3 flex flex-wrap gap-2">
                  <span
                    v-for="criterio in edicao.criterios"
                    :key="criterio.id"
                    class="rounded-full bg-blue-50
                           px-3 py-1.5 text-xs
                           font-medium text-blue-700"
                  >
                    {{ criterio.nome }}
                  </span>
                </div>
              </div>
            </section>

            <!-- Etapas -->
            <section
              class="rounded-lg border border-slate-200
                     bg-white p-5 sm:p-6"
            >
              <h2
                class="text-base font-semibold text-slate-900"
              >
                Etapas da edição
              </h2>

              <p class="mt-1 text-sm text-slate-500">
                Acompanhe a etapa atual do hackathon.
              </p>

              <div class="mt-5 overflow-x-auto">
                <div class="min-w-[500px]">
                  <ProgressStepper
                    :current-step="step"
                    :steps="[
                      'Inscrições',
                      'Andamento',
                      'Avaliação',
                      'Finalizado',
                    ]"
                  />
                </div>
              </div>
            </section>

            <!-- Apoiadores -->
            <section
              v-if="patrocinadores.length"
              class="rounded-lg border border-slate-200
                     bg-white p-5 sm:p-6"
            >
              <h2
                class="mb-4 text-base font-semibold
                       text-slate-900"
              >
                Apoiadores
              </h2>

              <SponsorList :images="patrocinadores" />
            </section>

          </div>

          <!-- Coluna lateral -->
          <EventDetailsSidebar
            :edicao="edicao"
            :status="status"
            :pode-inscrever="podeInscrever"
            @ver-equipes="abaAtiva = 'equipes'"
          />
        </div>

        <!-- ================================= -->
        <!-- EQUIPES                           -->
        <!-- ================================= -->

        <section
          v-else-if="abaAtiva === 'equipes'"
          class="mt-6"
        >
          <TeamsSection
            :items="equipes"
            title="Equipes participantes"
          />
        </section>

        <!-- ================================= -->
        <!-- RANKING                           -->
        <!-- ================================= -->

        <section
          v-else-if="
            abaAtiva === 'ranking' &&
            status === 'finalizado'
          "
          class="mt-6"
        >
          <div
            class="rounded-lg border border-slate-200
                   bg-white p-5 sm:p-6"
          >
            <h2
              class="mb-5 text-lg font-semibold
                     text-slate-900"
            >
              Ranking da edição
            </h2>

            <AsyncView
              :loading="ranking.loading.value"
              :error="ranking.error.value"
              :empty="
                !ranking.loading.value &&
                !ranking.error.value &&
                (ranking.data.value?.length ?? 0) === 0
              "
              empty-message="O ranking ainda não está disponível."
              @retry="ranking.run"
            >
              <ol class="space-y-3">
                <li
                  v-for="item in ranking.data.value"
                  :key="item.projeto_id"
                  class="flex items-center gap-4
                         rounded-lg border
                         border-slate-200 px-4 py-3"
                >
                  <!-- Posição -->
                  <span
                    class="flex h-10 w-10 shrink-0
                           items-center justify-center
                           rounded-lg bg-blue-50
                           text-base font-bold
                           text-blue-700"
                  >
                    {{ item.posicao }}º
                  </span>

                  <!-- Projeto -->
                  <div class="min-w-0 flex-1">
                    <h3
                      class="truncate text-sm font-semibold
                             text-slate-900"
                    >
                      {{ item.projeto }}
                    </h3>

                    <p class="text-xs text-slate-500">
                      {{ item.equipe }}
                    </p>
                  </div>

                  <!-- Nota -->
                  <span
                    class="text-base font-semibold
                           text-blue-600"
                  >
                    {{ item.nota_final }}
                  </span>
                </li>
              </ol>
            </AsyncView>
          </div>
        </section>

      </template>
    </AsyncView>
  </main>
</template>