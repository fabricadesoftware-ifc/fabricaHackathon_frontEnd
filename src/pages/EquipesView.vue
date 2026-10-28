<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { AsyncView } from '@/components/ui/AsyncView'
  import PageHeader from '@/components/ui/PageHeader/PageHeader.vue'
  import SearchFilterBar from '@/components/ui/SearchFilterBar'
  import { useAsync } from '@/composables/useAsync'
  import { ApiError } from '@/services/http'
  import {
    adicionarMembro,
    excluirInscricao,
    listarMinhasEquipes,
    type MinhaEquipe,
    removerMembro,
    sairDaEquipe,
  } from '@/services/inscricoes'

  const { data, loading, error, run } = useAsync(() => listarMinhasEquipes())
  const equipes = computed(() => data.value ?? [])
  const search = ref('')
  const equipesFiltradas = computed(() => {
    const termo = search.value.trim().toLowerCase()
    if (!termo) return equipes.value

    return equipes.value.filter(equipe => [
      equipe.nome_equipe,
      equipe.projeto?.nome_projeto,
      equipe.tema,
      ...equipe.membros.map(membro =>
        `${membro.first_name} ${membro.last_name} ${membro.username} ${membro.email}`,
      ),
    ].filter(Boolean).join(' ').toLowerCase().includes(termo))
  })

  // Estado por equipe (e-mail digitado, erro, ocupado) e ação aguardando confirmação.
  const emails = ref<Record<number, string>>({})
  const erros = ref<Record<number, string>>({})
  const ocupada = ref<number | null>(null)
  const confirmando = ref<string | null>(null)

  const STATUS_LABEL: Record<string, string> = {
    INSCRICAO: 'Inscrições abertas',
    EM_ANDAMENTO: 'Em andamento',
    AVALIACAO: 'Em avaliação',
    FINALIZADO: 'Finalizado',
  }

  const podeGerenciar = (e: MinhaEquipe) => e.sou_criador && e.edicao_status === 'INSCRICAO'
  function nomeCompleto (m: MinhaEquipe['membros'][number]) {
    return `${m.first_name} ${m.last_name}`.trim() || m.username
  }

  function mensagemDe (e: unknown) {
    if (e instanceof ApiError) {
      const campos = Object.values(e.fields).flat()
      return campos.length > 0 ? campos.join(' ') : e.message
    }
    return 'Não foi possível concluir a ação.'
  }

  // Executa uma ação sobre a equipe e recarrega a lista.
  async function executar (equipeId: number, acao: () => Promise<unknown>, depois?: () => void) {
    if (ocupada.value !== null) return
    ocupada.value = equipeId
    erros.value[equipeId] = ''
    try {
      await acao()
      depois?.()
      confirmando.value = null
      await run()
    } catch (error_) {
      erros.value[equipeId] = mensagemDe(error_)
    } finally {
      ocupada.value = null
    }
  }

  function adicionar (e: MinhaEquipe) {
    const email = (emails.value[e.id] ?? '').trim()
    if (!email) {
      erros.value[e.id] = 'Informe o e-mail do integrante.'
      return
    }
    executar(e.id, () => adicionarMembro(e.id, email), () => {
      emails.value[e.id] = ''
    })
  }

  // Primeiro clique pede confirmação; o segundo executa.
  function pedir (chave: string) {
    confirmando.value = confirmando.value === chave ? null : chave
  }
</script>

<template>
  <div class="w-full min-w-0">
  <PageHeader subtitle="Veja seus integrantes e gerencie a equipe durante as inscrições" title="Minhas equipes" />

  <SearchFilterBar v-model:search="search" appearance="toolbar" placeholder="Buscar equipes, projetos ou integrantes" />

  <AsyncView
    :empty="!loading && !error && equipesFiltradas.length === 0"
    :empty-message="search ? 'Nenhuma equipe corresponde à sua busca.' : 'Você ainda não faz parte de nenhuma equipe.'"
    :error="error"
    :loading="loading"
    @retry="run"
  >
    <div class="flex flex-col gap-5">
      <section
        v-for="e in equipesFiltradas"
        :key="e.id"
        class="w-full max-w-[900px] rounded-lg border border-slate-200 bg-white p-5 sm:p-6"
      >
        <header class="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h2 class="text-lg font-semibold text-[#111827]">{{ e.nome_equipe }}</h2>

            <p class="text-sm text-[#4B5563]">
              <span v-if="e.projeto">Projeto: {{ e.projeto.nome_projeto }} · </span>
              <span v-if="e.tema">Tema: {{ e.tema }} · </span>
              {{ STATUS_LABEL[e.edicao_status] ?? e.edicao_status }}
            </p>
          </div>

          <span
            v-if="e.sou_criador"
            class="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
          >Você criou esta equipe</span>
        </header>

        <ul class="mt-4 divide-y divide-[#E5E7EB]">
          <li
            v-for="m in e.membros"
            :key="m.id"
            class="flex flex-wrap items-center justify-between gap-2 py-2"
          >
            <div>
              <p class="text-sm font-medium text-[#111827]">
                {{ nomeCompleto(m) }}
                <span v-if="m.id === e.criador" class="ml-1 text-xs text-[#4B5563]">(criador)</span>
              </p>

              <p class="text-xs text-[#4B5563]">{{ m.email }}</p>
            </div>

            <template v-if="podeGerenciar(e) && m.id !== e.criador">
              <span v-if="confirmando === `rm-${e.id}-${m.id}`" class="flex items-center gap-2 text-sm">
                <button
                  class="rounded border border-red-300 bg-red-50 px-3 py-1 text-red-700 hover:bg-red-100"
                  :disabled="ocupada !== null"
                  type="button"
                  @click="executar(e.id, () => removerMembro(e.id, m.id))"
                >Confirmar remoção</button>

                <button class="text-[#4B5563] hover:underline" type="button" @click="confirmando = null">Cancelar</button>
              </span>

              <button
                v-else
                class="text-sm text-red-600 hover:underline"
                type="button"
                @click="pedir(`rm-${e.id}-${m.id}`)"
              >Remover</button>
            </template>
          </li>
        </ul>

        <form
          v-if="podeGerenciar(e)"
          class="mt-4 flex flex-wrap items-center gap-2"
          @submit.prevent="adicionar(e)"
        >
          <input
            v-model="emails[e.id]"
            aria-label="E-mail do novo integrante"
            class="min-w-[16rem] flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500"
            placeholder="email@exemplo.com"
            type="email"
          >

          <button
            class="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white hover:bg-[#2054C6] disabled:opacity-50"
            :disabled="ocupada !== null"
            type="submit"
          >Adicionar integrante</button>
        </form>

        <p v-if="erros[e.id]" class="mt-3 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600" role="alert">
          {{ erros[e.id] }}
        </p>

        <footer class="mt-5 flex flex-wrap items-center gap-3 border-t border-[#E5E7EB] pt-4 text-sm">
          <RouterLink class="text-blue-600 hover:underline" :to="`/edicoes/${e.edicao}`">Ver edição</RouterLink>

          <!-- Criador: excluir a inscrição -->
          <template v-if="podeGerenciar(e)">
            <span v-if="confirmando === `del-${e.id}`" class="flex items-center gap-2">
              <span class="text-[#4B5563]">Excluir a equipe e o projeto?</span>

              <button
                class="rounded border border-red-300 bg-red-50 px-3 py-1 text-red-700 hover:bg-red-100"
                :disabled="ocupada !== null"
                type="button"
                @click="executar(e.id, () => excluirInscricao(e.id))"
              >Sim, excluir</button>

              <button class="text-[#4B5563] hover:underline" type="button" @click="confirmando = null">Cancelar</button>
            </span>

            <button v-else class="text-red-600 hover:underline" type="button" @click="pedir(`del-${e.id}`)">
              Excluir inscrição
            </button>
          </template>

          <!-- Integrante: sair da equipe -->
          <template v-else-if="!e.sou_criador && e.edicao_status === 'INSCRICAO'">
            <span v-if="confirmando === `out-${e.id}`" class="flex items-center gap-2">
              <span class="text-[#4B5563]">Sair desta equipe?</span>

              <button
                class="rounded border border-red-300 bg-red-50 px-3 py-1 text-red-700 hover:bg-red-100"
                :disabled="ocupada !== null"
                type="button"
                @click="executar(e.id, () => sairDaEquipe(e.id))"
              >Sim, sair</button>

              <button class="text-[#4B5563] hover:underline" type="button" @click="confirmando = null">Cancelar</button>
            </span>

            <button v-else class="text-red-600 hover:underline" type="button" @click="pedir(`out-${e.id}`)">
              Sair da equipe
            </button>
          </template>

          <span v-else-if="e.edicao_status !== 'INSCRICAO'" class="text-xs text-[#4B5563]">
            Equipe fechada: a edição já saiu da fase de inscrições.
          </span>
        </footer>
      </section>
    </div>
  </AsyncView>
  </div>
</template>
