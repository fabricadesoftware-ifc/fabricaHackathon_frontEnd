<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import EvaluationProjectCard from '@/components/ui/EvaluationProjectCard/EvaluationProjectCard.vue'
import EvaluationCriteriaCard from '@/components/ui/EvaluationCriteriaCard/EvaluationCriteriaCard.vue'
import FinalScoreBar from '@/components/ui/FinalScoreBar/FinalScoreBar.vue'
import AppButton from '@/components/ui/AppButton/AppButton.vue'
import SuccessState from '@/components/ui/SucessState/sucessState.vue'

import { projects } from '@/data/projects'

interface Criterion {
  id: number
  name: string
  score: number | null
  comment: string
}

type Project = (typeof projects)[number]

const route = useRoute()
const router = useRouter()

const editionId = computed(() => Number(route.params.editionId))
const projectId = computed(() => Number(route.params.projectId))

const project = ref<Project | null>(null)

const criteria = ref<Criterion[]>([])

const loading = ref(false)
const error = ref(false)
const isSubmitting = ref(false)
const isSubmitted = ref(false)
const submitError = ref('')

// Critérios temporários até a integração com a API.
const mockCriteria = [
  { id: 1, name: 'Criatividade' },
  { id: 2, name: 'Inovação' },
  { id: 3, name: 'Viabilidade' },
]

const allCriteriaEvaluated = computed(() =>
  criteria.value.length > 0 &&
  criteria.value.every(criterion => criterion.score !== null),
)

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

async function fetchProject() {
  loading.value = true
  error.value = false
  isSubmitted.value = false
  submitError.value = ''

  try {
    // Simulação de carregamento da API.
    await new Promise(resolve => setTimeout(resolve, 400))

    const foundProject = projects.find(
      item => item.id === projectId.value,
    )

    if (!foundProject) {
      project.value = null
      error.value = true
      return
    }

    project.value = foundProject

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

function updateScore(criterion: Criterion, score: number) {
  criterion.score = score
  submitError.value = ''
}

function updateComment(criterion: Criterion, comment: string) {
  criterion.comment = comment
}

function voltarSemAvaliar() {
  router.push(`/avaliacao/${editionId.value}`)
}

async function salvarAvaliacao() {
  if (isSubmitting.value) return

  if (!allCriteriaEvaluated.value) {
    submitError.value = 'Avalie todos os critérios antes de enviar.'
    return
  }

  isSubmitting.value = true
  submitError.value = ''

  try {
    const avaliacao = {
      projetoId: projectId.value,
      edicaoId: editionId.value,
      avaliacoes: criteria.value.map(criterion => ({
        criterioId: criterion.id,
        nota: criterion.score,
        comentario: criterion.comment,
      })),
    }

    // Substituir pela requisição à API quando estiver integrada.
    await new Promise(resolve => setTimeout(resolve, 600))

    console.log('Avaliação enviada (mock):', avaliacao)

    isSubmitted.value = true
  } catch (err) {
    console.error('Erro ao enviar avaliação:', err)
    submitError.value = 'Não foi possível enviar a avaliação. Tente novamente.'
  } finally {
    isSubmitting.value = false
  }
}

onMounted(fetchProject)

watch(
  () => [editionId.value, projectId.value],
  fetchProject,
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
    </div>

    <!-- Avaliação enviada -->
    <SuccessState
      v-else-if="isSubmitted"
      title="Avaliação enviada!"
      :description="`Sua avaliação do projeto ${project?.title} foi registrada.`"
      button-label="Voltar às avaliações"
      class="mt-12"
      @click="voltarSemAvaliar"
    />

    <!-- Formulário -->
    <div v-else-if="project" class="flex flex-col gap-6">
      <EvaluationProjectCard
        :name="project.title"
        :description="project.description"
        :project-url="''"
        :edition-name="project.event"
        :team-name="project.team"
        :avatar="project.logo"
        status="Pendente"
        :score="0"
      />

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

      <FinalScoreBar
        label="Média desta avaliação"
        :score="finalScore"
      />

      <p
        v-if="submitError"
        class="text-sm text-red-600"
        role="alert"
      >
        {{ submitError }}
      </p>

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
          :disabled="isSubmitting"
          :loading="isSubmitting"
          @click="salvarAvaliacao"
        />
      </footer>
    </div>
  </div>
</template>