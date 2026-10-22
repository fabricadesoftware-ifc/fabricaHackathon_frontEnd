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

  const decidindo = ref<number | null>(null)
  const mensagem = ref('')
  const erroAcao = ref('')

  async function decidir (item: SolicitacaoPerfilAdmin, aprovar: boolean) {
    if (decidindo.value !== null) {
      return
    }
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
  <div class="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
    <PageHeader
      subtitle="Aprove ou recuse pedidos de perfil de Avaliador e Professor."
      title="Solicitações de perfil"
    />

    <div class="my-5">
      <FilterChipGroup v-model="filtro" :options="filtros" />
    </div>

    <p v-if="mensagem" class="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800" role="status">
      {{ mensagem }}
    </p>

    <p v-if="erroAcao" class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
      {{ erroAcao }}
    </p>

    <AsyncView
      :empty="!loading && !error && itens.length === 0"
      empty-message="Nenhuma solicitação neste filtro."
      :error="error"
      :loading="loading"
      @retry="run"
    >
      <ul class="flex flex-col gap-3">
        <li
          v-for="item in itens"
          :key="item.id"
          class="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="min-w-0">
            <p class="truncate font-semibold text-gray-900">{{ item.usuario_nome || item.usuario_email }}</p>
            <p class="truncate text-sm text-gray-500">{{ item.usuario_email }}</p>

            <p class="mt-1 text-sm text-gray-700">
              Quer ser <strong>{{ PERFIL[item.perfil_solicitado] }}</strong>
              · pedido em {{ formatarData(item.criada_em) }}
            </p>

            <p v-if="item.decidida_em" class="text-xs text-gray-500">
              Decidida em {{ formatarData(item.decidida_em) }}<template v-if="item.decidida_por_email"> por {{ item.decidida_por_email }}</template>
            </p>
          </div>

          <div v-if="item.status === 'PENDENTE'" class="flex shrink-0 gap-2">
            <AppButton
              :disabled="decidindo !== null"
              label="Recusar"
              variant="secondary"
              @click="decidir(item, false)"
            />

            <AppButton
              :disabled="decidindo !== null"
              label="Aprovar"
              :loading="decidindo === item.id"
              variant="primary"
              @click="decidir(item, true)"
            />
          </div>
        </li>
      </ul>
    </AsyncView>
  </div>
</template>
