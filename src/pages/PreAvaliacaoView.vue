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
      sucesso.value = 'Respostas salvas. Sua pré-avaliação está registrada.'
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

  const INPUT = 'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 disabled:bg-gray-100 disabled:text-gray-500'
  const CARTAO = 'rounded-xl border border-gray-200 bg-white p-5'
</script>

<template>
  <div class="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
    <PageHeader
      subtitle="Responda antes da avaliação. Vale 10% da nota final: 10 pontos se a equipe responder, 0 se não responder."
      title="Pré-avaliação"
    />

    <AsyncView :error="error" :lines="8" :loading="loading" @retry="run">
      <div v-if="data" class="mt-6 grid gap-6 lg:grid-cols-[1fr_20rem]">
        <form class="flex flex-col gap-6" @submit.prevent="salvar">
          <!-- Situação do formulário -->
          <div
            class="flex flex-wrap items-center gap-3 rounded-xl border px-4 py-3 text-sm"
            :class="data.aberta ? 'border-green-200 bg-green-50 text-green-800' : 'border-amber-200 bg-amber-50 text-amber-800'"
            role="status"
          >
            <span class="font-semibold">{{ data.aberta ? 'Aberta' : 'Fechada' }}</span>
            <span v-if="data.prazo">Prazo: {{ formatarDataHora(data.prazo) }}</span>
            <span v-if="!data.aberta && data.motivo_fechada">{{ data.motivo_fechada }}</span>
            <span v-else-if="auth.userRole !== 'PARTICIPANTE'">Visualização somente leitura.</span>
          </div>

          <!-- 1. Equipe e organização -->
          <section :class="CARTAO">
            <h2 class="mb-1 text-lg font-semibold text-gray-900">1. Equipe e organização</h2>
            <p class="mb-4 text-sm text-gray-500">Informe a área de cada integrante e como a equipe se organizou.</p>

            <div class="flex flex-col gap-3">
              <label v-for="pessoa in data.integrantes" :key="pessoa.id" class="flex flex-col gap-1 text-sm text-gray-700">
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

              <p v-for="m in errosDe('responsabilidades')" :key="m" class="text-sm text-red-600">{{ m }}</p>

              <label class="flex flex-col gap-1 text-sm text-gray-700">
                Como a equipe se organizou?
                <select v-model="texto.organizacao_metodo" :class="INPUT" :disabled="somenteLeitura">
                  <option value="">Selecione</option>
                  <option v-for="o in data.opcoes.organizacao_metodo" :key="o.valor" :value="o.valor">{{ o.rotulo }}</option>
                </select>
              </label>

              <p v-for="m in errosDe('organizacao_metodo')" :key="m" class="text-sm text-red-600">{{ m }}</p>

              <label class="flex flex-col gap-1 text-sm text-gray-700">
                Link do quadro de tarefas (opcional)
                <input
                  v-model="texto.organizacao_link"
                  :class="INPUT"
                  :disabled="somenteLeitura"
                  placeholder="https://..."
                  type="url"
                >
              </label>

              <p v-for="m in errosDe('organizacao_link')" :key="m" class="text-sm text-red-600">{{ m }}</p>
            </div>
          </section>

          <!-- 2. Entendimento do problema -->
          <section :class="CARTAO">
            <h2 class="mb-1 text-lg font-semibold text-gray-900">2. Entendimento do problema</h2>
            <p class="mb-4 text-sm text-gray-500">Conte com suas palavras; não há mínimo de caracteres.</p>

            <div class="flex flex-col gap-4">
              <div v-for="p in TEXTOS_PROBLEMA" :key="p.campo" class="flex flex-col gap-1">
                <label class="text-sm text-gray-700" :for="p.campo">{{ p.rotulo }}</label>

                <textarea
                  :id="p.campo"
                  v-model="texto[p.campo]"
                  :class="INPUT"
                  :disabled="somenteLeitura"
                  rows="3"
                />

                <div class="flex justify-between text-xs">

                  <span v-for="m in errosDe(p.campo)" :key="m" class="text-red-600">{{ m }}</span>
                </div>
              </div>
            </div>
          </section>

          <!-- 3. Arquivos de arquitetura -->
          <section :class="CARTAO">
            <h2 class="mb-1 text-lg font-semibold text-gray-900">3. Arquivos de arquitetura</h2>
            <p class="mb-4 text-sm text-gray-500">PDF, DOC, DOCX, MD, TXT, PNG, JPG ou WEBP, até 10 MB.</p>

            <div class="flex flex-col gap-4">
              <div class="flex flex-col gap-1 text-sm text-gray-700">
                <span>Arquivo de RFs e RNFs <strong class="text-red-600">(obrigatório)</strong></span>

                <a
                  v-if="data.arquivo_rfs_rnfs"
                  class="text-blue-600 underline"
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

                <p v-for="m in errosDe('arquivo_rfs_rnfs')" :key="m" class="text-red-600">{{ m }}</p>
              </div>

              <div class="flex flex-col gap-1 text-sm text-gray-700">
                <span>Arquitetura (requisitos e tabelas do banco): envie um arquivo <em>ou</em> informe um link</span>

                <a
                  v-if="data.arquitetura_arquivo"
                  class="text-blue-600 underline"
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

                <p v-for="m in errosDe('arquitetura_arquivo')" :key="m" class="text-red-600">{{ m }}</p>

                <input
                  v-model="texto.arquitetura_link"
                  :class="INPUT"
                  :disabled="somenteLeitura"
                  placeholder="https://..."
                  type="url"
                >

                <p v-for="m in errosDe('arquitetura_link')" :key="m" class="text-red-600">{{ m }}</p>
              </div>
            </div>
          </section>

          <!-- 4. Aplicação hospedada -->
          <section :class="CARTAO">
            <h2 class="mb-4 text-lg font-semibold text-gray-900">4. Aplicação hospedada</h2>

            <div class="flex flex-col gap-3">
              <label class="flex flex-col gap-1 text-sm text-gray-700">
                Onde a aplicação foi hospedada?
                <select v-model="texto.hospedagem_plataforma" :class="INPUT" :disabled="somenteLeitura">
                  <option value="">Selecione</option>
                  <option v-for="o in data.opcoes.hospedagem_plataforma" :key="o.valor" :value="o.valor">{{ o.rotulo }}</option>
                </select>
              </label>

              <p v-for="m in errosDe('hospedagem_plataforma')" :key="m" class="text-sm text-red-600">{{ m }}</p>

              <label class="flex flex-col gap-1 text-sm text-gray-700">
                Link da aplicação
                <input
                  v-model="texto.hospedagem_link"
                  :class="INPUT"
                  :disabled="somenteLeitura"
                  placeholder="https://..."
                  type="url"
                >
              </label>

              <p v-for="m in errosDe('hospedagem_link')" :key="m" class="text-sm text-red-600">{{ m }}</p>

              <p v-if="hospedagemLocal" class="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800" role="alert">
                Aplicação local vale só 50% deste item. Hospede em uma plataforma online e informe o link público.
              </p>

              <label class="flex flex-col gap-1 text-sm text-gray-700">
                Por que hospedaram aí?
                <textarea v-model="texto.hospedagem_justificativa" :class="INPUT" :disabled="somenteLeitura" rows="3" />
              </label>

              <p v-for="m in errosDe('hospedagem_justificativa')" :key="m" class="text-sm text-red-600">{{ m }}</p>
            </div>
          </section>

          <!-- 5. Banco de dados -->
          <section :class="CARTAO">
            <h2 class="mb-4 text-lg font-semibold text-gray-900">5. Banco de dados</h2>

            <div class="flex flex-col gap-3">
              <label class="flex flex-col gap-1 text-sm text-gray-700">
                Onde foi feito o deploy do banco?
                <select v-model="texto.banco_plataforma" :class="INPUT" :disabled="somenteLeitura">
                  <option value="">Selecione</option>
                  <option v-for="o in data.opcoes.banco_plataforma" :key="o.valor" :value="o.valor">{{ o.rotulo }}</option>
                </select>
              </label>

              <p v-for="m in errosDe('banco_plataforma')" :key="m" class="text-sm text-red-600">{{ m }}</p>

              <p v-if="bancoLocal" class="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800" role="alert">
                Banco local vale só 50% deste item.
              </p>

              <label class="flex flex-col gap-1 text-sm text-gray-700">
                Por que essa escolha?
                <textarea v-model="texto.banco_justificativa" :class="INPUT" :disabled="somenteLeitura" rows="3" />
              </label>

              <p v-for="m in errosDe('banco_justificativa')" :key="m" class="text-sm text-red-600">{{ m }}</p>
            </div>
          </section>

          <p v-if="erroGeral" class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {{ erroGeral }}
          </p>

          <p v-if="sucesso" class="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800" role="status">
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
        <aside aria-label="Pontuação" class="h-fit rounded-xl border border-gray-200 bg-white p-5 lg:sticky lg:top-4">
          <h2 class="text-lg font-semibold text-gray-900">Pontuação</h2>
          <p class="mt-1 text-3xl font-bold text-blue-600" data-testid="nota-pre">{{ Number(data.nota).toFixed(0) }}<span class="text-base font-medium text-gray-500"> / 10</span></p>
          <p v-if="Number(data.nota) > 0" class="mt-2 text-sm text-green-700">Pré-avaliação respondida: vale os 10 pontos.</p>
          <p v-else class="mt-2 text-sm text-gray-500">Responda e salve ao menos uma parte do formulário para receber os 10 pontos. Sem resposta, a nota é 0.</p>
        </aside>
      </div>
    </AsyncView>
  </div>
</template>
