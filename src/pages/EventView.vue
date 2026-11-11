<script setup lang="ts">
  import {
    computed,
    onBeforeUnmount,
    ref,
    watch,
  } from 'vue'
  import {
    RouterLink,
    useRoute,
  } from 'vue-router'

  import EventDetailsFacts from '@/components/layout/EventDetails/EventDetailsFacts.vue'
  // Componentes da edição
  import EventDetailsHero from '@/components/layout/EventDetails/EventDetailsHero.vue'
  import EventDetailsSidebar from '@/components/layout/EventDetails/EventDetailsSidebar.vue'
  // Componentes reutilizáveis
  import TeamsSection from '@/components/layout/TeamsSection'
  import { AsyncView } from '@/components/ui/AsyncView'
  import ProgressStepper from '@/components/ui/progressStepper.vue'
  import SponsorList from '@/components/ui/SponsorList'
  // Composables e stores
  import { useAsync } from '@/composables/useAsync'
  // Serviços e mapeadores
  import {
    listarRanking,
    obterEdicao,
  } from '@/services'
  import { useAuthStore } from '@/stores/auth'
  import {
    equipeParaCard,
    mapearStatus,
  } from '@/types'

  type Aba = 'visao' | 'equipes' | 'ranking'

  const route = useRoute()
  const auth = useAuthStore()

  // Edição acessada pela rota
  const edicaoId = computed(() =>
    String(route.params.id),
  )

  // Controle das abas
  const abaAtiva = ref<Aba>('visao')

  // Compartilhamento
  const linkCopiado = ref(false)

  let temporizador: ReturnType<typeof setTimeout> | null = null

  // ==============================
  // DADOS DA EDIÇÃO
  // ==============================

  const {
    data: edicao,
    loading,
    error,
    run,
  } = useAsync(() =>
    obterEdicao(edicaoId.value),
  )

  // Status atual da edição
  const status = computed(() =>
    edicao.value
      ? mapearStatus(edicao.value.status)
      : null,
  )

  // Permissão para inscrição
  const podeInscrever = computed(() =>
    !auth.isAuthenticated
    || auth.userRole === 'PARTICIPANTE',
  )

  // ==============================
  // ETAPAS
  // ==============================

  const STEPS = {
    inscricoes: 0,
    andamento: 1,
    avaliacao: 2,
    finalizado: 3,
  } as const

  const step = computed(() =>
    status.value
      ? STEPS[status.value]
      : 0,
  )

  // ==============================
  // EQUIPES
  // ==============================

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

  // ==============================
  // APOIADORES
  // ==============================

  const patrocinadores = computed(() =>
    (edicao.value?.apoiadores ?? [])
      .filter(apoiador =>
        Boolean(apoiador.logo_apoiador),
      )
      .map(apoiador => ({
        name: apoiador.nome,
        imageUrl: apoiador.logo_apoiador as string,
      })),
  )

  // ==============================
  // RANKING
  // ==============================

  const ranking = useAsync(
    () => listarRanking(edicaoId.value),
    false,
  )

  // ==============================
  // ABAS
  // ==============================

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

    // Ranking disponível somente após a finalização
    if (status.value === 'finalizado') {
      items.push({
        id: 'ranking',
        label: 'Ranking',
        icon: 'mdi-trophy-outline',
      })
    }

    return items
  })

  // ==============================
  // COMPARTILHAMENTO
  // ==============================

  async function compartilhar () {
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
      // não está disponível.
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

  // ==============================
  // ATUALIZAÇÃO DOS DADOS
  // ==============================

  // Atualiza quando o usuário navega entre edições.
  watch(edicaoId, () => {
    abaAtiva.value = 'visao'
    linkCopiado.value = false

    void run()
  })

  // Consulta o ranking somente quando disponível.
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
  <section class="w-full min-w-0">
    <AsyncView
      :error="error"
      :lines="8"
      :loading="loading"
      @retry="run"
    >
      <template v-if="edicao && status">

        <!-- ============================== -->
        <!-- NAVEGAÇÃO                      -->
        <!-- ============================== -->

        <!-- Navegação da edição -->
        <div class="mb-5 flex flex-wrap items-center gap-4">

          <!-- Botão voltar -->
          <RouterLink
            class="group inline-flex items-center gap-1.5
           text-sm font-medium text-app-text-muted
           transition-colors hover:text-app-link"
            to="/edicoes"
          >
            <span
              aria-hidden="true"
              class="mdi mdi-arrow-left text-lg
             transition-transform duration-200
             group-hover:-translate-x-0.5"
            />

            Voltar
          </RouterLink>

          <!-- Divisória -->
          <span
            aria-hidden="true"
            class="hidden h-4 w-px bg-app-surface-skeleton sm:block"
          />

          <!-- Breadcrumb -->
          <nav
            aria-label="Navegação da edição"
            class="flex min-w-0 items-center gap-2 text-sm"
          >
            <RouterLink
              class="text-app-text-placeholder transition-colors hover:text-app-link"
              to="/edicoes"
            >
              Edições
            </RouterLink>

            <span
              aria-hidden="true"
              class="mdi mdi-chevron-right text-base text-app-text-placeholder"
            />

            <span class="truncate font-medium text-app-text-secondary">
              {{ edicao.nome }}
            </span>
          </nav>

        </div>
        <!-- ============================== -->
        <!-- CAPA E TÍTULO                   -->
        <!-- ============================== -->

        <EventDetailsHero
          :edicao="edicao"
          :link-copiado="linkCopiado"
          :pode-inscrever="podeInscrever"
          :status="status"
          @compartilhar="compartilhar"
        />

        <!-- ============================== -->
        <!-- INFORMAÇÕES ESSENCIAIS          -->
        <!-- ============================== -->

        <div class="mt-4">
          <EventDetailsFacts :edicao="edicao" />
        </div>

        <!-- ============================== -->
        <!-- ABAS                            -->
        <!-- ============================== -->

        <nav
          aria-label="Seções da edição"
          class="mt-7 flex gap-2
                 overflow-x-auto border-b
                 border-app-border-default"
        >
          <button
            v-for="aba in abas"
            :key="aba.id"
            :aria-pressed="abaAtiva === aba.id"
            :class="[
              'inline-flex min-h-11 shrink-0',
              'items-center gap-2 border-b-2',
              'px-4 py-3 text-sm font-medium',
              'transition-colors',

              abaAtiva === aba.id
                ? 'border-app-brand-border-500 text-app-link'
                : 'border-transparent text-app-text-muted hover:text-app-text-body-strong',
            ]"
            type="button"
            @click="abaAtiva = aba.id"
          >
            <span
              aria-hidden="true"
              class="text-lg"
              :class="['mdi', aba.icon]"
            />

            {{ aba.label }}
          </button>
        </nav>

        <!-- ============================== -->
        <!-- VISÃO GERAL                     -->
        <!-- ============================== -->

        <div
          v-if="abaAtiva === 'visao'"
          class="mt-6 grid grid-cols-1
                 items-start gap-5
                 lg:grid-cols-[minmax(0,1.65fr)_minmax(300px,1fr)]"
        >
          <!-- Coluna principal -->
          <div class="min-w-0 space-y-5">

            <!-- SOBRE A EDIÇÃO -->
            <section
              class="rounded-lg border border-app-border-default
                     bg-app-surface p-5 sm:p-6"
            >
              <h2
                class="text-lg font-semibold
                       tracking-tight
                       text-app-text-body-strong"
              >
                Sobre o {{ edicao.nome }}
              </h2>

              <!-- Descrição -->
              <p
                class="mt-3 whitespace-pre-line
                       text-sm leading-6
                       text-app-text-muted"
              >
                {{
                  edicao.descricao ||
                    'Esta edição ainda não possui uma descrição.'
                }}
              </p>

              <!-- CRITÉRIOS -->
              <div
                v-if="edicao.criterios.length > 0"
                class="mt-6"
              >
                <h3
                  class="text-sm font-medium
                         text-app-text-secondary"
                >
                  Critérios de avaliação
                </h3>

                <div
                  class="mt-3 flex flex-wrap gap-2"
                >
                  <span
                    v-for="criterio in edicao.criterios"
                    :key="criterio.id"
                    class="rounded-full
                           bg-app-selection-soft px-3 py-1.5
                           text-xs font-medium
                           text-app-link"
                  >
                    {{ criterio.nome }}
                  </span>
                </div>
              </div>
            </section>

            <!-- CRONOGRAMA -->
            <section
              class="rounded-lg border border-app-border-default
                     bg-app-surface p-5 sm:p-6"
            >
              <div class="mb-6">
                <h2
                  class="text-base font-semibold
                         text-app-text-body-strong"
                >
                  Cronograma
                </h2>

                <p
                  class="mt-1 text-sm
                         text-app-text-muted"
                >
                  Acompanhe as etapas do hackathon.
                </p>
              </div>

              <ProgressStepper
                :current-step="step"
                :steps="[
                  'Inscrições',
                  'Andamento',
                  'Avaliação',
                  'Finalizado',
                ]"
              />
            </section>

            <!-- APOIADORES -->
            <section
              v-if="patrocinadores.length > 0"
              class="rounded-lg border border-app-border-default
                     bg-app-surface p-5 sm:p-6"
            >
              <h2
                class="mb-4 text-base
                       font-semibold text-app-text-body-strong"
              >
                Apoiadores
              </h2>

              <SponsorList
                :images="patrocinadores"
              />
            </section>

          </div>

          <!-- Coluna lateral -->
          <EventDetailsSidebar
            :edicao="edicao"
            :pode-inscrever="podeInscrever"
            :status="status"
            @ver-equipes="abaAtiva = 'equipes'"
          />
        </div>

        <!-- ============================== -->
        <!-- EQUIPES                         -->
        <!-- ============================== -->

        <section
          v-else-if="abaAtiva === 'equipes'"
          class="mt-6"
        >
          <TeamsSection
            :items="equipes"
            title="Equipes participantes"
          />
        </section>

        <!-- ============================== -->
        <!-- RANKING                         -->
        <!-- ============================== -->

        <section
          v-else-if="
            abaAtiva === 'ranking' &&
              status === 'finalizado'
          "
          class="mt-6"
        >
          <div
            class="rounded-lg border
                   border-app-border-default
                   bg-app-surface p-5 sm:p-6"
          >
            <h2
              class="mb-5 text-lg
                     font-semibold text-app-text-body-strong"
            >
              Ranking da edição
            </h2>

            <AsyncView
              :empty="
                !ranking.loading.value &&
                  !ranking.error.value &&
                  (ranking.data.value?.length ?? 0) === 0
              "
              empty-message="O ranking ainda não está disponível."
              :error="ranking.error.value"
              :loading="ranking.loading.value"
              @retry="ranking.run"
            >
              <ol class="space-y-3">

                <li
                  v-for="item in ranking.data.value"
                  :key="item.projeto_id"
                  class="flex items-center gap-4
                         rounded-lg border
                         border-app-border-default
                         px-4 py-3"
                >
                  <!-- Posição -->
                  <span
                    class="flex h-10 w-10
                           shrink-0 items-center
                           justify-center rounded-lg
                           bg-app-selection-soft text-base
                           font-semibold
                           text-app-link"
                  >
                    {{ item.posicao }}º
                  </span>

                  <!-- Projeto -->
                  <div class="min-w-0 flex-1">
                    <h3
                      class="truncate text-sm
                             font-medium
                             text-app-text-body-strong"
                    >
                      {{ item.projeto }}
                    </h3>

                    <p
                      class="mt-1 text-xs
                             text-app-text-muted"
                    >
                      {{ item.equipe }}
                    </p>
                  </div>

                  <!-- Nota -->
                  <span
                    class="text-base font-semibold
                           text-app-link"
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
  </section>
</template>
