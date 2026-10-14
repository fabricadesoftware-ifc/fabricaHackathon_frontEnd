<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageHeader from '@/components/ui/PageHeader/PageHeader.vue'
import ProgressStepper from '@/components/ui/progressStepper.vue'
import TeamRegistrationCard from '@/components/ui/TeamRegistrationCard/teamRegistrationCard.vue'
import ProjectDetailsCard from '@/components/ui/ProjectDetailsCard/ProjectDetailsCard.vue'
import RegistrationReviewCard from '@/components/ui/RegistrationReviewCard/RegistrationReviewCard.vue'
import SuccessState from '@/components/ui/SucessState/sucessState.vue'

interface RegistrationForm {
  teamName: string
  participants: string[]
  logo: File | string | null
  bio: string
  deployUrl: string
}

type Step = 0 | 1 | 2 | 3

const STEPS: string[] = ['Sua equipe', 'Seu projeto', 'Revisão', 'Confirmação']

// Limites de participantes por equipe. Ajustar conforme as regras da edição
// quando esses dados vierem do backend.
const TEAM_LIMITS = { min: 2, max: 5 }

// Limite de caracteres da bio do projeto
const BIO_MAX_LENGTH = 150

const router = useRouter()
const route = useRoute()

// Nome da edição vem pela URL (/projetos/novo?edicao=HackIFC). Quando o
// backend existir, trocar por um id de edição e buscar o nome real.
const edition = computed(() => {
  const value = route.query.edicao
  return typeof value === 'string' && value.trim() ? value : 'Edição atual'
})

const NOT_INFORMED = 'Não informado'

// Estado do envio
const isSubmitting = ref(false)
const submitError = ref('')

// Etapa atual: 0 = equipe, 1 = projeto, 2 = revisão, 3 = confirmação
const currentStep = ref<Step>(0)

// Estado centralizado, compartilhado entre todas as etapas.
// Como ele vive na view (e não nos cards), voltar uma etapa não apaga nada.
const form = reactive<RegistrationForm>({
  teamName: '',
  participants: [],
  logo: null,
  bio: '',
  deployUrl: '',
})

// Mensagem de validação da etapa atual
const stepError = ref('')

function goToStep (step: Step) {
  stepError.value = ''
  currentStep.value = step
}

// Some com o aviso assim que o usuário corrige o campo
watch(() => form.teamName, () => {
  stepError.value = ''
})

function onTeamBack () {
  // Primeira etapa: sai do fluxo e volta para a lista de edições
  router.push('/inscricao')
}

function onTeamContinue () {
  if (!form.teamName.trim()) {
    stepError.value = 'Informe o nome da equipe antes de continuar.'
    return
  }
  goToStep(1)
}

function onProjectContinue () {
  if (!form.teamName.trim()) {
    stepError.value = 'Informe o nome da equipe antes de continuar.'
    return
  }
  goToStep(2)
}

interface RegistrationPayload extends RegistrationForm {
  edition: string
}

// TODO(backend): trocar o corpo por a chamada real da API (POST da inscrição).
// É o único ponto que precisa mudar quando o backend estiver disponível.
// Em desenvolvimento, abrir /projetos/novo?simularErro=1 força uma falha
// para testar o tratamento de erro.
async function submitRegistration (_payload: RegistrationPayload): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 1200))

  if (import.meta.env.DEV && route.query.simularErro === '1') {
    throw new Error('Falha simulada no envio da inscrição')
  }
}

async function onConfirm () {
  // Evita envio duplicado por clique repetido
  if (isSubmitting.value) return

  isSubmitting.value = true
  submitError.value = ''

  try {
    await submitRegistration({ ...form, edition: edition.value })
    goToStep(3)
  } catch {
    // Mantém o usuário na revisão, com os dados intactos, para tentar de novo
    submitError.value = 'Não foi possível concluir a inscrição. Verifique sua conexão e tente novamente.'
  } finally {
    isSubmitting.value = false
  }
}

function onFinish () {
  router.push('/projetos')
}

defineExpose({ form, currentStep, goToStep })
</script>

<template>
  <div class="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
    <template v-if="currentStep < 3">
      <PageHeader
        subtitle="Preencha os dados da sua equipe e do seu projeto para concluir a inscrição."
        title="Inscrição na edição"
      />

      <div class="mt-6 flex justify-center">
        <ProgressStepper :current-step="currentStep" :steps="STEPS" />
      </div>
    </template>

    <div
      v-if="stepError"
      class="mx-auto mt-4 max-w-2xl rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      role="alert"
    >
      {{ stepError }}
    </div>

    <div
      v-if="submitError"
      class="mx-auto mt-4 max-w-3xl rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      role="alert"
    >
      {{ submitError }}
    </div>

    <div class="relative mt-6" :aria-busy="isSubmitting">
      <!-- Etapa 1: Sua equipe -->
      <TeamRegistrationCard
        v-if="currentStep === 0"
        v-model:participants="form.participants"
        v-model:team-name="form.teamName"
        :max-participants="TEAM_LIMITS.max"
        :min-participants="TEAM_LIMITS.min"
        @back="onTeamBack"
        @continue="onTeamContinue"
      />

      <!-- Etapa 2: Seu projeto -->
      <ProjectDetailsCard
        v-else-if="currentStep === 1"
        v-model:bio="form.bio"
        v-model:deploy-url="form.deployUrl"
        v-model:logo="form.logo"
        v-model:team-name="form.teamName"
        :max-bio-length="BIO_MAX_LENGTH"
        subtitle="Esses dados aparecem para os avaliadores durante o julgamento."
        title="Seu projeto"
        @back="goToStep(0)"
        @continue="onProjectContinue"
      />

      <!-- Etapa 3: Revisão -->
      <RegistrationReviewCard
        v-else-if="currentStep === 2"
        :deploy-url="form.deployUrl.trim() || NOT_INFORMED"
        :edition="edition"
        :participants="form.participants"
        :project-name="form.teamName"
        :team-name="form.teamName"
        :theme="form.bio.trim() || NOT_INFORMED"
        @back="goToStep(1)"
        @confirm="onConfirm"
      />

      <!-- Etapa 4: Confirmação (sem voltar) -->
      <div v-else class="flex min-h-[60vh] items-center justify-center">
        <SuccessState
          button-label="Ver meus projetos"
          :description="`Sua equipe foi inscrita em ${edition}. Você pode acompanhar tudo em Meus projetos.`"
          title="Inscrição confirmada!"
          @click="onFinish"
        />
      </div>

      <!-- Bloqueia a tela e mostra loading durante o envio -->
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
