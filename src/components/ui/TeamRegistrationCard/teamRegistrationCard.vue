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
  <section class="bg-red-400 flex justify-center">
    <div class="min-w-[50vw] bg-white px-[2vw] py-[4vh] border-solid border-3 rounded-2xl border-gray-400">
        <h2 class="text-[1.5rem] font-medium">Sua equipe</h2>
      <p class=" mb-5">
        Esta edição exige de {{ props.minParticipants }} a
        {{ props.maxParticipants }} participantes por equipe
      </p>

    <label>
    <p class="text-[1.2rem] text-gray-800 mb-2">
      Nome da equipe
    </p>
      <input
        placeholder="Ex: Alugaê"
        type="text"
        :value="props.teamName"
        @input="onTeamNameInput"
        class="min-w-full shadow-md bg-gray-200 rounded-lg mb-4 px-3 py-2"
      >
    </label>
    <div >
      <label>
      <p class="text-[1.2rem] text-gray-800 mb-2">
        Participantes (e-mail)
      </p>
      <div class="min-w-full flex justify-between">
        <input
          v-model="emailInput"
          placeholder="Ex: João@gmail.com"
          type="email"
          @keyup.enter="addParticipante"
        class="min-w-[35vw] bg-gray-200 shadow-md rounded-lg mb-4 px-3 py-2.5"
        >
        <AppButton label="+ Adicionar" variant="primary" @click="addParticipante" />
      </div>
      </label>
    </div>

    <p v-if="errorMessage" class="text-red-400 text-[0.8rem]">{{ errorMessage }}</p>

    <ul class="block ">
      <li class="mt-2" v-for="participant in props.participants" :key="participant">
          <InviteChip
            :email="participant"
            status="Convidado"
            @remove="removeParticipante(participant)"
            />
      </li>
    </ul>
    
    <p class="my-5 text-[0.8rem]">{{ progressText }}</p>
    <div class="flex justify-between my-8">
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
