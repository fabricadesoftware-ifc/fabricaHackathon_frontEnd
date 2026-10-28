<script setup lang="ts">
defineProps<{
  edition: string
  editionLocation?: string
  teamName: string
  projectName: string
  ownerName: string
  ownerEmail: string
  participants: string[]
  imageUrl?: string
  minParticipants: number
  maxParticipants: number
  submitting?: boolean
}>()

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'confirm'): void
}>()
</script>

<template>
  <div class="w-full min-w-0">
    <div class="grid min-w-0 gap-3 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
      <section class="min-w-0 rounded-lg border border-slate-200 bg-white p-5 sm:p-6">
        <div class="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 class="text-xl font-semibold text-slate-800">Revisão da sua equipe</h2>
            <p class="mt-1 text-sm text-slate-600">Confira se todas as informações estão corretas antes de confirmar a inscrição.</p>
          </div>
          <button type="button" class="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-600 hover:bg-slate-50" @click="emit('back')">
            <span class="mdi mdi-pencil-outline text-lg" aria-hidden="true" /> Editar informações
          </button>
        </div>

        <div class="space-y-2">
          <div class="flex min-w-0 items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/40 p-3">
            <span class="mdi mdi-account-group-outline flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-xl text-slate-600" aria-hidden="true" />
            <div class="min-w-0 flex-1"><p class="text-xs font-medium text-slate-500">Nome da equipe</p><p class="truncate text-sm font-medium text-slate-800">{{ teamName }}</p></div>
            <button type="button" class="text-sm font-medium text-blue-600 hover:text-blue-700" aria-label="Editar nome da equipe" @click="emit('back')">Editar</button>
          </div>
          <div class="flex min-w-0 items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/40 p-3">
            <span class="mdi mdi-cube-outline flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-xl text-slate-600" aria-hidden="true" />
            <div class="min-w-0 flex-1"><p class="text-xs font-medium text-slate-500">Nome do projeto</p><p class="truncate text-sm font-medium text-slate-800">{{ projectName }}</p></div>
            <button type="button" class="text-sm font-medium text-blue-600 hover:text-blue-700" aria-label="Editar nome do projeto" @click="emit('back')">Editar</button>
          </div>
          <div class="flex min-w-0 items-start gap-3 rounded-lg border border-slate-200 bg-slate-50/40 p-3">
            <span class="mdi mdi-image-outline flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-xl text-slate-600" aria-hidden="true" />
            <div class="min-w-0 flex-1">
              <p class="text-xs font-medium text-slate-500">Imagem do projeto</p>
              <img v-if="imageUrl" :src="imageUrl" alt="Pré-visualização da imagem do projeto" class="mt-2 h-24 max-w-full rounded-lg border border-slate-200 object-contain">
              <p v-else class="mt-1 text-sm text-slate-600">Nenhuma imagem selecionada.</p>
            </div>
            <button type="button" class="text-sm font-medium text-blue-600 hover:text-blue-700" aria-label="Editar imagem do projeto" @click="emit('back')">Editar</button>
          </div>
          <div class="min-w-0 rounded-lg border border-slate-200 bg-slate-50/40 p-3">
            <div class="mb-3 flex items-center gap-3">
              <span class="mdi mdi-account-multiple-outline flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-xl text-slate-600" aria-hidden="true" />
              <p class="text-sm font-medium text-slate-700">Participantes ({{ participants.length + 1 }}/{{ maxParticipants }})</p>
            </div>
            <ul class="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              <li class="flex min-w-0 items-center gap-2 rounded-lg border border-slate-200 bg-white p-2">
                <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-medium text-blue-600" aria-hidden="true">{{ ownerName.charAt(0).toUpperCase() }}</span>
                <span class="min-w-0"><span class="block truncate text-xs font-semibold text-slate-700">{{ ownerName }} (você)</span><span class="block truncate text-xs text-slate-500" :title="ownerEmail">{{ ownerEmail }}</span></span>
              </li>
              <li v-for="email in participants" :key="email" class="flex min-w-0 items-center gap-2 rounded-lg border border-slate-200 bg-white p-2">
                <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-medium text-blue-600" aria-hidden="true">{{ email.charAt(0).toUpperCase() }}</span>
                <span class="min-w-0"><span class="block truncate text-xs font-semibold text-slate-700">Participante convidado</span><span class="block truncate text-xs text-slate-500" :title="email">{{ email }}</span></span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <aside class="min-w-0 rounded-lg border border-slate-200 bg-slate-50 p-5 sm:p-6" aria-label="Informações da edição">
        <div class="flex gap-3 border-b border-slate-200 pb-5">
          <span class="mdi mdi-calendar-outline flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xl text-blue-600" aria-hidden="true" />
          <div><h3 class="text-sm font-semibold text-slate-700">Edição</h3><p class="mt-1 text-sm text-slate-600">{{ edition }}</p><p v-if="editionLocation" class="mt-1 text-xs text-slate-500">{{ editionLocation }}</p></div>
        </div>
        <div class="flex gap-3 border-b border-slate-200 py-5">
          <span class="mdi mdi-account-group-outline flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xl text-blue-600" aria-hidden="true" />
          <div><h3 class="text-sm font-semibold text-slate-700">Limite de participantes</h3><p class="mt-1 text-sm text-slate-600">{{ minParticipants }} a {{ maxParticipants }} participantes por equipe</p><p class="mt-1 text-xs text-slate-500">Sua equipe atual tem {{ participants.length + 1 }} participantes.</p></div>
        </div>
        <div class="flex gap-3 py-5">
          <span class="mdi mdi-file-document-outline flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xl text-blue-600" aria-hidden="true" />
          <div><h3 class="text-sm font-semibold text-slate-700">Após a inscrição</h3><p class="mt-1 text-sm text-slate-600">O projeto pode ser preenchido e editado depois, em “Meus projetos”.</p></div>
        </div>
        <div class="flex gap-3 rounded-lg border border-blue-100 bg-blue-50 p-3">
          <span class="mdi mdi-information-outline text-xl text-blue-600" aria-hidden="true" />
          <p class="text-sm leading-5 text-slate-600">Revise os dados antes de confirmar. Algumas informações da equipe podem não ser alteradas depois.</p>
        </div>
      </aside>
    </div>

    <div class="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
      <button type="button" class="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 text-sm font-medium text-slate-600 hover:bg-slate-50" @click="emit('back')"><span class="mdi mdi-arrow-left text-lg" aria-hidden="true" /> Voltar</button>
      <button type="button" :disabled="submitting" class="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50" @click="emit('confirm')">Confirmar inscrição <span class="mdi mdi-arrow-right text-lg" aria-hidden="true" /></button>
    </div>
  </div>
</template>
