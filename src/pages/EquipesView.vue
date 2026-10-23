<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { AsyncView } from '@/components/ui/AsyncView'
  import PageHeader from '@/components/ui/PageHeader/PageHeader.vue'
  import { useAsync } from '@/composables/useAsync'
  import { ApiError } from '@/services/http'
  import {
    excluirInscricao,
    gerarLinkConvite,
    listarMinhasEquipes,
    type MinhaEquipe,
    removerMembro,
    revogarLinkConvite,
    sairDaEquipe,
  } from '@/services/inscricoes'

  const { data, loading, error, run } = useAsync(() => listarMinhasEquipes())
  const equipes = computed(() => data.value ?? [])

  // Estado por equipe (erro, ocupado) e ação aguardando confirmação.
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

  const copiado = ref<number | null>(null)
  async function copiarLink (e: MinhaEquipe) {
    if (!e.link_convite) return
    try {
      await navigator.clipboard.writeText(e.link_convite.url)
      copiado.value = e.id
      setTimeout(() => { if (copiado.value === e.id) copiado.value = null }, 2500)
    } catch {
      erros.value[e.id] = 'Não consegui copiar. Selecione o link e copie manualmente.'
    }
  }

  const faltam = (e: MinhaEquipe) => Math.max(0, e.minimo_participantes - e.membros.length)

  // Primeiro clique pede confirmação; o segundo executa.
  function pedir (chave: string) {
    confirmando.value = confirmando.value === chave ? null : chave
  }
</script>

<template>
  <PageHeader subtitle="Veja seus integrantes e gerencie a equipe durante as inscrições" title="Minhas equipes" />

  <AsyncView
    :empty="!loading && !error && equipes.length === 0"
    empty-message="Você ainda não faz parte de nenhuma equipe."
    :error="error"
    :loading="loading"
    @retry="run"
  >
    <div class="flex flex-col gap-6">
      <section
        v-for="e in equipes"
        :key="e.id"
        class="rounded-md border border-[#E5E7EB] bg-white p-6"
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

        <p v-if="faltam(e) > 0 && e.edicao_status === 'INSCRICAO'" class="mt-3 rounded-lg bg-amber-50 px-4 py-2 text-sm text-amber-800">
          Equipe incompleta: faltam {{ faltam(e) }} participante(s) para o mínimo de {{ e.minimo_participantes }} até o fim das inscrições.
        </p>

        <!-- Link de convite reutilizável (só o criador) -->
        <div v-if="podeGerenciar(e)" class="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
          <p class="text-sm font-medium text-[#111827]">Link de convite</p>
          <template v-if="e.link_convite">
            <p class="mt-1 text-xs text-[#4B5563]">Mande este link para quem vai participar: qualquer pessoa com conta que abrir entra na equipe, até lotar as vagas ({{ e.membros.length }}/{{ e.maximo_participantes }}).</p>
            <div class="mt-2 flex flex-wrap items-center gap-2">
              <input aria-label="Link de convite" class="min-w-[14rem] flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs" readonly :value="e.link_convite.url" @focus="($event.target as HTMLInputElement).select()">
              <button class="rounded-lg bg-[#2563EB] px-3 py-2 text-sm font-medium text-white hover:bg-[#2054C6]" data-testid="copiar-link" type="button" @click="copiarLink(e)">{{ copiado === e.id ? 'Copiado!' : 'Copiar' }}</button>
              <button class="text-sm text-red-600 hover:underline" :disabled="ocupada !== null" type="button" @click="executar(e.id, () => revogarLinkConvite(e.id))">Desativar link</button>
            </div>
          </template>
          <button v-else class="mt-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-100" data-testid="gerar-link" :disabled="ocupada !== null" type="button" @click="executar(e.id, () => gerarLinkConvite(e.id))">Gerar link de convite</button>
        </div>

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
</template>
