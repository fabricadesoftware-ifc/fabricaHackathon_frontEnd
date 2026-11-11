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
    (e: 'back' | 'confirm'): void
  }>()
</script>

<template>
  <div class="w-full min-w-0">
    <div class="grid min-w-0 gap-3 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
      <section class="min-w-0 rounded-lg border border-app-border-default bg-app-surface p-5 sm:p-6">
        <div class="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 class="text-xl font-semibold text-app-text-heading">Revisão da sua equipe</h2>
            <p class="mt-1 text-sm text-app-text-secondary">Confira se todas as informações estão corretas antes de confirmar a inscrição.</p>
          </div>

          <button class="inline-flex h-10 items-center gap-2 rounded-lg border border-app-border-default px-3 text-sm font-medium text-app-text-secondary hover:bg-app-surface-subtle" type="button" @click="emit('back')">
            <span aria-hidden="true" class="mdi mdi-pencil-outline text-lg" /> Editar informações
          </button>
        </div>

        <div class="space-y-2">
          <div class="flex min-w-0 items-center gap-3 rounded-lg border border-app-border-default bg-app-surface-subtle/40 p-3">
            <span aria-hidden="true" class="mdi mdi-account-group-outline flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-app-surface text-xl text-app-text-secondary" />
            <div class="min-w-0 flex-1"><p class="text-xs font-medium text-app-text-muted">Nome da equipe</p><p class="truncate text-sm font-medium text-app-text-heading">{{ teamName }}</p></div>
            <button aria-label="Editar nome da equipe" class="text-sm font-medium text-app-link hover:text-app-link-hover" type="button" @click="emit('back')">Editar</button>
          </div>

          <div class="flex min-w-0 items-center gap-3 rounded-lg border border-app-border-default bg-app-surface-subtle/40 p-3">
            <span aria-hidden="true" class="mdi mdi-cube-outline flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-app-surface text-xl text-app-text-secondary" />
            <div class="min-w-0 flex-1"><p class="text-xs font-medium text-app-text-muted">Nome do projeto</p><p class="truncate text-sm font-medium text-app-text-heading">{{ projectName }}</p></div>
            <button aria-label="Editar nome do projeto" class="text-sm font-medium text-app-link hover:text-app-link-hover" type="button" @click="emit('back')">Editar</button>
          </div>

          <div class="flex min-w-0 items-start gap-3 rounded-lg border border-app-border-default bg-app-surface-subtle/40 p-3">
            <span aria-hidden="true" class="mdi mdi-image-outline flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-app-surface text-xl text-app-text-secondary" />

            <div class="min-w-0 flex-1">
              <p class="text-xs font-medium text-app-text-muted">Imagem do projeto</p>
              <img v-if="imageUrl" alt="Pré-visualização da imagem do projeto" class="mt-2 h-24 max-w-full rounded-lg border border-app-border-default object-contain" :src="imageUrl">
              <p v-else class="mt-1 text-sm text-app-text-secondary">Nenhuma imagem selecionada.</p>
            </div>

            <button aria-label="Editar imagem do projeto" class="text-sm font-medium text-app-link hover:text-app-link-hover" type="button" @click="emit('back')">Editar</button>
          </div>

          <div class="min-w-0 rounded-lg border border-app-border-default bg-app-surface-subtle/40 p-3">
            <div class="mb-3 flex items-center gap-3">
              <span aria-hidden="true" class="mdi mdi-account-multiple-outline flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-app-surface text-xl text-app-text-secondary" />
              <p class="text-sm font-medium text-app-text-body-strong">Participantes ({{ participants.length + 1 }}/{{ maxParticipants }})</p>
            </div>

            <ul class="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              <li class="flex min-w-0 items-center gap-2 rounded-lg border border-app-border-default bg-app-surface p-2">
                <span aria-hidden="true" class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-app-selection-soft text-sm font-medium text-app-link">{{ ownerName.charAt(0).toUpperCase() }}</span>
                <span class="min-w-0"><span class="block truncate text-xs font-semibold text-app-text-body-strong">{{ ownerName }} (você)</span><span class="block truncate text-xs text-app-text-muted" :title="ownerEmail">{{ ownerEmail }}</span></span>
              </li>

              <li v-for="email in participants" :key="email" class="flex min-w-0 items-center gap-2 rounded-lg border border-app-border-default bg-app-surface p-2">
                <span aria-hidden="true" class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-app-selection-soft text-sm font-medium text-app-link">{{ email.charAt(0).toUpperCase() }}</span>
                <span class="min-w-0"><span class="block truncate text-xs font-semibold text-app-text-body-strong">Participante convidado</span><span class="block truncate text-xs text-app-text-muted" :title="email">{{ email }}</span></span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <aside aria-label="Informações da edição" class="min-w-0 rounded-lg border border-app-border-default bg-app-surface-subtle p-5 sm:p-6">
        <div class="flex gap-3 border-b border-app-border-default pb-5">
          <span aria-hidden="true" class="mdi mdi-calendar-outline flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-app-selection-soft text-xl text-app-link" />
          <div><h3 class="text-sm font-semibold text-app-text-body-strong">Edição</h3><p class="mt-1 text-sm text-app-text-secondary">{{ edition }}</p><p v-if="editionLocation" class="mt-1 text-xs text-app-text-muted">{{ editionLocation }}</p></div>
        </div>

        <div class="flex gap-3 border-b border-app-border-default py-5">
          <span aria-hidden="true" class="mdi mdi-account-group-outline flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-app-selection-soft text-xl text-app-link" />
          <div><h3 class="text-sm font-semibold text-app-text-body-strong">Limite de participantes</h3><p class="mt-1 text-sm text-app-text-secondary">{{ minParticipants }} a {{ maxParticipants }} participantes por equipe</p><p class="mt-1 text-xs text-app-text-muted">Sua equipe atual tem {{ participants.length + 1 }} participantes.</p></div>
        </div>

        <div class="flex gap-3 py-5">
          <span aria-hidden="true" class="mdi mdi-file-document-outline flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-app-selection-soft text-xl text-app-link" />
          <div><h3 class="text-sm font-semibold text-app-text-body-strong">Após a inscrição</h3><p class="mt-1 text-sm text-app-text-secondary">O projeto pode ser preenchido e editado depois, em “Meus projetos”.</p></div>
        </div>

        <div class="flex gap-3 rounded-lg border border-app-brand-border-100 bg-app-selection-soft p-3">
          <span aria-hidden="true" class="mdi mdi-information-outline text-xl text-app-link" />
          <p class="text-sm leading-5 text-app-text-secondary">Revise os dados antes de confirmar. Algumas informações da equipe podem não ser alteradas depois.</p>
        </div>
      </aside>
    </div>

    <div class="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
      <button class="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-app-border-default bg-app-surface px-5 text-sm font-medium text-app-text-secondary hover:bg-app-surface-subtle" type="button" @click="emit('back')"><span aria-hidden="true" class="mdi mdi-arrow-left text-lg" /> Voltar</button>
      <button class="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-app-brand-action px-5 text-sm font-medium text-app-on-brand hover:bg-app-action-hover disabled:opacity-50" :disabled="submitting" type="button" @click="emit('confirm')">Confirmar inscrição <span aria-hidden="true" class="mdi mdi-arrow-right text-lg" /></button>
    </div>
  </div>
</template>
