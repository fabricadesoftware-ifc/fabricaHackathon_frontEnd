  <script setup lang="ts">
    import { computed, ref } from 'vue'
    import AppButton from '../AppButton/AppButton.vue'
    import InviteChip from '../InviteChip/inviteChip.vue'

    const props = 
      defineProps<{
        minParticipants: number
        maxParticipants: number
        teamName: string
        participants: string[]
      }>()

    const emit = defineEmits<{
      (e: 'update:teamName', value: string): void
      (e: 'update:participants', value: string[]): void
      (e: 'back'): void
      (e: 'continue'): void
    }>()


    const emailInput = ref('')
    const errorMessage = ref('')

    const numParticipantes = computed(() => props.participants.length)
    const canContinue = computed(
      () => numParticipantes.value >= props.minParticipants,
    )

    const progressText = computed(
      () =>
        `${numParticipantes.value} de ${props.maxParticipants} vagas preenchidas · mínimo de ${props.minParticipants} para confirmar a inscrição`,
    )

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
          Esta edição exige de {{ props.minParticipants }} a
          {{ props.maxParticipants }} participantes por equipe
        </p>

        <label class="block">
          <p class="text-sm text-gray-700 mb-2">Nome da equipe</p>
          <input
            placeholder="Ex: Alugaê"
            type="text"
            :value="props.teamName"
            @input="onTeamNameInput"
            class="w-full bg-gray-50 text-gray-900 placeholder:text-gray-400 rounded-lg border border-gray-100 px-4 py-3 mb-6 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
        </label>

        <div>
          <p class="text-sm text-gray-700 mb-2">Participantes (e-mail)</p>
          <div class="flex items-stretch gap-4">
            <input
              v-model="emailInput"
              placeholder="Ex: João@gmail.com"
              type="email"
              @keyup.enter="addParticipante"
              class="flex-1 min-w-0 bg-gray-50 text-gray-900 placeholder:text-gray-400 rounded-lg border border-gray-100 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
            <AppButton label="+ Adicionar" variant="primary" @click="addParticipante" />
          </div>
        </div>

        <p v-if="errorMessage" class="mt-2 text-red-500 text-xs">{{ errorMessage }}</p>

        <div class="flex flex-row flex-wrap gap-3 mt-4">
  <InviteChip
    v-for="participant in props.participants"
    :key="participant"
    :email="participant"
    status="Convidado"
    @remove="removeParticipante(participant)"
  />  
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
            label="Continuar para o projeto"
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
