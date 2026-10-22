<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { obterEdicao } from '@/services/edicoes'
import { criarInscricao } from '@/services/inscricoes'
import { ApiError } from '@/services/http'
import { useAsync } from '@/composables/useAsync'

import PageHeader from '@/components/ui/PageHeader/PageHeader.vue'
import ProgressStepper from '@/components/ui/progressStepper.vue'
import TeamRegistrationCard from '@/components/ui/TeamRegistrationCard/teamRegistrationCard.vue'
import ProjectDetailsCard from '@/components/ui/ProjectDetailsCard/ProjectDetailsCard.vue'
import RegistrationReviewCard from '@/components/ui/RegistrationReviewCard/RegistrationReviewCard.vue'
import SuccessState from '@/components/ui/SucessState/sucessState.vue'

// Dados do formulário de inscrição
interface RegistrationForm {
  teamName: string
  participants: string[]
  projectName: string
  temaId: number | null
  logo: File | string | null
  bio: string
  deployUrl: string
}

type Step = 0 | 1 | 2 | 3

const STEPS = [
  'Sua equipe',
  'Seu projeto',
  'Revisão',
  'Confirmação',
]

const BIO_MAX_LENGTH = 150
const NOT_INFORMED = 'Não informado'

const router = useRouter()
const route = useRoute()

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

// Limites de participantes adicionais
// O backend adiciona automaticamente o criador da equipe
const TEAM_LIMITS = computed(() => ({
  min: Math.max(
    0,
    (edicao.value?.minimo_participantes ?? 3) - 1,
  ),
  max: Math.max(
    0,
    (edicao.value?.maximo_participantes ?? 5) - 1,
  ),
}))

// Dados preenchidos pelo participante
const form = reactive<RegistrationForm>({
  teamName: '',
  participants: [],
  projectName: '',
  temaId: null,
  logo: null,
  bio: '',
  deployUrl: '',
})

// Nome do tema selecionado
const editionTheme = computed(() => {
  const tema = edicao.value?.temas.find(
    tema => tema.id === form.temaId,
  )

  return tema?.descricao_tema ?? NOT_INFORMED
})

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
    form.temaId,
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

  if (form.participants.length < TEAM_LIMITS.value.min) {
    stepError.value =
      `Adicione pelo menos ${TEAM_LIMITS.value.min} colegas antes de continuar.`
    return
  }

  if (form.participants.length > TEAM_LIMITS.value.max) {
    stepError.value =
      `O limite é de ${TEAM_LIMITS.value.max} colegas.`
    return
  }

  goToStep(1)
}

// Validação dos dados do projeto
function onProjectContinue() {
  if (!form.projectName.trim()) {
    stepError.value =
      'Informe o nome do projeto antes de continuar.'
    return
  }

  if (form.temaId === null) {
    stepError.value =
      'Selecione o tema do projeto.'
    return
  }

  if (!form.bio.trim()) {
    stepError.value =
      'Informe a descrição do projeto.'
    return
  }

  goToStep(2)
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

  if (!form.bio.trim()) {
    throw new Error('Informe a descrição do projeto.')
  }

  if (form.temaId === null) {
    throw new Error('Selecione um tema para o projeto.')
  }

  if (
    form.participants.length < TEAM_LIMITS.value.min ||
    form.participants.length > TEAM_LIMITS.value.max
  ) {
    throw new Error('Quantidade de participantes inválida.')
  }

  await criarInscricao({
    edicao: edicaoId.value,
    nome_equipe: form.teamName.trim(),
    tema: form.temaId,

    projeto: {
      nome_projeto: form.projectName.trim(),
      descricao_projeto: form.bio.trim(),

      ...(form.deployUrl.trim() && {
        link_deploy_projeto: form.deployUrl.trim(),
      }),
    },

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
    goToStep(3)
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
    <template v-if="currentStep < 3">
      <PageHeader
        subtitle="Preencha os dados da sua equipe e do seu projeto para concluir a inscrição."
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
        v-model:team-name="form.teamName"
        :max-participants="TEAM_LIMITS.max"
        :min-participants="TEAM_LIMITS.min"
        @back="onTeamBack"
        @continue="onTeamContinue"
      />

      <!-- Etapa 2: Cadastro do projeto -->
      <div
        v-else-if="currentStep === 1"
        class="flex flex-col gap-6"
      >
        <!-- Seleção do tema -->
        <div
          class="mx-auto w-full max-w-3xl rounded-xl border border-gray-200 bg-white p-6"
        >
          <label
            for="tema-projeto"
            class="mb-2 block text-sm font-medium text-gray-700"
          >
            Tema do projeto
          </label>

          <select
            id="tema-projeto"
            v-model="form.temaId"
            class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900"
          >
            <option :value="null" disabled>
              Selecione um tema
            </option>

            <option
              v-for="tema in edicao?.temas ?? []"
              :key="tema.id"
              :value="tema.id"
            >
              {{ tema.descricao_tema }}
            </option>
          </select>
        </div>

        <!-- Informações do projeto -->
        <ProjectDetailsCard
          v-model:bio="form.bio"
          v-model:deploy-url="form.deployUrl"
          v-model:logo="form.logo"
          v-model:team-name="form.projectName"
          :max-bio-length="BIO_MAX_LENGTH"
          subtitle="Esses dados aparecem para os avaliadores durante o julgamento."
          title="Seu projeto"
          @back="goToStep(0)"
          @continue="onProjectContinue"
        />
      </div>

      <!-- Etapa 3: Revisão da inscrição -->
      <RegistrationReviewCard
        v-else-if="currentStep === 2"
        :deploy-url="form.deployUrl.trim() || NOT_INFORMED"
        :edition="edition"
        :participants="form.participants"
        :project-name="form.projectName"
        :team-name="form.teamName"
        :theme="editionTheme"
        @back="goToStep(1)"
        @confirm="onConfirm"
      />

      <!-- Etapa 4: Inscrição concluída -->
      <div
        v-else
        class="flex min-h-[60vh] items-center justify-center"
      >
        <SuccessState
          button-label="Ver meus projetos"
          :description="`Sua equipe foi inscrita em ${edition}. Você pode acompanhar tudo em Meus projetos.`"
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