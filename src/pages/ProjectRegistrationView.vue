<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { obterEdicao } from '@/services/edicoes'
import { criarInscricao } from '@/services/inscricoes'
import { useAuthStore } from '@/stores/auth'
import { ApiError } from '@/services/http'
import { useAsync } from '@/composables/useAsync'

import PageHeader from '@/components/ui/PageHeader/PageHeader.vue'
import ProgressStepper from '@/components/ui/progressStepper.vue'
import TeamRegistrationCard from '@/components/ui/TeamRegistrationCard/teamRegistrationCard.vue'
import RegistrationReviewCard from '@/components/ui/RegistrationReviewCard/RegistrationReviewCard.vue'
import SuccessState from '@/components/ui/SucessState/sucessState.vue'

// Dados do formulário de inscrição
interface RegistrationForm {
  teamName: string
  projectName: string
  participants: string[]
}

type Step = 0 | 1 | 2

const STEPS = [
  'Sua equipe',
  'Revisão',
  'Confirmação',
]


const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const ownerEmail = computed(() => auth.user?.email ?? '')
const ownerLabel = computed(() => {
  const u = auth.user
  return u ? (`${u.first_name} ${u.last_name}`.trim() || u.email) : 'Você'
})

// Identifica a edição pela URL
const edicaoId = computed(() => {
  const value = route.query.edicao_id

  if (typeof value !== 'string') return null

  const id = Number(value)

  return Number.isInteger(id) && id > 0 ? id : null
})

// Busca os dados da edição no backend
const { data: edicao } = useAsync(() => {
  if (edicaoId.value === null) {
    return Promise.reject(new Error('Edição inválida.'))
  }

  return obterEdicao(edicaoId.value)
})

// Nome da edição
const edition = computed(() =>
  edicao.value?.nome ?? 'Carregando edição...',
)

// Limites reais da edição, contando o criador como participante 1.
const TEAM_LIMITS = computed(() => ({
  min: edicao.value?.minimo_participantes ?? 3,
  max: edicao.value?.maximo_participantes ?? 5,
}))

// Dados preenchidos pelo participante
const form = reactive<RegistrationForm>({
  teamName: '',
  projectName: '',
  participants: [],
})

// Total de participantes (convidados + criador)
const totalParticipantes = computed(() => form.participants.length + 1)

// Estados da inscrição
const isSubmitting = ref(false)
const submitError = ref('')
const stepError = ref('')
const currentStep = ref<Step>(0)

// Navegação entre etapas
function goToStep(step: Step) {
  stepError.value = ''
  currentStep.value = step
}

// Limpa os erros quando o formulário é alterado
watch(
  () => [
    form.teamName,
    form.projectName,
    form.participants,
  ],
  () => {
    stepError.value = ''
  },
)

// Volta para a página da edição
function onTeamBack() {
  if (edicaoId.value !== null) {
    router.push(`/edicoes/${edicaoId.value}`)
  } else {
    router.push('/edicoes')
  }
}

// Validação dos dados da equipe
function onTeamContinue() {
  if (!edicao.value) {
    stepError.value =
      'Não foi possível carregar os dados da edição.'
    return
  }

  if (edicao.value.status !== 'INSCRICAO') {
    stepError.value =
      'As inscrições desta edição não estão abertas.'
    return
  }

  if (!form.teamName.trim()) {
    stepError.value =
      'Informe o nome da equipe antes de continuar.'
    return
  }

  if (!form.projectName.trim()) {
    stepError.value =
      'Informe o nome do projeto antes de continuar.'
    return
  }

  if (totalParticipantes.value < TEAM_LIMITS.value.min) {
    stepError.value =
      `A equipe precisa de pelo menos ${TEAM_LIMITS.value.min} participantes (contando com você). Faltam ${TEAM_LIMITS.value.min - totalParticipantes.value}.`
    return
  }

  if (totalParticipantes.value > TEAM_LIMITS.value.max) {
    stepError.value =
      `O limite é de ${TEAM_LIMITS.value.max} participantes por equipe.`
    return
  }

  goToStep(1)
}

// Envia a inscrição para o Django
async function submitRegistration(): Promise<void> {
  if (edicaoId.value === null || !edicao.value) {
    throw new Error('Edição inválida.')
  }

  if (edicao.value.status !== 'INSCRICAO') {
    throw new Error('As inscrições desta edição estão fechadas.')
  }

  if (!form.teamName.trim()) {
    throw new Error('Informe o nome da equipe.')
  }

  if (!form.projectName.trim()) {
    throw new Error('Informe o nome do projeto.')
  }

  if (
    totalParticipantes.value < TEAM_LIMITS.value.min ||
    totalParticipantes.value > TEAM_LIMITS.value.max
  ) {
    throw new Error('Quantidade de participantes inválida.')
  }

  await criarInscricao({
    edicao: edicaoId.value,
    nome_equipe: form.teamName.trim(),
    projeto: { nome_projeto: form.projectName.trim() },
    membros: form.participants.map(email => email.trim()),
  })
}

// Confirma o cadastro da inscrição
async function onConfirm() {
  if (isSubmitting.value) return

  isSubmitting.value = true
  submitError.value = ''

  try {
    await submitRegistration()

    // Só mostra a confirmação após o backend salvar os dados
    goToStep(2)
  } catch (error) {
    if (error instanceof ApiError) {
      const mensagens = Object.values(error.fields).flat()

      submitError.value = mensagens.length
        ? mensagens.join(' ')
        : error.message
    } else {
      submitError.value =
        error instanceof Error
          ? error.message
          : 'Não foi possível concluir a inscrição.'
    }
  } finally {
    isSubmitting.value = false
  }
}

// Redireciona para Meus projetos
function onFinish() {
  router.push('/projetos')
}

defineExpose({
  form,
  currentStep,
  goToStep,
})
</script>

<template>
  <div class="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">

    <!-- Cabeçalho e etapas -->
    <template v-if="currentStep < 2">
      <PageHeader
        subtitle="Monte sua equipe para concluir a inscrição. O projeto você completa depois."
        title="Inscrição na edição"
      />

      <div class="mt-6 flex justify-center">
        <ProgressStepper
          :current-step="currentStep"
          :steps="STEPS"
        />
      </div>
    </template>

    <!-- Erros de validação -->
    <div
      v-if="stepError"
      class="mx-auto mt-4 max-w-2xl rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      role="alert"
    >
      {{ stepError }}
    </div>

    <!-- Erros retornados pelo Django -->
    <div
      v-if="submitError"
      class="mx-auto mt-4 max-w-3xl rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      role="alert"
    >
      {{ submitError }}
    </div>

    <div
      class="relative mt-6"
      :aria-busy="isSubmitting"
    >

      <!-- Etapa 1: Cadastro da equipe -->
      <TeamRegistrationCard
        v-if="currentStep === 0"
        v-model:participants="form.participants"
        v-model:project-name="form.projectName"
        v-model:team-name="form.teamName"
        :max-participants="TEAM_LIMITS.max"
        :min-participants="TEAM_LIMITS.min"
        :owner-email="ownerEmail"
        :owner-label="ownerLabel"
        @back="onTeamBack"
        @continue="onTeamContinue"
      />

      <!-- Etapa 2: Revisão da inscrição -->
      <RegistrationReviewCard
        v-else-if="currentStep === 1"
        :edition="edition"
        :participants="[`${ownerLabel} (você)`, ...form.participants]"
        :project-name="form.projectName"
        :team-name="form.teamName"
        @back="goToStep(0)"
        @confirm="onConfirm"
      />

      <!-- Etapa 3: Inscrição concluída -->
      <div
        v-else
        class="flex min-h-[60vh] items-center justify-center"
      >
        <SuccessState
          button-label="Ver meus projetos"
          :description="`Sua equipe foi inscrita em ${edition}. Em Meus projetos você completa descrição, tema e logo, e a pré-avaliação (com o link do sistema) fica por lá também.`"
          title="Inscrição confirmada!"
          @click="onFinish"
        />
      </div>

      <!-- Carregamento durante o cadastro -->
      <div
        v-if="isSubmitting"
        class="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/70"
        role="status"
      >
        <span class="flex items-center gap-2 text-sm font-medium text-gray-700">
          <span class="mdi mdi-loading mdi-spin text-xl text-blue-600" />
          Enviando inscrição...
        </span>
      </div>

    </div>
  </div>
</template>