  <script setup lang="ts">
    import { computed, ref } from 'vue'
    import AppButton from '../AppButton/AppButton.vue'
    import InviteChip from '../InviteChip/inviteChip.vue'

    const props = 
      defineProps<{
        minParticipants: number
        maxParticipants: number
        teamName: string
        projectName: string
        participants: string[]
        /** Quem está inscrevendo a equipe: conta como participante 1. */
        ownerLabel?: string
        ownerEmail?: string
      }>()

    const emit = defineEmits<{
      (e: 'update:teamName', value: string): void
      (e: 'update:projectName', value: string): void
      (e: 'update:participants', value: string[]): void
      (e: 'back'): void
      (e: 'continue'): void
    }>()


    const emailInput = ref('')
    const errorMessage = ref('')

    // O criador da equipe é sempre o participante 1.
    const numParticipantes = computed(() => props.participants.length + 1)
    const faltam = computed(() => Math.max(0, props.minParticipants - numParticipantes.value))
    // O mínimo só vale ao fechar as inscrições: dá para inscrever agora e convidar depois.
    const canContinue = computed(() => !!props.teamName.trim() && !!props.projectName.trim())

    const progressText = computed(() => {
      const base = `${numParticipantes.value} de ${props.maxParticipants} vagas preenchidas`
      return faltam.value > 0
        ? `${base} · a equipe precisa de ${props.minParticipants} participantes até o fim das inscrições (faltam ${faltam.value})`
        : `${base} · mínimo de ${props.minParticipants} atingido`
    })

    function onTeamNameInput (event: Event) {
      emit('update:teamName', (event.target as HTMLInputElement).value)
    }

    function addParticipante () {
      const email = emailInput.value.trim()

      if (!email) {
        errorMessage.value = 'Informe um e-mail.'
        return
      }
      if (!email.includes('@') || !email.includes('.com')) {
        errorMessage.value = 'E-mail inválido.'
        return
      }
      if (props.ownerEmail && props.ownerEmail.toLowerCase() === email.toLowerCase()) {
        errorMessage.value = 'Você já é o participante 1 da equipe.'
        return
      }
      if (
        props.participants.some(
          participant => participant.toLowerCase() === email.toLowerCase(),
        )
      ) {
        errorMessage.value = 'Este e-mail já foi convidado.'
        return
      }
      if (numParticipantes.value >= props.maxParticipants) {
        errorMessage.value = `Limite de ${props.maxParticipants} participantes atingido.`
        return
      }

      emit('update:participants', [...props.participants, email])
      emailInput.value = ''
      errorMessage.value = ''
    }

    function removeParticipante (email: string) {
      emit(
        'update:participants',
      props.participants.filter((p)=> p !== email),
      )
    }

    function handleBack () {
      emit('back')
    }

    function handleContinue () {
      if (!canContinue.value) return
      emit('continue')
    }
  </script>

  <template>
    <section class="flex justify-center px-4">
      <div class="w-full max-w-2xl bg-white px-8 py-8 border border-gray-300 rounded-xl">
        <h2 class="text-2xl font-medium text-gray-900">Sua equipe  </h2>
        <p class="mt-1 mb-8 text-base text-gray-600">
          Esta edição aceita de {{ props.minParticipants }} a
          {{ props.maxParticipants }} participantes por equipe, contando com você. Você pode convidar os colegas agora ou depois.
        </p>

        <label class="block">
          <p class="text-sm text-gray-700 mb-2">Nome da equipe</p>
          <input
            placeholder="Ex: Alugaê"
            type="text"
            :value="props.teamName"
            @input="onTeamNameInput"
            class="w-full bg-gray-50 text-gray-900 placeholder:text-gray-400 rounded-lg border border-gray-100 px-4 py-3 mb-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
        </label>

        <label class="block">
          <p class="text-sm text-gray-700 mb-2">Nome do projeto</p>
          <input
            placeholder="Ex: Alugaê App"
            type="text"
            maxlength="100"
            :value="props.projectName"
            @input="emit('update:projectName', ($event.target as HTMLInputElement).value)"
            class="w-full bg-gray-50 text-gray-900 placeholder:text-gray-400 rounded-lg border border-gray-100 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
          <span class="mt-1 mb-6 block text-xs text-gray-500">Você pode mudar o nome depois. Descrição, tema e logo também ficam para depois.</span>
        </label>

        <div class="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-gray-700" data-testid="aviso-convite">
          <p class="font-medium text-gray-900">Você é o participante 1 ({{ props.ownerLabel || 'você' }}).</p>
          <p class="mt-1">Depois de inscrever a equipe, você recebe um <strong>link de convite</strong> para mandar aos colegas — quem abrir o link e tiver conta entra na equipe.</p>
        </div>

        <p class="mt-4 text-xs text-gray-600">{{ progressText }}</p>

        <div class="flex justify-between items-center mt-8">
          <AppButton
            label="Voltar"
            variant="secondary"
            @click="handleBack"
            icon-position="left"
            icon="🠔"
          />
          <AppButton
            :disabled="!canContinue"
            label="Revisar inscrição"
            variant="primary"
            @click="handleContinue"
            icon-position="right"
            icon="➔"
          />
        </div>
      </div>
    </section>
  </template>
  <style scoped>
  ul {
    display: block;
  }
  ul li {
    display: block ;
  }
  </style>
