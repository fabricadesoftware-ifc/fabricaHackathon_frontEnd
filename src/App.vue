<script lang="ts" setup>
  import { ref } from 'vue'
  import TeamRegistrationCard from './components/ui/TeamRegistrationCard/TeamRegistrationCard.vue'

  const teamName = ref('')
  const participants = ref<string[]>([])

  function handleBack () {
    console.log('Voltar')
  }
  function handlePart () {
    console.log("AAAAAAAAAAA");
  }
  function handleContinue () {
    console.log('Continuar para o projeto:', {
      teamName: teamName.value,
      participants: participants.value,
    })
  }
</script>

<template>
  <teamRegistrationCard
    v-model:participants="participants"
    v-model:team-name="teamName"
    :min-participants="3"
    :max-participants="6"
    @back="handleBack"
    @continue="handleContinue"
  />
</template>
