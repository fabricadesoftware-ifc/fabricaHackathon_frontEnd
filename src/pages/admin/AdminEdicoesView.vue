<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import EdicaoForm from '@/components/admin/EdicaoForm.vue'
  import { AsyncView } from '@/components/ui/AsyncView'
  import PageHeader from '@/components/ui/PageHeader/PageHeader.vue'
  import { useAsync } from '@/composables/useAsync'
  import { criarEdicao, painelListarEdicoes, ROTULO_STATUS } from '@/services/painel'
  import { formatarData } from '@/utils/format'

  const router = useRouter()
  const { data, loading, error, run } = useAsync(painelListarEdicoes)
  const itens = computed(() => data.value ?? [])
  const criando = ref(false)

  async function salvar (dados: Record<string, unknown>) {
    const nova = await criarEdicao(dados)
    router.push(`/admin/edicoes/${nova.id}`)
  }
</script>

<template>
  <div class="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <PageHeader subtitle="Gerencie edições, equipes, avaliadores e resultados." title="Painel de administração" />

      <div class="flex gap-2">
        <router-link class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50" to="/admin/solicitacoes">Solicitações de perfil</router-link>

        <button class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700" data-testid="nova-edicao" @click="criando = !criando">
          {{ criando ? 'Cancelar' : 'Nova edição' }}
        </button>
      </div>
    </div>

    <section v-if="criando" class="mb-6 rounded-lg border border-gray-200 bg-white p-4">
      <h2 class="mb-3 text-lg font-semibold">Nova edição</h2>
      <EdicaoForm :on-salvar="salvar" rotulo="Criar edição" />
      <p class="mt-3 text-xs text-gray-500">Depois de criar, cadastre critérios, temas e avaliadores na própria edição.</p>
    </section>

    <AsyncView
      :empty="!loading && !error && itens.length === 0"
      empty-message="Nenhuma edição cadastrada."
      :error="error"
      :loading="loading"
      @retry="run"
    >
      <ul class="grid gap-3 sm:grid-cols-2">
        <li v-for="e in itens" :key="e.id">
          <router-link class="block rounded-lg border border-gray-200 bg-white p-4 transition hover:border-blue-400 hover:shadow-sm" :to="`/admin/edicoes/${e.id}`">
            <div class="flex items-start justify-between gap-2">
              <p class="font-semibold text-gray-900">{{ e.nome }} <span class="font-normal text-gray-500">{{ e.ano }}</span></p>
              <span class="shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">{{ ROTULO_STATUS[e.status] }}</span>
            </div>

            <p class="mt-1 text-sm text-gray-500">{{ formatarData(e.data_inicio) }} – {{ formatarData(e.data_fim) }}</p>

            <p class="mt-3 text-sm text-gray-700">
              {{ e.contagens.equipes }}/{{ e.contagens.maximo_equipes }} equipes ·
              {{ e.contagens.participantes }} participantes ·
              {{ e.contagens.avaliadores }} avaliadores
            </p>
          </router-link>
        </li>
      </ul>
    </AsyncView>
  </div>
</template>
