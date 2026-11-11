<script setup lang="ts">
  import type { CampoArquivo, CampoTexto, PreAvaliacao, PreAvaliacaoPayload, Responsabilidade } from '@/types'
  import { computed, reactive, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import AppButton from '@/components/ui/AppButton/AppButton.vue'
  import { AsyncView } from '@/components/ui/AsyncView'
  import PageHeader from '@/components/ui/PageHeader/PageHeader.vue'
  import { useAsync } from '@/composables/useAsync'
  import { ApiError, obterPreAvaliacao, salvarPreAvaliacao } from '@/services'
  import { useAuthStore } from '@/stores/auth'
  import { CAMPOS_TEXTO } from '@/types'
  import { formatarDataHora, pareceLocal } from '@/utils/format'

  const route = useRoute()
  const router = useRouter()
  const auth = useAuthStore()

  const projetoId = computed(() => String(route.params.projetoId))

  const { data, loading, error, run } = useAsync(() => obterPreAvaliacao(projetoId.value))

  // --- Estado do formulário (cópia editável do que veio da API) ---
  const texto = reactive<Record<CampoTexto, string>>(
    Object.fromEntries(CAMPOS_TEXTO.map(c => [c, ''])) as Record<CampoTexto, string>,
  )
  const areas = reactive<Record<number, string>>({})
  const arquivos = reactive<Partial<Record<CampoArquivo, File>>>({})
  const erros = ref<Record<string, string[]>>({})
  const erroGeral = ref('')
  const sucesso = ref('')
  const salvando = ref(false)

  function preencher (d: PreAvaliacao) {
    for (const campo of CAMPOS_TEXTO) {
      texto[campo] = d[campo] ?? ''
    }
    for (const chave of Object.keys(areas)) {
      delete areas[Number(chave)]
    }
    for (const integrante of d.integrantes) {
      areas[integrante.id] = d.responsabilidades.find(r => r.user === integrante.id)?.area ?? ''
    }
    arquivos.arquivo_rfs_rnfs = undefined
    arquivos.arquitetura_arquivo = undefined
  }

  watch(data, d => {
    if (d) {
      preencher(d)
    }
  }, { immediate: true })

  // Só participantes editam; avaliador/professor/admin apenas visualizam. Formulário fechado também é leitura.
  const somenteLeitura = computed(() => !data.value?.aberta || auth.userRole !== 'PARTICIPANTE')
  const minimo = computed(() => data.value?.opcoes.minimo_caracteres_textos ?? 30)

  const TEXTOS_PROBLEMA: { campo: CampoTexto, rotulo: string }[] = [
    { campo: 'problema_entendido', rotulo: 'Qual problema vocês entenderam que precisavam resolver?' },
    { campo: 'problema_explicacao', rotulo: 'Como explicariam esse problema para alguém de fora?' },
    { campo: 'maior_dificuldade', rotulo: 'Qual foi o maior problema que enfrentaram durante o hackathon?' },
    { campo: 'proximos_passos', rotulo: 'Como veem os próximos passos do projeto?' },
  ]

  const hospedagemLocal = computed(() =>
    texto.hospedagem_plataforma === 'LOCAL' || pareceLocal(texto.hospedagem_link),
  )
  const bancoLocal = computed(() => texto.banco_plataforma === 'LOCAL')

  function escolherArquivo (campo: CampoArquivo, evento: Event) {
    const arquivo = (evento.target as HTMLInputElement).files?.[0]
    arquivos[campo] = arquivo
  }

  function responsabilidadesAtuais (): Responsabilidade[] {
    return Object.entries(areas)
      .map(([user, area]) => ({ user: Number(user), area: area.trim() }))
      .filter(r => r.area !== '')
  }

  // Monta o PATCH só com o que mudou.
  function montarPayload (d: PreAvaliacao): PreAvaliacaoPayload {
    const payload: PreAvaliacaoPayload = {}
    for (const campo of CAMPOS_TEXTO) {
      if (texto[campo] !== (d[campo] ?? '')) {
        payload[campo] = texto[campo]
      }
    }
    const atuais = responsabilidadesAtuais()
    const antigas = d.responsabilidades.filter(r => r.area.trim() !== '')
    const mudou = atuais.length !== antigas.length
      || atuais.some(r => antigas.find(a => a.user === r.user)?.area !== r.area)
    if (mudou) {
      payload.responsabilidades = atuais
    }
    for (const campo of ['arquivo_rfs_rnfs', 'arquitetura_arquivo'] as const) {
      if (arquivos[campo]) {
        payload[campo] = arquivos[campo]
      }
    }
    return payload
  }

  const temAlteracao = computed(() => data.value ? Object.keys(montarPayload(data.value)).length > 0 : false)

  async function salvar () {
    if (!data.value || salvando.value) {
      return
    }
    const payload = montarPayload(data.value)
    if (Object.keys(payload).length === 0) {
      return
    }

    salvando.value = true
    erros.value = {}
    erroGeral.value = ''
    sucesso.value = ''

    try {
      data.value = await salvarPreAvaliacao(projetoId.value, payload)
      sucesso.value = 'Respostas salvas. A pontuação foi atualizada.'
    } catch (error_) {
      if (error_ instanceof ApiError) {
        erros.value = error_.fields
        erroGeral.value = error_.message
      } else {
        erroGeral.value = 'Não foi possível salvar. Tente novamente.'
      }
    } finally {
      salvando.value = false
    }
  }

  const errosDe = (campo: string) => erros.value[campo] ?? []

  const INPUT = 'w-full rounded-lg border border-app-border-strong-neutral bg-app-surface px-3 py-2 text-app-text-strong-neutral disabled:bg-app-surface-muted-neutral disabled:text-app-text-muted-neutral'
  const CARTAO = 'rounded-xl border border-app-border-default-neutral bg-app-surface p-5'
</script>

<template>
  <div class="w-full min-w-0 py-6">
    <PageHeader
      subtitle="Responda antes da avaliação. Vale 10% da nota final e é pontuado automaticamente."
      title="Pré-avaliação"
    />

    <AsyncView :error="error" :lines="8" :loading="loading" @retry="run">
      <div v-if="data" class="mt-6 grid gap-6 lg:grid-cols-[1fr_20rem]">
        <form class="flex flex-col gap-6" @submit.prevent="salvar">
          <!-- Situação do formulário -->
          <div
            class="flex flex-wrap items-center gap-3 rounded-xl border px-4 py-3 text-sm"
            :class="data.aberta ? 'border-app-success-border-200 bg-app-success-surface-50 text-app-success-text-800' : 'border-app-warning-border-200 bg-app-warning-surface-50 text-app-warning-text-800'"
            role="status"
          >
            <span class="font-semibold">{{ data.aberta ? 'Aberta' : 'Fechada' }}</span>
            <span v-if="data.prazo">Prazo: {{ formatarDataHora(data.prazo) }}</span>
            <span v-if="!data.aberta && data.motivo_fechada">{{ data.motivo_fechada }}</span>
            <span v-else-if="auth.userRole !== 'PARTICIPANTE'">Visualização somente leitura.</span>
          </div>

          <!-- 1. Equipe e organização -->
          <section :class="CARTAO">
            <h2 class="mb-1 text-lg font-semibold text-app-text-strong-neutral">1. Equipe e organização</h2>
            <p class="mb-4 text-sm text-app-text-muted-neutral">Informe a área de cada integrante e como a equipe se organizou.</p>

            <div class="flex flex-col gap-3">
              <label v-for="pessoa in data.integrantes" :key="pessoa.id" class="flex flex-col gap-1 text-sm text-app-text-body-strong-neutral">
                {{ pessoa.nome }} — área/responsabilidade
                <input
                  v-model="areas[pessoa.id]"
                  :class="INPUT"
                  :disabled="somenteLeitura"
                  maxlength="60"
                  placeholder="Ex.: back-end, front-end, banco, pitch"
                  type="text"
                >
              </label>

              <p v-for="m in errosDe('responsabilidades')" :key="m" class="text-sm text-app-danger-text-600">{{ m }}</p>

              <label class="flex flex-col gap-1 text-sm text-app-text-body-strong-neutral">
                Como a equipe se organizou?
                <select v-model="texto.organizacao_metodo" :class="INPUT" :disabled="somenteLeitura">
                  <option value="">Selecione</option>
                  <option v-for="o in data.opcoes.organizacao_metodo" :key="o.valor" :value="o.valor">{{ o.rotulo }}</option>
                </select>
              </label>

              <p v-for="m in errosDe('organizacao_metodo')" :key="m" class="text-sm text-app-danger-text-600">{{ m }}</p>

              <label class="flex flex-col gap-1 text-sm text-app-text-body-strong-neutral">
                Link do quadro de tarefas (opcional)
                <input
                  v-model="texto.organizacao_link"
                  :class="INPUT"
                  :disabled="somenteLeitura"
                  placeholder="https://..."
                  type="url"
                >
              </label>

              <p v-for="m in errosDe('organizacao_link')" :key="m" class="text-sm text-app-danger-text-600">{{ m }}</p>
            </div>
          </section>

          <!-- 2. Entendimento do problema -->
          <section :class="CARTAO">
            <h2 class="mb-1 text-lg font-semibold text-app-text-strong-neutral">2. Entendimento do problema</h2>
            <p class="mb-4 text-sm text-app-text-muted-neutral">Mínimo de {{ minimo }} caracteres por resposta para pontuar.</p>

            <div class="flex flex-col gap-4">
              <div v-for="p in TEXTOS_PROBLEMA" :key="p.campo" class="flex flex-col gap-1">
                <label class="text-sm text-app-text-body-strong-neutral" :for="p.campo">{{ p.rotulo }}</label>

                <textarea
                  :id="p.campo"
                  v-model="texto[p.campo]"
                  :class="INPUT"
                  :disabled="somenteLeitura"
                  rows="3"
                />

                <div class="flex justify-between text-xs">
                  <span :class="texto[p.campo].trim().length >= minimo ? 'text-app-success-text-700' : 'text-app-warning-text-700'">
                    {{ texto[p.campo].trim().length }}/{{ minimo }}
                  </span>

                  <span v-for="m in errosDe(p.campo)" :key="m" class="text-app-danger-text-600">{{ m }}</span>
                </div>
              </div>
            </div>
          </section>

          <!-- 3. Arquivos de arquitetura -->
          <section :class="CARTAO">
            <h2 class="mb-1 text-lg font-semibold text-app-text-strong-neutral">3. Arquivos de arquitetura</h2>
            <p class="mb-4 text-sm text-app-text-muted-neutral">PDF, DOC, DOCX, MD, TXT, PNG, JPG ou WEBP, até 10 MB.</p>

            <div class="flex flex-col gap-4">
              <div class="flex flex-col gap-1 text-sm text-app-text-body-strong-neutral">
                <span>Arquivo de RFs e RNFs <strong class="text-app-danger-text-600">(obrigatório)</strong></span>

                <a
                  v-if="data.arquivo_rfs_rnfs"
                  class="text-app-link underline"
                  :href="data.arquivo_rfs_rnfs"
                  rel="noopener"
                  target="_blank"
                >Ver arquivo enviado</a>

                <input
                  v-if="!somenteLeitura"
                  accept=".pdf,.doc,.docx,.md,.txt,.png,.jpg,.jpeg,.webp"
                  :class="INPUT"
                  type="file"
                  @change="escolherArquivo('arquivo_rfs_rnfs', $event)"
                >

                <p v-for="m in errosDe('arquivo_rfs_rnfs')" :key="m" class="text-app-danger-text-600">{{ m }}</p>
              </div>

              <div class="flex flex-col gap-1 text-sm text-app-text-body-strong-neutral">
                <span>Arquitetura (requisitos e tabelas do banco): envie um arquivo <em>ou</em> informe um link</span>

                <a
                  v-if="data.arquitetura_arquivo"
                  class="text-app-link underline"
                  :href="data.arquitetura_arquivo"
                  rel="noopener"
                  target="_blank"
                >Ver arquivo enviado</a>

                <input
                  v-if="!somenteLeitura"
                  accept=".pdf,.doc,.docx,.md,.txt,.png,.jpg,.jpeg,.webp"
                  :class="INPUT"
                  type="file"
                  @change="escolherArquivo('arquitetura_arquivo', $event)"
                >

                <p v-for="m in errosDe('arquitetura_arquivo')" :key="m" class="text-app-danger-text-600">{{ m }}</p>

                <input
                  v-model="texto.arquitetura_link"
                  :class="INPUT"
                  :disabled="somenteLeitura"
                  placeholder="https://..."
                  type="url"
                >

                <p v-for="m in errosDe('arquitetura_link')" :key="m" class="text-app-danger-text-600">{{ m }}</p>
              </div>
            </div>
          </section>

          <!-- 4. Aplicação hospedada -->
          <section :class="CARTAO">
            <h2 class="mb-4 text-lg font-semibold text-app-text-strong-neutral">4. Aplicação hospedada</h2>

            <div class="flex flex-col gap-3">
              <label class="flex flex-col gap-1 text-sm text-app-text-body-strong-neutral">
                Onde a aplicação foi hospedada?
                <select v-model="texto.hospedagem_plataforma" :class="INPUT" :disabled="somenteLeitura">
                  <option value="">Selecione</option>
                  <option v-for="o in data.opcoes.hospedagem_plataforma" :key="o.valor" :value="o.valor">{{ o.rotulo }}</option>
                </select>
              </label>

              <p v-for="m in errosDe('hospedagem_plataforma')" :key="m" class="text-sm text-app-danger-text-600">{{ m }}</p>

              <label class="flex flex-col gap-1 text-sm text-app-text-body-strong-neutral">
                Link da aplicação
                <input
                  v-model="texto.hospedagem_link"
                  :class="INPUT"
                  :disabled="somenteLeitura"
                  placeholder="https://..."
                  type="url"
                >
              </label>

              <p v-for="m in errosDe('hospedagem_link')" :key="m" class="text-sm text-app-danger-text-600">{{ m }}</p>

              <p v-if="hospedagemLocal" class="rounded-lg border border-app-warning-border-200 bg-app-warning-surface-50 px-3 py-2 text-sm text-app-warning-text-800" role="alert">
                Aplicação local vale só 50% deste item. Hospede em uma plataforma online e informe o link público.
              </p>

              <label class="flex flex-col gap-1 text-sm text-app-text-body-strong-neutral">
                Por que hospedaram aí?
                <textarea v-model="texto.hospedagem_justificativa" :class="INPUT" :disabled="somenteLeitura" rows="3" />
              </label>

              <p class="text-xs" :class="texto.hospedagem_justificativa.trim().length >= minimo ? 'text-app-success-text-700' : 'text-app-warning-text-700'">
                {{ texto.hospedagem_justificativa.trim().length }}/{{ minimo }}
              </p>

              <p v-for="m in errosDe('hospedagem_justificativa')" :key="m" class="text-sm text-app-danger-text-600">{{ m }}</p>
            </div>
          </section>

          <!-- 5. Banco de dados -->
          <section :class="CARTAO">
            <h2 class="mb-4 text-lg font-semibold text-app-text-strong-neutral">5. Banco de dados</h2>

            <div class="flex flex-col gap-3">
              <label class="flex flex-col gap-1 text-sm text-app-text-body-strong-neutral">
                Onde foi feito o deploy do banco?
                <select v-model="texto.banco_plataforma" :class="INPUT" :disabled="somenteLeitura">
                  <option value="">Selecione</option>
                  <option v-for="o in data.opcoes.banco_plataforma" :key="o.valor" :value="o.valor">{{ o.rotulo }}</option>
                </select>
              </label>

              <p v-for="m in errosDe('banco_plataforma')" :key="m" class="text-sm text-app-danger-text-600">{{ m }}</p>

              <p v-if="bancoLocal" class="rounded-lg border border-app-warning-border-200 bg-app-warning-surface-50 px-3 py-2 text-sm text-app-warning-text-800" role="alert">
                Banco local vale só 50% deste item.
              </p>

              <label class="flex flex-col gap-1 text-sm text-app-text-body-strong-neutral">
                Por que essa escolha?
                <textarea v-model="texto.banco_justificativa" :class="INPUT" :disabled="somenteLeitura" rows="3" />
              </label>

              <p class="text-xs" :class="texto.banco_justificativa.trim().length >= minimo ? 'text-app-success-text-700' : 'text-app-warning-text-700'">
                {{ texto.banco_justificativa.trim().length }}/{{ minimo }}
              </p>

              <p v-for="m in errosDe('banco_justificativa')" :key="m" class="text-sm text-app-danger-text-600">{{ m }}</p>
            </div>
          </section>

          <p v-if="erroGeral" class="rounded-lg border border-app-danger-border-200 bg-app-danger-surface-50 px-4 py-3 text-sm text-app-danger-text-700" role="alert">
            {{ erroGeral }}
          </p>

          <p v-if="sucesso" class="rounded-lg border border-app-success-border-200 bg-app-success-surface-50 px-4 py-3 text-sm text-app-success-text-800" role="status">
            {{ sucesso }}
          </p>

          <footer class="flex items-center justify-between gap-3">
            <AppButton label="Voltar" variant="secondary" @click="router.back()" />

            <AppButton
              v-if="!somenteLeitura"
              :disabled="salvando || !temAlteracao"
              :label="salvando ? 'Salvando...' : 'Salvar respostas'"
              :loading="salvando"
              variant="primary"
              @click="salvar"
            />
          </footer>
        </form>

        <!-- Painel de pontuação -->
        <aside aria-label="Pontuação" class="h-fit rounded-xl border border-app-border-default-neutral bg-app-surface p-5 lg:sticky lg:top-4">
          <h2 class="text-lg font-semibold text-app-text-strong-neutral">Pontuação</h2>
          <p class="mt-1 text-3xl font-bold text-app-link">{{ Number(data.nota).toFixed(2) }}<span class="text-base font-medium text-app-text-muted-neutral"> / 10</span></p>
          <p v-if="!data.preenchida" class="mt-2 text-sm text-app-text-muted-neutral">Salve suas respostas para ver o detalhe da pontuação.</p>

          <ul v-if="data.detalhe_pontuacao.secoes" class="mt-4 flex flex-col gap-4">
            <li v-for="secao in data.detalhe_pontuacao.secoes" :key="secao.id">
              <p class="flex justify-between text-sm font-semibold text-app-text-heading-neutral">
                <span>{{ secao.titulo }}</span>
                <span>{{ secao.pontos }}/{{ secao.maximo }}</span>
              </p>

              <ul class="mt-1 flex flex-col gap-1">
                <li v-for="item in secao.itens" :key="item.id" class="text-xs text-app-text-secondary-neutral">
                  {{ item.descricao }}: <strong>{{ item.pontos }}/{{ item.maximo }}</strong>
                  <span :class="item.motivo === 'ok' ? 'text-app-success-text-700' : 'text-app-warning-text-700'"> · {{ item.motivo }}</span>
                </li>
              </ul>
            </li>
          </ul>
        </aside>
      </div>
    </AsyncView>
  </div>
</template>
