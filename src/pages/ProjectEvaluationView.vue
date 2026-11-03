<script setup lang="ts">
  import type { MinhaAvaliacao } from '@/types'
  import { computed, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import AppButton from '@/components/ui/AppButton/AppButton.vue'
  import { AsyncView } from '@/components/ui/AsyncView'
  import EvaluationCriteriaCard from '@/components/ui/EvaluationCriteriaCard/EvaluationCriteriaCard.vue'
  import EvaluationProjectCard from '@/components/ui/EvaluationProjectCard/EvaluationProjectCard.vue'
  import FinalScoreBar from '@/components/ui/FinalScoreBar/FinalScoreBar.vue'
  import SuccessState from '@/components/ui/SucessState/sucessState.vue'
  import { useAsync } from '@/composables/useAsync'
  import { ApiError, atualizarNota, lancarNotasLote, listarMinhasAvaliacoes } from '@/services'

  interface Criterion {
    id: number
    name: string
    score: number | null
    comment: string
    /** Nota já lançada no back (PATCH); ausente = critério ainda pendente (POST em lote). */
    notaId?: number
    original?: number
  }

  const route = useRoute()
  const router = useRouter()

  const editionId = computed(() => Number(route.params.editionId))
  const projectId = computed(() => Number(route.params.projectId))

  const criteria = ref<Criterion[]>([])
  const isSubmitting = ref(false)
  const isSubmitted = ref(false)
  const submitError = ref('')

  const { data: avaliacao, loading, error, run } = useAsync(async (): Promise<MinhaAvaliacao> => {
    if (!Number.isInteger(editionId.value) || !Number.isInteger(projectId.value)) {
      throw new TypeError('Edição ou projeto inválido.')
    }
    const item = (await listarMinhasAvaliacoes())
      .find(a => a.edicao === editionId.value && a.projeto.id === projectId.value)
    if (!item) {
      throw new ApiError('client', 'Projeto não encontrado entre as suas avaliações.', 404)
    }
    return item
  })

  // Todos os critérios da edição = já avaliados + pendentes (ordem estável por id).
  watch(avaliacao, item => {
    isSubmitted.value = false
    submitError.value = ''
    if (!item) {
      criteria.value = []
      return
    }
    const todos: Criterion[] = [
      ...item.criterios_avaliados.map(c => ({
        id: c.criterio_id,
        name: c.criterio,
        score: Number(c.nota),
        original: Number(c.nota),
        comment: '',
        notaId: c.nota_id,
      })),
      ...item.criterios_pendentes.map(c => ({
        id: c.criterio_id,
        name: c.criterio,
        score: null,
        comment: '',
      })),
    ]
    // eslint-disable-next-line unicorn/no-array-sort -- lib do projeto não inclui toSorted
    criteria.value = todos.sort((a, b) => a.id - b.id)
  })

  const aberta = computed(() => avaliacao.value?.avaliacao_aberta ?? false)

  const pendentes = computed(() => criteria.value.filter(c => c.notaId === undefined))
  const alterados = computed(() =>
    criteria.value.filter(c => c.notaId !== undefined && (c.score !== c.original || c.comment.trim() !== '')),
  )

  // Todos os critérios pendentes precisam de nota entre 0 e 10 (a API exige todos).
  const allPendingScored = computed(() =>
    pendentes.value.every(c => c.score !== null && c.score >= 0 && c.score <= 10),
  )
  const hasChanges = computed(() => pendentes.value.length > 0 || alterados.value.length > 0)

  const scoredCount = computed(() => criteria.value.filter(c => c.score !== null).length)

  const finalScore = computed(() => {
    const avaliados = criteria.value.filter(c => c.score !== null)
    return avaliados.length === 0
      ? 0
      : avaliados.reduce((soma, c) => soma + (c.score ?? 0), 0) / avaliados.length
  })

  function updateScore (criterion: Criterion, score: number) {
    criterion.score = score
    submitError.value = ''
  }

  function updateComment (criterion: Criterion, comment: string) {
    criterion.comment = comment
  }

  function voltar () {
    router.push(`/avaliacao/${editionId.value}`)
  }

  function mensagemDoErro (err: unknown): string {
    if (err instanceof ApiError) {
      const campos = Object.values(err.fields).flat()
      return campos.length > 0 ? campos.join(' ') : err.message
    }
    return 'Não foi possível enviar a avaliação. Tente novamente.'
  }

  async function salvarAvaliacao () {
    if (isSubmitting.value || isSubmitted.value || !avaliacao.value) {
      return
    }
    if (!allPendingScored.value) {
      submitError.value = 'Avalie todos os critérios antes de enviar.'
      return
    }

    isSubmitting.value = true
    submitError.value = ''

    try {
      // Notas novas: uma chamada atômica. Notas já lançadas: ajuste individual.
      if (pendentes.value.length > 0) {
        await lancarNotasLote(avaliacao.value.projeto.id, pendentes.value.map(c => ({
          criterio: c.id,
          nota: c.score as number,
          ...(c.comment.trim() && { comentario_nota: c.comment.trim() }),
        })))
      }
      for (const c of alterados.value) {
        await atualizarNota(
          c.notaId as number,
          c.score as number,
          c.comment.trim() || undefined,
        )
      }
      isSubmitted.value = true
    } catch (error_) {
      submitError.value = mensagemDoErro(error_)
    } finally {
      isSubmitting.value = false
    }
  }
</script>

<template>
  <div class="evaluation-flow w-full min-w-0">
    <nav aria-label="Navegação de avaliações" class="mb-5">
      <button class="evaluation-back" :disabled="isSubmitting" type="button" @click="voltar"><span aria-hidden="true" class="mdi mdi-arrow-left" /> Projetos da edição</button>
    </nav>

    <AsyncView :error="error" :lines="6" :loading="loading" @retry="run">
      <SuccessState
        v-if="isSubmitted"
        button-label="Voltar às avaliações"
        class="py-12"
        :description="`Sua avaliação do projeto ${avaliacao?.projeto.nome_projeto} foi registrada.`"
        role="status"
        title="Avaliação enviada!"
        @click="voltar"
      />

      <div v-else-if="avaliacao" class="flex flex-col gap-6">
        <EvaluationProjectCard
          avatar=""
          :description="avaliacao.projeto.descricao_projeto || 'Projeto participante da edição.'"
          :edition-name="avaliacao.edicao_nome"
          :name="avaliacao.projeto.nome_projeto"
          :project-url="avaliacao.projeto.link_deploy_projeto ?? ''"
          :score="avaliacao.concluido ? finalScore : 0"
          :status="avaliacao.concluido ? 'Avaliado' : 'Pendente'"
          :team-name="avaliacao.projeto.equipe"
        />

        <p
          v-if="!aberta"
          class="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
          role="status"
        >
          A avaliação desta edição não está aberta: as notas abaixo são somente leitura.
        </p>

        <div class="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
          <section aria-labelledby="criteria-title" class="min-w-0">
            <h2 id="criteria-title" class="text-lg font-semibold text-slate-700">
              Critérios de avaliação
            </h2>

            <p class="mb-2 mt-1 text-sm leading-6 text-slate-500">Atribua uma nota de 0 a 10 para cada critério, em intervalos de 0,5.</p>

            <p v-if="criteria.length === 0" class="text-gray-500">
              Esta edição ainda não tem critérios cadastrados.
            </p>

            <div v-else-if="aberta" class="flex flex-col">
              <EvaluationCriteriaCard
                v-for="criterion in criteria"
                :key="criterion.id"
                :comment="criterion.comment"
                :criteria-name="criterion.name"
                :disabled="isSubmitting"
                :max="10"
                :min="0"
                :model-value="criterion.score"
                :step="0.5"
                @update:comment="updateComment(criterion, $event)"
                @update:model-value="updateScore(criterion, $event)"
              />
            </div>

            <ul v-else class="flex flex-col gap-3">
              <li
                v-for="criterion in criteria"
                :key="criterion.id"
                class="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4"
              >
                <span class="font-semibold text-gray-800">{{ criterion.name }}</span>
                <span class="text-gray-700">{{ criterion.score === null ? 'Sem nota' : criterion.score.toFixed(1) }}</span>
              </li>
            </ul>
          </section>

          <aside aria-labelledby="summary-title" class="rounded-lg border border-slate-200 bg-slate-50 p-5 xl:sticky xl:top-6">
            <h2 id="summary-title" class="text-base font-semibold text-slate-700">Resumo da avaliação</h2>
            <p class="mt-3 text-sm text-slate-600" role="status">{{ scoredCount }} de {{ criteria.length }} critérios preenchidos</p>

            <progress
              v-if="criteria.length > 0"
              aria-label="Critérios preenchidos"
              class="mt-3 mb-4 h-1.5 w-full overflow-hidden rounded-full accent-blue-600"
              :max="criteria.length"
              :value="scoredCount"
            />

            <FinalScoreBar :label="scoredCount < criteria.length ? 'Média parcial' : 'Média desta avaliação'" :score="finalScore" />
            <p v-if="aberta && !allPendingScored" class="mt-4 text-sm leading-6 text-slate-600">Preencha todos os critérios para liberar o envio. Para atribuir zero, selecione o centro do controle de nota.</p>
            <p v-else-if="aberta" class="mt-4 text-sm leading-6 text-slate-500">Revise as notas antes de {{ avaliacao.concluido ? 'salvar as alterações' : 'enviar a avaliação' }}.</p>

            <p v-if="submitError" class="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
              {{ submitError }}
            </p>

            <footer class="evaluation-actions mt-5 flex w-full flex-col-reverse gap-2">
              <AppButton
                :disabled="isSubmitting"
                :label="aberta ? 'Voltar sem salvar' : 'Voltar'"
                variant="secondary"
                @click="voltar"
              />

              <AppButton
                v-if="aberta"
                :disabled="isSubmitting || !hasChanges || !allPendingScored"
                :label="isSubmitting ? 'Enviando...' : (avaliacao.concluido ? 'Salvar alterações' : 'Enviar avaliação')"
                :loading="isSubmitting"
                variant="primary"
                @click="salvarAvaliacao"
              />
            </footer>
          </aside>
        </div>
      </div>
    </AsyncView>
  </div>
</template>

<style scoped src="./evaluation-flow.css"></style>
