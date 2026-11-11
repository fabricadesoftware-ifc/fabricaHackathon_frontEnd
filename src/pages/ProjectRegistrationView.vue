<script setup lang="ts">
  import { computed, onUnmounted, reactive, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import PageHeader from '@/components/ui/PageHeader/PageHeader.vue'
  import RegistrationReviewCard from '@/components/ui/RegistrationReviewCard/RegistrationReviewCard.vue'
  import SuccessState from '@/components/ui/SucessState/sucessState.vue'
  import TeamRegistrationCard from '@/components/ui/TeamRegistrationCard/teamRegistrationCard.vue'
  import { useAsync } from '@/composables/useAsync'
  import { obterEdicao } from '@/services/edicoes'
  import { ApiError } from '@/services/http'
  import { criarInscricao, enviarLogoProjeto } from '@/services/inscricoes'
  import { useAuthStore } from '@/stores/auth'

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
  const logoFile = ref<File | null>(null)
  const logoPreview = ref('')
  const logoWarning = ref('')

  watch(logoFile, file => {
    if (logoPreview.value) URL.revokeObjectURL(logoPreview.value)
    logoPreview.value = file ? URL.createObjectURL(file) : ''
  })
  onUnmounted(() => {
    if (logoPreview.value) URL.revokeObjectURL(logoPreview.value)
  })

  // Total de participantes (convidados + criador)
  const totalParticipantes = computed(() => form.participants.length + 1)

  // Estados da inscrição
  const isSubmitting = ref(false)
  const submitError = ref('')
  const stepError = ref('')
  const currentStep = ref<Step>(0)

  // Navegação entre etapas
  function goToStep (step: Step) {
    stepError.value = ''
    currentStep.value = step
  }

  // Limpa os erros quando o formulário é alterado
  watch(
    () => [
      form.teamName,
      form.projectName,
      form.participants,
      logoFile.value,
    ],
    () => {
      stepError.value = ''
      submitError.value = ''
    },
  )

  // Volta para a página da edição
  function onTeamBack () {
    if (edicaoId.value === null) {
      router.push('/edicoes')
    } else {
      router.push(`/edicoes/${edicaoId.value}`)
    }
  }

  // Validação dos dados da equipe
  function onTeamContinue () {
    if (!edicao.value) {
      stepError.value
        = 'Não foi possível carregar os dados da edição.'
      return
    }

    if (edicao.value.status !== 'INSCRICAO') {
      stepError.value
        = 'As inscrições desta edição não estão abertas.'
      return
    }

    if (!form.teamName.trim()) {
      stepError.value
        = 'Informe o nome da equipe antes de continuar.'
      return
    }

    if (!form.projectName.trim()) {
      stepError.value
        = 'Informe o nome do projeto antes de continuar.'
      return
    }

    if (totalParticipantes.value < TEAM_LIMITS.value.min) {
      stepError.value
        = `A equipe precisa de pelo menos ${TEAM_LIMITS.value.min} participantes (contando com você). Faltam ${TEAM_LIMITS.value.min - totalParticipantes.value}.`
      return
    }

    if (totalParticipantes.value > TEAM_LIMITS.value.max) {
      stepError.value
        = `O limite é de ${TEAM_LIMITS.value.max} participantes por equipe.`
      return
    }

    goToStep(1)
  }

  // Envia a inscrição para o Django
  async function submitRegistration (): Promise<void> {
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
      totalParticipantes.value < TEAM_LIMITS.value.min
      || totalParticipantes.value > TEAM_LIMITS.value.max
    ) {
      throw new Error('Quantidade de participantes inválida.')
    }

    const inscricao = await criarInscricao({
      edicao: edicaoId.value,
      nome_equipe: form.teamName.trim(),
      projeto: { nome_projeto: form.projectName.trim() },
      membros: form.participants.map(email => email.trim()),
    })

    // A logo tem um endpoint próprio e só pode ser enviada depois da criação da equipe.
    if (logoFile.value) {
      try {
        await enviarLogoProjeto(inscricao.id, logoFile.value)
      } catch {
        logoWarning.value = 'A inscrição foi confirmada, mas não foi possível enviar a imagem. Você pode adicioná-la em Meus projetos.'
      }
    }
  }

  // Confirma o cadastro da inscrição
  async function onConfirm () {
    if (isSubmitting.value) return

    isSubmitting.value = true
    submitError.value = ''
    logoWarning.value = ''

    try {
      await submitRegistration()

      // Só mostra a confirmação após o backend salvar os dados
      goToStep(2)
    } catch (error) {
      if (error instanceof ApiError) {
        const mensagens = Object.values(error.fields).flat()

        submitError.value = mensagens.length > 0
          ? mensagens.join(' ')
          : error.message

        // Erro de equipe/membros: volta ao passo do formulário para a pessoa corrigir.
        if (error.fields.membros || error.fields.nome_equipe || error.fields.nome_projeto) {
          currentStep.value = 0
        }
      } else {
        submitError.value
          = error instanceof Error
            ? error.message
            : 'Não foi possível concluir a inscrição.'
      }
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      isSubmitting.value = false
    }
  }

  // Redireciona para Meus projetos
  function onFinish () {
    router.push('/projetos')
  }

  defineExpose({
    form,
    currentStep,
    goToStep,
  })
</script>

<template>
  <div class="w-full min-w-0 py-5">

    <button
      v-if="currentStep < 2"
      class="inline-flex items-center gap-2 text-sm text-app-text-secondary hover:text-app-link"
      type="button"
      @click="currentStep === 0 ? onTeamBack() : goToStep(0)"
    >
      <span aria-hidden="true" class="mdi mdi-arrow-left text-lg" />
      {{ currentStep === 0 ? 'Voltar para a edição' : 'Voltar para sua equipe' }}
    </button>

    <PageHeader
      :subtitle="currentStep === 2 ? 'Sua equipe foi inscrita com sucesso.' : 'Monte sua equipe para concluir a inscrição. O projeto você completa depois.'"
      title="Inscrição na edição"
    />

    <nav aria-label="Etapas da inscrição" class="relative my-7 w-full min-w-0">
      <div aria-hidden="true" class="pointer-events-none absolute left-[16.666%] right-[16.666%] top-5 border-t border-dashed border-app-border-strong" />
      <div aria-hidden="true" class="pointer-events-none absolute left-[16.666%] top-5 border-t-2 border-app-brand-border-600" :style="{ width: `${currentStep * 33.333}%` }" />

      <ol class="relative grid grid-cols-3">
        <li v-for="(step, index) in STEPS" :key="step" :aria-current="currentStep === index ? 'step' : undefined" class="flex min-w-0 flex-col items-center text-center">
          <span
            class="flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold"
            :class="index === currentStep ? 'border-app-brand-border-600 bg-app-action text-app-on-brand' : index < currentStep ? 'border-app-brand-border-300 bg-app-selection-soft text-app-link' : 'border-app-border-strong bg-app-surface text-app-text-muted'"
          >{{ index + 1 }}</span>

          <span class="mt-2 text-xs font-semibold sm:text-sm" :class="currentStep === index ? 'text-app-link' : 'text-app-text-secondary'">{{ step }}</span>
          <span class="mt-0.5 hidden text-xs text-app-text-muted sm:block">{{ index < currentStep ? 'Etapa concluída' : index === currentStep ? ['Monte sua equipe', 'Confirme suas informações', 'Inscrição confirmada'][index] : ['Monte sua equipe', 'Confirme suas informações', 'Finalize sua inscrição'][index] }}</span>
        </li>
      </ol>
    </nav>

    <!-- Erros de validação -->
    <div
      v-if="stepError"
      class="mt-4 flex w-full items-start gap-3 rounded-lg border border-app-danger-border-200 bg-app-danger-surface-50 px-4 py-3 text-sm text-app-danger-text-700"
      role="alert"
    >
      <span aria-hidden="true" class="mdi mdi-alert-circle-outline text-xl" />
      <span>{{ stepError }}</span>
    </div>

    <!-- Erros retornados pelo Django -->
    <div
      v-if="submitError"
      class="mt-4 flex w-full items-start gap-3 rounded-lg border border-app-danger-border-200 bg-app-danger-surface-50 px-4 py-3 text-sm text-app-danger-text-700"
      role="alert"
    >
      <span aria-hidden="true" class="mdi mdi-alert-circle-outline text-xl" />
      <span>{{ submitError }}</span>
    </div>

    <div
      :aria-busy="isSubmitting"
      class="relative mt-6"
    >

      <!-- Etapa 1: Cadastro da equipe -->
      <TeamRegistrationCard
        v-if="currentStep === 0"
        v-model:participants="form.participants"
        v-model:project-name="form.projectName"
        v-model:team-name="form.teamName"
        :edition-location="edicao?.local"
        :edition-name="edicao?.nome"
        :logo-preview="logoPreview"
        :max-participants="TEAM_LIMITS.max"
        :min-participants="TEAM_LIMITS.min"
        :owner-email="ownerEmail"
        :owner-label="ownerLabel"
        @back="onTeamBack"
        @continue="onTeamContinue"
        @update:logo="logoFile = $event"
      />

      <!-- Etapa 2: Revisão da inscrição -->
      <RegistrationReviewCard
        v-else-if="currentStep === 1"
        :edition="edition"
        :edition-location="edicao?.local"
        :image-url="logoPreview"
        :max-participants="TEAM_LIMITS.max"
        :min-participants="TEAM_LIMITS.min"
        :owner-email="ownerEmail"
        :owner-name="ownerLabel"
        :participants="form.participants"
        :project-name="form.projectName"
        :submitting="isSubmitting"
        :team-name="form.teamName"
        @back="goToStep(0)"
        @confirm="onConfirm"
      />

      <!-- Etapa 3: Inscrição concluída -->
      <div
        v-else
        class="flex min-h-[45vh] flex-col items-center justify-center rounded-lg border border-app-border-default bg-app-surface p-6 sm:p-10"
      >
        <SuccessState
          button-label="Ver meus projetos"
          :description="`Sua equipe foi inscrita em ${edition}. Em Meus projetos você pode completar e editar as informações do projeto.`"
          title="Inscrição confirmada!"
          @click="onFinish"
        />

        <p v-if="logoWarning" class="mt-4 rounded-lg border border-app-warning-border-200 bg-app-warning-surface-50 px-4 py-3 text-sm text-app-warning-text-800" role="status">{{ logoWarning }}</p>
      </div>

      <!-- Carregamento durante o cadastro -->
      <div
        v-if="isSubmitting"
        class="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-app-surface/70"
        role="status"
      >
        <span class="flex items-center gap-2 text-sm font-medium text-app-text-body-strong-neutral">
          <span class="mdi mdi-loading mdi-spin text-xl text-app-link" />
          Enviando inscrição...
        </span>
      </div>

    </div>
  </div>
</template>
