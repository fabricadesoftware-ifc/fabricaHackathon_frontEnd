<template>
  <div
    class="w-full max-w-3xl mx-auto p-6 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col gap-6"
  >
    <div class="flex flex-col gap-1">
      <h2 class="text-xl font-semibold text-gray-900">{{ title }}</h2>
      <p class="text-sm text-gray-600">{{ subtitle }}</p>
    </div>

    <div class="flex flex-col">
      <LogoUpload :model-value="logo" @update:model-value="handleLogoUpdate" />
    </div>

    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-1.5">
        <label
          class="text-sm font-medium text-gray-700"
          for="team-name"
        >Nome do Projeto</label>

        <input
          id="team-name"
          class="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
          placeholder="Ex: Alugaê"
          type="text"
          :value="teamName"
          @input="handleTeamNameInput"
        >
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-medium text-gray-700" for="bio">Bio</label>

        <div class="relative">
          <textarea
            id="bio"
            v-model="localBio"
            class="w-full px-3.5 py-2.5 pb-7 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm resize-none"
            :maxlength="maxBioLength"
            placeholder="Descreva seu projeto"
            rows="4"
          />

          <span
            class="absolute bottom-2.5 right-3 text-xs text-gray-400 select-none"
          >
            {{ localBio.length }}/{{ maxBioLength }}
          </span>
        </div>
      </div>

      <div class="flex flex-col gap-1.5">
        <label
          class="text-sm font-medium text-gray-700"
          for="deploy-url"
        >Deploy</label>

        <input
          id="deploy-url"
          class="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
          placeholder="Ex: alugae.com.br"
          type="text"
          :value="deployUrl"
          @input="handleDeployInput"
        >

        <p class="text-xs text-gray-500 mt-0.5">
          O link pode ser adicionado depois — mas precisa estar preenchido até o
          fim do evento para a avaliação.
        </p>
      </div>
    </div>

    <div
      class="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100 mt-2"
    >
      <AppButton
        icon="←"
        icon-position="left"
        label="Voltar"
        variant="secondary"
        @click="emit('back')"
      />

      <AppButton
        icon="→"
        icon-position="right"
        label="Continuar para o projeto"
        variant="primary"
        @click="emit('continue')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import AppButton from '../AppButton/index'
  import LogoUpload from '../LogoUpload/index'

  const emit = defineEmits<{
    (e: 'update:logo', value: File | null): void
    (e: 'update:teamName' | 'update:bio' | 'update:deployUrl', value: string): void
    (e: 'back' | 'continue'): void
  }>()

  const props = withDefaults(
    defineProps<{
      title?: string
      subtitle?: string
      logo?: File | string | null
      teamName?: string
      bio?: string
      maxBioLength?: number
      deployUrl?: string
    }>(),
    {
      title: 'Sua equipe',
      subtitle: 'Esses dados aparecem para os avaliadores durante o julgamento.',
      logo: null,
      teamName: '',
      bio: '',
      maxBioLength: 150,
      deployUrl: '',
    },
  )

  function handleLogoUpdate (val: File | null) {
    emit('update:logo', val)
  }

  function handleTeamNameInput (e: Event) {
    const target = e.target as HTMLInputElement
    emit('update:teamName', target.value)
  }

  const localBio = computed({
    get: () => props.bio,
    set: (value: string) => emit('update:bio', value),
  })

  function handleDeployInput (e: Event) {
    const target = e.target as HTMLInputElement
    emit('update:deployUrl', target.value)
  }
</script>
