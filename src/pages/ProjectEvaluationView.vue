<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import EvaluationProjectCard from '@/components/ui/EvaluationProjectCard/EvaluationProjectCard.vue'
import EvaluationCriteriaCard from '@/components/ui/EvaluationCriteriaCard/EvaluationCriteriaCard.vue'
import FinalScoreBar from '@/components/ui/FinalScoreBar/FinalScoreBar.vue'
import AppButton from '@/components/ui/AppButton/AppButton.vue'
import SuccessState from '@/components/ui/SucessState/sucessState.vue'

import {
  useEvaluationsStore,
  MOCK_EVALUATOR_ID,
} from '@/stores/evaluations'

import type { EvaluationProject } from '@/data/evaluationProjects'
import { hackathons } from '@/data/hackathons'

interface Criterion {
  id: number
  name: string
  score: number | null
  comment: string
}

const route = useRoute()
const router = useRouter()
const evaluationsStore = useEvaluationsStore()

// Identificação da edição e do projeto pela URL.
const editionId = computed(() => Number(route.params.editionId))
const projectId = computed(() => Number(route.params.projectId))

// Dados compartilhados.
const project = ref<EvaluationProject | null>(null)

const edition = computed(() =>
  hackathons.find(item => item.id === editionId.value),
)

// Critérios da avaliação.
const criteria = ref<Criterion[]>([])

// Estados da página.
const loading = ref(false)
const error = ref(false)
const isSubmitting = ref(false)
const isSubmitted = ref(false)
const submitError = ref('')

// Critérios mockados até a integração com a API.
const mockCriteria = [
  { id: 1, name: 'Criatividade' },
  { id: 2, name: 'Inovação' },
  { id: 3, name: 'Viabilidade' },
]

// Verifica se todos os critérios foram avaliados.
const allCriteriaEvaluated = computed(() =>
  criteria.value.length > 0 &&
  criteria.value.every(
    criterion =>
      criterion.score !== null &&
      Number.isFinite(criterion.score) &&
      criterion.score >= 0 &&
      criterion.score <= 10,
  ),
)

// Calcula a média simples das notas.
const finalScore = computed(() => {
  const evaluated = criteria.value.filter(
    criterion => criterion.score !== null,
  )

  if (evaluated.length === 0) return 0

  const sum = evaluated.reduce(
    (total, criterion) => total + (criterion.score ?? 0),
    0,
  )

  return sum / evaluated.length
})

// Busca o projeto utilizando a store Pinia.
async function fetchProject() {
  loading.value = true
  error.value = false
  isSubmitted.value = false
  submitError.value = ''
  project.value = null
  criteria.value = []

  try {
    // Simulação de carregamento da API.
    await new Promise(resolve => setTimeout(resolve, 350))

    if (
      !Number.isInteger(editionId.value) ||
      !Number.isInteger(projectId.value) ||
      editionId.value <= 0 ||
      projectId.value <= 0
    ) {
      throw new Error('Edição ou projeto inválido.')
    }

    const foundProject = evaluationsStore.getProject(
      editionId.value,
      projectId.value,
    )

    if (!foundProject) {
      throw new Error('Projeto não encontrado nesta edição.')
    }

    // Verifica se o avaliador já avaliou o projeto.
    const previousEvaluation = evaluationsStore.getEvaluation(
      editionId.value,
      projectId.value,
      MOCK_EVALUATOR_ID,
    )

    // Impede avaliar novamente um projeto já avaliado.
    if (
      foundProject.status === 'avaliado' ||
      previousEvaluation
    ) {
      await router.replace(`/avaliacao/${editionId.value}`)
      return
    }

    project.value = foundProject

    // Inicializa os critérios sem notas.
    criteria.value = mockCriteria.map(criterion => ({
      ...criterion,
      score: null,
      comment: '',
    }))
  } catch (err) {
    console.error('Erro ao carregar projeto:', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

// Atualiza a nota de um critério.
function updateScore(criterion: Criterion, score: number) {
  criterion.score = score
  submitError.value = ''
}

// Atualiza o comentário de um critério.
function updateComment(criterion: Criterion, comment: string) {
  criterion.comment = comment
}

// Volta para a lista de projetos.
function voltarSemAvaliar() {
  router.push(`/avaliacao/${editionId.value}`)
}

// Salva a avaliação na store Pinia.
async function salvarAvaliacao() {
  if (isSubmitting.value || isSubmitted.value) return

  if (!project.value || !allCriteriaEvaluated.value) {
    submitError.value = 'Avalie todos os critérios antes de enviar.'
    return
  }

  isSubmitting.value = true
  submitError.value = ''

  try {
    // Simulação de envio para a API.
    await new Promise(resolve => setTimeout(resolve, 600))

    // Registra a avaliação no Pinia e no localStorage.
    evaluationsStore.submitEvaluation({
      editionId: editionId.value,
      projectId: projectId.value,
      evaluatorId: MOCK_EVALUATOR_ID,

      criteria: criteria.value.map(criterion => ({
        criterionId: criterion.id,
        score: criterion.score!,
        comment: criterion.comment,
      })),
    })

    // Exibe a mensagem de sucesso.
    isSubmitted.value = true
  } catch (err) {
    console.error('Erro ao enviar avaliação:', err)

    submitError.value =
      err instanceof Error
        ? err.message
        : 'Não foi possível enviar a avaliação. Tente novamente.'
  } finally {
    isSubmitting.value = false
  }
}

// Atualiza os dados quando mudar a edição ou o projeto.
watch(
  [editionId, projectId],
  fetchProject,
  { immediate: true },
)
</script>

<template>
  <div class="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">

    <!-- Carregamento -->
    <div
      v-if="loading"
      class="flex min-h-64 items-center justify-center"
    >
      <p class="text-gray-500">
        Carregando projeto...
      </p>
    </div>

    <!-- Erro ao carregar -->
    <div
      v-else-if="error"
      class="flex min-h-64 flex-col items-center justify-center gap-4"
    >
      <p class="text-center text-gray-600">
        Não foi possível carregar o projeto.
      </p>

      <AppButton
        label="Tentar novamente"
        variant="primary"
        @click="fetchProject"
      />

      <AppButton
        label="Voltar para projetos"
        variant="secondary"
        @click="voltarSemAvaliar"
      />
    </div>

    <!-- Avaliação enviada -->
    <SuccessState
      v-else-if="isSubmitted"
      title="Avaliação enviada!"
      :description="`Sua avaliação do projeto ${project?.name} foi registrada.`"
      button-label="Voltar às avaliações"
      class="mt-12"
      @click="voltarSemAvaliar"
    />

    <!-- Formulário de avaliação -->
    <div
      v-else-if="project"
      class="flex flex-col gap-6"
    >
      <!-- Informações do projeto -->
      <EvaluationProjectCard
        :name="project.name"
        description="Projeto participante da edição."
        project-url=""
        :edition-name="edition?.title ?? 'Hackathon'"
        :team-name="project.teamName"
        :avatar="project.avatar ?? ''"
        status="Pendente"
        :score="0"
      />

      <!-- Critérios -->
      <section>
        <h2 class="mb-5 text-xl font-semibold text-gray-900 sm:text-2xl">
          Critérios de avaliação
        </h2>

        <div class="flex flex-col gap-3">
          <EvaluationCriteriaCard
            v-for="criterion in criteria"
            :key="criterion.id"
            :criteria-name="criterion.name"
            :model-value="criterion.score ?? 0"
            :comment="criterion.comment"
            :min="0"
            :max="10"
            :step="0.5"
            @update:model-value="updateScore(criterion, $event)"
            @update:comment="updateComment(criterion, $event)"
          />
        </div>
      </section>

      <!-- Média final -->
      <FinalScoreBar
        label="Média desta avaliação"
        :score="finalScore"
      />

      <!-- Mensagem de erro -->
      <p
        v-if="submitError"
        class="text-sm text-red-600"
        role="alert"
      >
        {{ submitError }}
      </p>

      <!-- Botões -->
      <footer class="flex w-full items-center justify-between gap-3">
        <AppButton
          label="Voltar sem avaliar"
          variant="secondary"
          :disabled="isSubmitting"
          @click="voltarSemAvaliar"
        />

        <AppButton
          :label="isSubmitting ? 'Enviando...' : 'Enviar avaliação'"
          variant="primary"
          :disabled="isSubmitting || !allCriteriaEvaluated"
          :loading="isSubmitting"
          @click="salvarAvaliacao"
        />
      </footer>
    </div>
  </div>
</template>