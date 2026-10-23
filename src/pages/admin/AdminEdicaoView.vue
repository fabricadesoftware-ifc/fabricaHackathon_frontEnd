<script setup lang="ts">
  import type { PainelAvaliador, PainelEdicaoResumo, StatusApi } from '@/services/painel'
  import { computed, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import EdicaoForm from '@/components/admin/EdicaoForm.vue'
  import { AsyncView } from '@/components/ui/AsyncView'
  import { useAsync } from '@/composables/useAsync'
  import { ApiError } from '@/services/http'
  import {
    atualizarEdicao, criarCriterio, criarTema, ORDEM_STATUS, painelAvaliadores, painelDesvincular, painelEdicao,
    painelEquipes, painelResultados, painelVincular, removerCriterio, removerTema, ROTULO_STATUS,
  } from '@/services/painel'

  const route = useRoute()
  const id = computed(() => String(route.params.id))

  const abas = [
    { id: 'resumo', rotulo: 'Resumo' },
    { id: 'equipes', rotulo: 'Equipes' },
    { id: 'avaliadores', rotulo: 'Avaliadores' },
    { id: 'resultados', rotulo: 'Resultados' },
    { id: 'config', rotulo: 'Configuração' },
  ]
  const aba = ref('resumo')

  const resumo = useAsync(() => painelEdicao(id.value))
  const equipes = useAsync(() => painelEquipes(id.value), false)
  const avaliadores = useAsync(() => painelAvaliadores(id.value), false)
  const resultados = useAsync(() => painelResultados(id.value), false)

  watch(aba, a => {
    aviso.value = ''
    erroAcao.value = ''
    if (a === 'equipes' && !equipes.data.value) equipes.run()
    if (a === 'avaliadores') avaliadores.run()
    if (a === 'resultados') resultados.run()
  })

  const ed = computed<PainelEdicaoResumo | null>(() => resumo.data.value)
  const indice = computed(() => ed.value ? ORDEM_STATUS.indexOf(ed.value.status) : 0)
  const proximo = computed<StatusApi | null>(() => ORDEM_STATUS[indice.value + 1] ?? null)
  const finalizada = computed(() => ed.value?.status === 'FINALIZADO')

  const aviso = ref('')
  const erroAcao = ref('')
  async function acao (fn: () => Promise<unknown>, msg: string, depois?: () => Promise<void> | void) {
    aviso.value = ''
    erroAcao.value = ''
    try {
      await fn()
      await resumo.run()
      await depois?.()
      aviso.value = msg
    } catch (error_) {
      erroAcao.value = error_ instanceof ApiError ? error_.message : 'Não foi possível concluir a ação.'
    }
  }

  function avancar () {
    if (!proximo.value) return
    const nome = ROTULO_STATUS[proximo.value]
    if (!confirm(`Avançar a edição para "${nome}"? Esta ação não pode ser desfeita.`)) return
    acao(() => atualizarEdicao(id.value, { status: proximo.value }), `Edição agora está: ${nome}.`)
  }

  const prazo = ref('')
  watch(ed, e => {
    prazo.value = e?.prazo_pre_avaliacao ? e.prazo_pre_avaliacao.slice(0, 16) : ''
  }, { immediate: true })

  function alternarPre () {
    return acao(
      () => atualizarEdicao(id.value, { pre_avaliacao_liberada: !ed.value?.pre_avaliacao_liberada }),
      ed.value?.pre_avaliacao_liberada ? 'Pré-avaliação desativada.' : 'Pré-avaliação liberada para as equipes.',
    )
  }
  function salvarPrazo () {
    return acao(
      () => atualizarEdicao(id.value, { prazo_pre_avaliacao: prazo.value ? new Date(prazo.value).toISOString() : null }),
      'Prazo da pré-avaliação salvo.',
    )
  }

  function alternarAvaliador (a: PainelAvaliador) {
    acao(
      () => a.vinculado ? painelDesvincular(id.value, a.user_id) : painelVincular(id.value, a.user_id),
      a.vinculado ? `${a.nome} desvinculado.` : `${a.nome} vinculado à edição.`,
      () => avaliadores.run(),
    )
  }

  const novoCriterio = ref('')
  const novoTema = ref('')
  function addCriterio () {
    return novoCriterio.value.trim() && acao(
      () => criarCriterio(ed.value!.id, novoCriterio.value.trim()), 'Critério adicionado.', () => {
        novoCriterio.value = ''
      },
    )
  }
  function addTema () {
    return novoTema.value.trim() && acao(
      () => criarTema(ed.value!.id, novoTema.value.trim()), 'Tema adicionado.', () => {
        novoTema.value = ''
      },
    )
  }

  async function salvarDados (dados: Record<string, unknown>) {
    await atualizarEdicao(id.value, dados)
    await resumo.run()
  }

  const card = 'rounded-lg border border-gray-200 bg-white p-4'
  const campo = 'rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm'
</script>

<template>
  <div class="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
    <router-link class="text-sm text-blue-600 hover:underline" to="/admin">← Todas as edições</router-link>

    <AsyncView :error="resumo.error.value" :loading="resumo.loading.value && !ed" @retry="resumo.run">
      <template v-if="ed">
        <div class="mt-2 flex flex-wrap items-center gap-3">
          <h1 class="text-2xl font-semibold text-gray-900">{{ ed.nome }} <span class="text-gray-500">{{ ed.ano }}</span></h1>
          <span class="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700" data-testid="status">{{ ROTULO_STATUS[ed.status] }}</span>
        </div>

        <nav class="my-4 flex gap-1 overflow-x-auto border-b border-gray-200">
          <button
            v-for="a in abas"
            :key="a.id"
            class="whitespace-nowrap border-b-2 px-4 py-2 text-sm"
            :class="aba === a.id ? 'border-blue-600 font-medium text-blue-700' : 'border-transparent text-gray-600 hover:text-gray-900'"
            :data-testid="`aba-${a.id}`"
            @click="aba = a.id"
          >{{ a.rotulo }}</button>
        </nav>

        <p v-if="aviso" class="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800" role="status">{{ aviso }}</p>
        <p v-if="erroAcao" class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{{ erroAcao }}</p>

        <!-- RESUMO -->
        <div v-if="aba === 'resumo'" class="grid gap-4">
          <section :class="card">
            <h2 class="mb-3 font-semibold">Fase da edição</h2>

            <ol class="mb-4 flex flex-wrap gap-2">
              <li
                v-for="(s, i) in ORDEM_STATUS"
                :key="s"
                class="rounded-full px-3 py-1 text-sm"
                :class="i < indice ? 'bg-green-100 text-green-800' : i === indice ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'"
              >{{ ROTULO_STATUS[s] }}</li>
            </ol>

            <button
              v-if="proximo"
              class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              data-testid="avancar"
              @click="avancar"
            >Avançar para “{{ ROTULO_STATUS[proximo] }}”</button>

            <p v-else class="text-sm text-gray-500">Edição finalizada: somente leitura.</p>
          </section>

          <section :class="card">
            <h2 class="mb-1 font-semibold">Pré-avaliação</h2>
            <p class="mb-3 text-sm text-gray-600">Quando liberada, as equipes preenchem a pré-avaliação (vale 10% da nota final).</p>

            <div class="flex flex-wrap items-center gap-3">
              <label class="flex items-center gap-2 text-sm">
                <input
                  :checked="ed.pre_avaliacao_liberada"
                  data-testid="toggle-pre"
                  :disabled="finalizada"
                  type="checkbox"
                  @change="alternarPre"
                >
                {{ ed.pre_avaliacao_liberada ? 'Liberada' : 'Desativada' }}
              </label>

              <input v-model="prazo" :class="campo" :disabled="finalizada" type="datetime-local">
              <button class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50" :disabled="finalizada" @click="salvarPrazo">Salvar prazo</button>
            </div>
          </section>

          <section class="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div v-for="[rotulo, valor] in [['Equipes', `${ed.contagens.equipes}/${ed.contagens.maximo_equipes}`], ['Participantes', ed.contagens.participantes], ['Avaliadores', ed.contagens.avaliadores], ['Pré-avaliações', ed.contagens.pre_avaliacoes_preenchidas]]" :key="rotulo" :class="card">
              <p class="text-2xl font-semibold">{{ valor }}</p>
              <p class="text-sm text-gray-500">{{ rotulo }}</p>
            </div>
          </section>

          <section v-if="ed.avaliadores.length > 0" :class="card">
            <h2 class="mb-2 font-semibold">Progresso das avaliações</h2>

            <ul class="grid gap-2 text-sm">
              <li v-for="a in ed.avaliadores" :key="a.user_id" class="flex items-center justify-between gap-3">
                <span class="truncate">{{ a.nome }}</span>
                <span class="shrink-0 text-gray-600">{{ a.notas_lancadas }}/{{ a.notas_esperadas }} notas</span>
              </li>
            </ul>
          </section>

          <p v-if="ed.contagens.avaliadores === 0 || ed.contagens.criterios === 0" class="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Atenção: {{ ed.contagens.criterios === 0 ? 'não há critérios cadastrados (aba Configuração). ' : '' }}{{ ed.contagens.avaliadores === 0 ? 'nenhum avaliador vinculado (aba Avaliadores).' : '' }}
          </p>
        </div>

        <!-- EQUIPES -->
        <AsyncView
          v-else-if="aba === 'equipes'"
          :empty="!equipes.loading.value && !equipes.error.value && (equipes.data.value?.length ?? 0) === 0"
          empty-message="Nenhuma equipe inscrita ainda."
          :error="equipes.error.value"
          :loading="equipes.loading.value"
          @retry="equipes.run"
        >
          <ul class="grid gap-3">
            <li v-for="e in equipes.data.value" :key="e.id" :class="card">
              <div class="flex flex-wrap items-start justify-between gap-2">
                <div class="min-w-0">
                  <p class="font-semibold">{{ e.nome_equipe }} <span v-if="e.abaixo_do_minimo" class="ml-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-normal text-amber-800">abaixo do mínimo</span></p>
                  <p class="text-sm text-gray-600">Projeto: {{ e.projeto.nome_projeto }}<template v-if="e.tema"> · Tema: {{ e.tema }}</template></p>
                </div>

                <div class="text-right text-sm">
                  <p>Pré-avaliação: <strong>{{ e.pre_avaliacao.preenchida ? (e.pre_avaliacao.nota ?? 'enviada') : 'pendente' }}</strong></p>
                  <p>Nota final: <strong>{{ e.nota_final ?? '—' }}</strong></p>
                </div>
              </div>

              <ul class="mt-2 flex flex-wrap gap-2 text-xs">
                <li v-for="m in e.membros" :key="m.id" class="rounded-full bg-gray-100 px-2 py-1" :title="m.email">{{ m.nome }}</li>
              </ul>
              <a
                v-if="e.projeto.link_deploy_projeto"
                class="mt-2 inline-block text-sm text-blue-600 hover:underline"
                :href="e.projeto.link_deploy_projeto"
                rel="noopener"
                target="_blank"
              >{{ e.projeto.link_deploy_projeto }}</a>
            </li>
          </ul>
        </AsyncView>

        <!-- AVALIADORES -->
        <div v-else-if="aba === 'avaliadores'">
          <p class="mb-3 text-sm text-gray-600">Marque quem avaliará esta edição. Só aparecem usuários com perfil de Avaliador (aprovados em Solicitações de perfil).</p>

          <AsyncView
            :empty="!avaliadores.loading.value && !avaliadores.error.value && (avaliadores.data.value?.length ?? 0) === 0"
            empty-message="Nenhum usuário com perfil Avaliador ainda."
            :error="avaliadores.error.value"
            :loading="avaliadores.loading.value"
            @retry="avaliadores.run"
          >
            <ul class="grid gap-2">
              <li v-for="a in avaliadores.data.value" :key="a.user_id" class="flex items-center justify-between gap-3" :class="card">
                <label class="flex min-w-0 items-center gap-3">
                  <input
                    :checked="a.vinculado"
                    :data-testid="`aval-${a.user_id}`"
                    :disabled="finalizada"
                    type="checkbox"
                    @change="alternarAvaliador(a)"
                  >

                  <span class="min-w-0"><span class="block truncate font-medium">{{ a.nome }}</span><span class="block truncate text-sm text-gray-500">{{ a.email }}</span></span>
                </label>

                <span v-if="a.notas_lancadas" class="shrink-0 text-xs text-gray-500">{{ a.notas_lancadas }} notas lançadas</span>
              </li>
            </ul>
          </AsyncView>
        </div>

        <!-- RESULTADOS -->
        <AsyncView
          v-else-if="aba === 'resultados'"
          :empty="!resultados.loading.value && !resultados.error.value && (resultados.data.value?.resultados.length ?? 0) === 0"
          empty-message="Sem equipes para apurar."
          :error="resultados.error.value"
          :loading="resultados.loading.value"
          @retry="resultados.run"
        >
          <p class="mb-3 text-sm text-gray-600">Nota final = 90% da média dos avaliadores + 10% da pré-avaliação, calculada quando todos os avaliadores lançaram todos os critérios. Aqui o admin vê antes de a edição ser finalizada.</p>

          <div class="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table class="w-full text-left text-sm">
              <thead class="bg-gray-50 text-gray-600">
                <tr>
                  <th class="px-3 py-2">#</th><th class="px-3 py-2">Projeto / equipe</th>
                  <th v-for="c in resultados.data.value?.criterios" :key="c.id" class="px-3 py-2">{{ c.nome }}</th>
                  <th v-for="a in resultados.data.value?.avaliadores" :key="a.user_id" class="px-3 py-2">{{ a.nome }}</th>
                  <th class="px-3 py-2">Pré</th><th class="px-3 py-2">Final</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="r in resultados.data.value?.resultados" :key="r.projeto_id" class="border-t border-gray-100">
                  <td class="px-3 py-2 font-semibold">{{ r.posicao ?? '—' }}</td>
                  <td class="px-3 py-2"><p class="font-medium">{{ r.projeto }}</p><p class="text-xs text-gray-500">{{ r.equipe }}</p></td>
                  <td v-for="c in r.por_criterio" :key="c.criterio_id" class="px-3 py-2">{{ c.media ?? '—' }}</td>
                  <td v-for="a in r.por_avaliador" :key="a.user_id" class="px-3 py-2">{{ a.media ?? '—' }} <span class="text-xs text-gray-400">({{ a.avaliados }}/{{ a.de }})</span></td>
                  <td class="px-3 py-2">{{ r.nota_pre_avaliacao ?? '—' }}</td>
                  <td class="px-3 py-2 font-semibold">{{ r.nota_final ?? (r.completo ? '…' : 'incompleto') }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </AsyncView>

        <!-- CONFIG -->
        <div v-else class="grid gap-4">
          <section :class="card">
            <h2 class="mb-3 font-semibold">Dados da edição</h2>
            <EdicaoForm :inicial="ed" :on-salvar="salvarDados" rotulo="Salvar alterações" />
          </section>

          <section :class="card">
            <h2 class="mb-3 font-semibold">Critérios de avaliação</h2>

            <ul class="mb-3 flex flex-wrap gap-2">
              <li v-for="c in ed.criterios" :key="c.id" class="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm">
                {{ c.nome }}
                <button aria-label="Remover critério" class="text-gray-400 hover:text-red-600" @click="acao(() => removerCriterio(c.id), 'Critério removido.')">×</button>
              </li>

              <li v-if="ed.criterios.length === 0" class="text-sm text-gray-500">Nenhum critério.</li>
            </ul>

            <form class="flex gap-2" @submit.prevent="addCriterio">
              <input
                v-model="novoCriterio"
                class="flex-1"
                :class="campo"
                :disabled="finalizada"
                name="criterio"
                placeholder="Ex.: Inovação"
              >

              <button class="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50" :disabled="finalizada" type="submit">Adicionar</button>
            </form>
          </section>

          <section :class="card">
            <h2 class="mb-3 font-semibold">Temas</h2>

            <ul class="mb-3 flex flex-wrap gap-2">
              <li v-for="t in ed.temas" :key="t.id" class="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm">
                {{ t.descricao_tema }}
                <button aria-label="Remover tema" class="text-gray-400 hover:text-red-600" @click="acao(() => removerTema(t.id), 'Tema removido.')">×</button>
              </li>

              <li v-if="ed.temas.length === 0" class="text-sm text-gray-500">Nenhum tema (opcional).</li>
            </ul>

            <form class="flex gap-2" @submit.prevent="addTema">
              <input
                v-model="novoTema"
                class="flex-1"
                :class="campo"
                :disabled="finalizada"
                name="tema"
                placeholder="Ex.: Educação"
              >

              <button class="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50" :disabled="finalizada" type="submit">Adicionar</button>
            </form>
          </section>
        </div>
      </template>
    </AsyncView>
  </div>
</template>
