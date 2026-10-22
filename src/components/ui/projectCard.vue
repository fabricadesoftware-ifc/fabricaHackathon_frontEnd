<template>
  <div class="flex flex-col justify-between w-full bg-white border-1 rounded-md border-solid border-[#E5E7EB] p-5">

    <div class="flex items-start justify-between">
      <div class="w-12 h-12 rounded-full border border-gray-200 overflow-hidden flex items-center justify-center">
        <img v-if="logo" :alt="title" class="w-full h-full object-cover" :src="logo">
        <span v-else class="mdi mdi-lightbulb-outline text-2xl text-gray-400" />
      </div>

      <statusProject :label="statusLabel" :status="status" />
    </div>

    <h2 class="font-semibold text-base text-gray-900">{{ title }}</h2>

    <p class="text-sm text-gray-500">{{ description }}</p>

    <p class="text-sm text-gray-500">
      Equipe: <span class="font-medium text-gray-900">{{ team }}</span>
    </p>

    <div class="flex items-center gap-2 text-sm text-blue-600 font-medium">
      <span class="mdi mdi-trophy-outline text-lg" />
      <span>{{ event }}</span>
    </div>

    <p v-if="notaFinal" class="text-sm text-gray-500">
      Nota final:
      <span class="font-semibold text-gray-900">{{ notaFinal }}</span>
    </p>

    <RouterLink v-if="preAvaliacaoTo" :to="preAvaliacaoTo"
      class="mt-[1vw] flex items-center gap-2 border border-blue-200 rounded-lg px-4 py-1 text-sm text-blue-700 bg-blue-50 hover:bg-blue-100 w-fit">
      <span class="mdi mdi-clipboard-text-outline text-base" />
      Pré-avaliação
    </RouterLink>

    <button v-if="editavel"
      class="mt-[2vw] flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-1 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 w-fit"
      @click="emit('edit')">
      <span class="mdi mdi-pencil-outline text-base" />
      Editar
    </button>

  </div>
</template>

<script setup lang="ts">
import statusProject from './statusProject.vue'

type Status = 'finalizado' | 'ativo'

withDefaults(defineProps<{
  editavel?: boolean
  /** Nota final já publicada (edição finalizada). */
  notaFinal?: string | null
  /** Destino do botão "Pré-avaliação"; sem valor, o botão não aparece. */
  preAvaliacaoTo?: string
  logo: string
  status: Status
  statusLabel: string
  title: string
  description: string
  team: string
  event: string
}>(), { editavel: false, notaFinal: null, preAvaliacaoTo: undefined })
const emit = defineEmits<{
  (e: 'edit'): void
}>()
</script>
