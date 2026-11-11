<script setup lang="ts">
  import type { SolicitacaoPerfilAdmin, StatusSolicitacao } from '@/types'

  import { computed, ref, watch } from 'vue'
  import AppButton from '@/components/ui/AppButton/AppButton.vue'
  import { AsyncView } from '@/components/ui/AsyncView'
  import FilterChipGroup from '@/components/ui/FilterChipGroup/FilterChipGroup.vue'
  import PageHeader from '@/components/ui/PageHeader/PageHeader.vue'
  import { useAsync } from '@/composables/useAsync'
  import { ApiError, aprovarSolicitacao, listarSolicitacoesPerfil, recusarSolicitacao } from '@/services'
  import { formatarData } from '@/utils/format'

  const filtro = ref<StatusSolicitacao>('PENDENTE')
  const filtros = [
    { label: 'Pendentes', value: 'PENDENTE' },
    { label: 'Aprovadas', value: 'APROVADA' },
    { label: 'Recusadas', value: 'RECUSADA' },
  ]

  const { data, loading, error, run } = useAsync(() =>
    listarSolicitacoesPerfil({ status: filtro.value, page_size: 100 }),
  )
  watch(filtro, run)

  const itens = computed(() => data.value?.results ?? [])

  const PERFIL: Record<SolicitacaoPerfilAdmin['perfil_solicitado'], string> = {
    AVALIADOR: 'Avaliador',
    PROFESSOR: 'Professor',
  }

  const estadoVazio = computed(() => ({
    PENDENTE: { titulo: 'Nenhuma solicitação pendente', descricao: 'Quando alguém solicitar um perfil de Avaliador ou Professor, o pedido aparecerá aqui.' },
    APROVADA: { titulo: 'Nenhuma solicitação aprovada', descricao: 'Os pedidos aprovados aparecerão aqui para consulta.' },
    RECUSADA: { titulo: 'Nenhuma solicitação recusada', descricao: 'Os pedidos recusados aparecerão aqui para consulta.' },
  })[filtro.value])

  const decidindo = ref<number | null>(null)
  const acaoAtual = ref<'aprovar' | 'recusar'>('aprovar')
  const mensagem = ref('')
  const erroAcao = ref('')

  async function decidir (item: SolicitacaoPerfilAdmin, aprovar: boolean) {
    if (decidindo.value !== null) {
      return
    }
    acaoAtual.value = aprovar ? 'aprovar' : 'recusar'
    decidindo.value = item.id
    erroAcao.value = ''
    mensagem.value = ''
    try {
      await (aprovar ? aprovarSolicitacao(item.id) : recusarSolicitacao(item.id))
      mensagem.value = `Solicitação de ${item.usuario_nome || item.usuario_email} ${aprovar ? 'aprovada' : 'recusada'}.`
    } catch (error_) {
      erroAcao.value = error_ instanceof ApiError ? error_.message : 'Não foi possível concluir a ação.'
    } finally {
      decidindo.value = null
      await run() // a lista reflete o estado real (inclusive se já tinha sido decidida por outro admin)
    }
  }
</script>

<template>
  <div class="solicitacoes w-full min-w-0">
    <PageHeader
      class="mt-[1rem] mb-[1.5rem] mx-0 [&_h1]:text-app-ink-heading [&_h1]:text-[1.5rem] [&_h1]:font-semibold [&_h1]:leading-[1.35] [&_p]:mt-[.25rem] [&_p]:text-app-ink-secondary [&_p]:text-[.875rem] [&_p]:leading-[1.6]"
      subtitle="Aprove ou recuse pedidos de perfil de Avaliador e Professor."
      title="Solicitações de perfil"
    />

    <div aria-label="Filtrar solicitações por situação" class="mb-6 border-b border-app-border-default" role="group">
      <FilterChipGroup v-model="filtro" :options="filtros" variant="underline" />
    </div>

    <p v-if="mensagem" class="mb-4 rounded-lg border border-app-success-border-200 bg-app-success-surface-50 px-4 py-3 text-sm text-app-success-text-800" role="status">
      {{ mensagem }}
    </p>

    <p v-if="erroAcao" class="mb-4 rounded-lg border border-app-danger-border-200 bg-app-danger-surface-50 px-4 py-3 text-sm text-app-danger-text-700" role="alert">
      {{ erroAcao }}
    </p>

    <section :aria-busy="loading" aria-label="Lista de solicitações de perfil" class="overflow-hidden rounded-lg border border-app-border-default bg-app-surface">
      <div v-if="!loading && !error && itens.length > 0" aria-hidden="true" class="solicitacao-grid xl:grid-cols-[minmax(0,1.5fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(13rem,1fr)] hidden gap-5 border-b border-app-border-default bg-app-surface-subtle px-5 py-3 text-xs font-medium text-app-text-secondary xl:grid">
        <span>Usuário</span>
        <span>Perfil solicitado</span>
        <span>Solicitada em</span>
        <span class="text-right">{{ filtro === 'PENDENTE' ? 'Ações' : 'Decisão' }}</span>
      </div>

      <div :class="{ 'p-5': loading || error }">
        <AsyncView :error="error" :lines="6" :loading="loading" @retry="run">
          <div v-if="itens.length === 0" class="flex flex-col items-center gap-2 px-5 py-12 text-center" role="status">
            <span aria-hidden="true" class="mdi mdi-inbox-check-outline mb-1 text-3xl text-app-text-placeholder" />
            <h2 class="text-base font-semibold text-app-text-body-strong">{{ estadoVazio.titulo }}</h2>
            <p class="max-w-md text-sm leading-6 text-app-text-muted">{{ estadoVazio.descricao }}</p>
          </div>

          <ul v-else class="divide-y divide-app-border-default">
            <li v-for="item in itens" :key="item.id" class="solicitacao-grid xl:grid-cols-[minmax(0,1.5fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(13rem,1fr)] grid min-w-0 gap-4 px-4 py-5 transition-colors hover:bg-app-surface-subtle/60 sm:px-5 xl:items-center xl:gap-5">
              <div class="min-w-0">
                <p class="break-words text-sm font-semibold leading-6 text-app-text-body-strong">{{ item.usuario_nome || item.usuario_email }}</p>
                <p v-if="item.usuario_nome" class="break-all text-sm leading-6 text-app-text-muted">{{ item.usuario_email }}</p>
              </div>

              <div class="flex items-center gap-2 text-sm text-app-text-body-strong">
                <span aria-hidden="true" class="mdi text-lg text-app-text-muted" :class="item.perfil_solicitado === 'AVALIADOR' ? 'mdi-clipboard-check-outline' : 'mdi-school-outline'" />
                <span><span class="sr-only">Perfil solicitado: </span>{{ PERFIL[item.perfil_solicitado] }}</span>
              </div>

              <p class="text-sm tabular-nums text-app-text-muted">
                <span class="xl:sr-only">Solicitada em </span>
                <time :datetime="item.criada_em">{{ formatarData(item.criada_em) }}</time>
              </p>

              <div v-if="item.status === 'PENDENTE'" class="solicitacao-acoes flex items-center gap-2 border-t border-app-border-soft pt-4 xl:justify-end xl:border-0 xl:pt-0">
                <AppButton
                  :aria-label="`Recusar solicitação de ${item.usuario_nome || item.usuario_email}`"
                  :disabled="decidindo !== null"
                  :label="decidindo === item.id && acaoAtual === 'recusar' ? 'Recusando…' : 'Recusar'"
                  :loading="decidindo === item.id && acaoAtual === 'recusar'"
                  variant="secondary"
                  @click="decidir(item, false)"
                />

                <AppButton
                  :aria-label="`Aprovar solicitação de ${item.usuario_nome || item.usuario_email}`"
                  :disabled="decidindo !== null"
                  :label="decidindo === item.id && acaoAtual === 'aprovar' ? 'Aprovando…' : 'Aprovar'"
                  :loading="decidindo === item.id && acaoAtual === 'aprovar'"
                  variant="primary"
                  @click="decidir(item, true)"
                />
              </div>

              <p v-else-if="item.decidida_em" class="min-w-0 break-words text-xs leading-5 text-app-text-muted xl:text-right">
                {{ item.status === 'APROVADA' ? 'Aprovada' : 'Recusada' }} em
                <time :datetime="item.decidida_em">{{ formatarData(item.decidida_em) }}</time>
                <span v-if="item.decidida_por_email" class="block break-all">por {{ item.decidida_por_email }}</span>
              </p>
            </li>
          </ul>
        </AsyncView>
      </div>
    </section>
  </div>
</template>

<style scoped>
.solicitacoes :deep(button:focus-visible) {
  outline: 2px solid var(--app-brand-accent);
  outline-offset: -2px;
}

.solicitacao-acoes :deep(.app-btn) {
  min-height: 44px;
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  box-shadow: none;
}

.solicitacao-acoes :deep(.app-btn:first-child) {
  border: 1px solid var(--app-line);
}

@media (prefers-reduced-motion: reduce) {
  .solicitacoes :deep(*) {
    transition: none;
    animation: none;
  }
}
</style>
