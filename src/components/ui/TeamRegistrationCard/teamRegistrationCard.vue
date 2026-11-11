<script setup lang="ts">
  import { computed, ref } from 'vue'
  import LogoUpload from '../LogoUpload/LogoUpload.vue'

  const props = defineProps<{
    minParticipants: number
    maxParticipants: number
    teamName: string
    projectName: string
    participants: string[]
    ownerLabel?: string
    ownerEmail?: string
    editionName?: string
    editionLocation?: string
    logoPreview?: string
  }>()

  const emit = defineEmits<{
    (e: 'update:teamName' | 'update:projectName', value: string): void
    (e: 'update:participants', value: string[]): void
    (e: 'update:logo', value: File | null): void
    (e: 'back' | 'continue'): void
  }>()

  const emailInput = ref('')
  const errorMessage = ref('')
  const logoKey = ref(0)
  const numParticipantes = computed(() => props.participants.length + 1)
  const faltam = computed(() => Math.max(0, props.minParticipants - numParticipantes.value))
  const canContinue = computed(() =>
    !!props.teamName.trim() && !!props.projectName.trim() && numParticipantes.value >= props.minParticipants,
  )
  const progressText = computed(() => {
    const base = `${numParticipantes.value} de ${props.maxParticipants} vagas preenchidas`
    return faltam.value > 0
      ? `${base} · adicione mais ${faltam.value} para atingir o mínimo de ${props.minParticipants}`
      : `${base} · mínimo de ${props.minParticipants} atingido`
  })

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
    if (props.participants.some(participant => participant.toLowerCase() === email.toLowerCase())) {
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
    emit('update:participants', props.participants.filter(participant => participant !== email))
  }

  function removeLogo () {
    emit('update:logo', null)
    logoKey.value++
  }
</script>

<template>
  <div class="w-full min-w-0">
    <section class="grid min-w-0 gap-7 rounded-lg border border-app-border-default bg-app-surface p-5 sm:p-7 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)] lg:gap-9">
      <div class="min-w-0">
        <div class="mb-7 flex items-start gap-4">
          <span aria-hidden="true" class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-app-selection-soft text-app-link"><span class="mdi mdi-account-group-outline text-2xl" /></span>

          <div>
            <h2 class="text-xl font-semibold text-app-text-heading">Sua equipe</h2>
            <p class="mt-1 text-sm text-app-text-secondary">Esta edição exige de {{ minParticipants }} a {{ maxParticipants }} participantes por equipe, contando com você.</p>
          </div>
        </div>

        <div class="space-y-5">
          <label class="block">
            <span class="mb-2 block text-sm font-medium text-app-text-body-strong">Nome da equipe</span>

            <span class="relative block">
              <span aria-hidden="true" class="mdi mdi-account-multiple-outline pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xl text-app-text-muted" />

              <input
                class="h-12 w-full rounded-lg border border-app-border-default bg-app-surface pl-11 pr-4 text-sm text-app-text-body-strong outline-none placeholder:text-app-text-placeholder focus:border-app-brand-border-500 focus:ring-2 focus:ring-app-focus-halo"
                placeholder="Ex: Alugaê"
                type="text"
                :value="teamName"
                @input="emit('update:teamName', ($event.target as HTMLInputElement).value)"
              >
            </span>
          </label>

          <label class="block">
            <span class="mb-2 block text-sm font-medium text-app-text-body-strong">Nome do projeto</span>

            <span class="relative block">
              <span aria-hidden="true" class="mdi mdi-cube-outline pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xl text-app-text-muted" />

              <input
                class="h-12 w-full rounded-lg border border-app-border-default bg-app-surface pl-11 pr-4 text-sm text-app-text-body-strong outline-none placeholder:text-app-text-placeholder focus:border-app-brand-border-500 focus:ring-2 focus:ring-app-focus-halo"
                maxlength="100"
                placeholder="Ex: Alugaê App"
                type="text"
                :value="projectName"
                @input="emit('update:projectName', ($event.target as HTMLInputElement).value)"
              >
            </span>

            <span class="mt-1.5 block text-xs text-app-text-muted">Você pode mudar o nome depois. Descrição e tema também ficam para depois.</span>
          </label>

          <div>
            <p class="mb-2 text-sm font-medium text-app-text-body-strong">Imagem do projeto <span class="font-normal text-app-text-muted">(opcional)</span></p>

            <LogoUpload
              :key="logoPreview || logoKey"
              :accepted-formats="['image/png', 'image/jpeg', 'image/webp']"
              :max-size-mb="5"
              :model-value="logoPreview || null"
              @update:model-value="emit('update:logo', $event)"
            />

            <button v-if="logoPreview" class="mt-2 text-sm font-medium text-app-text-secondary hover:text-app-link" type="button" @click="removeLogo">Remover imagem</button>
          </div>

          <div>
            <label class="block text-sm font-medium text-app-text-body-strong" for="participant-email">Participantes (e-mail)</label>
            <p class="mb-2 mt-1 text-xs text-app-text-muted">Seus colegas precisam ter criado a conta na plataforma antes. Use o e-mail do cadastro de cada um.</p>

            <div class="flex flex-col gap-2 sm:flex-row">
              <span class="relative min-w-0 flex-1">
                <span aria-hidden="true" class="mdi mdi-email-outline pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xl text-app-text-muted" />

                <input
                  id="participant-email"
                  v-model="emailInput"
                  class="h-12 w-full rounded-lg border border-app-border-default bg-app-surface pl-11 pr-4 text-sm text-app-text-body-strong outline-none placeholder:text-app-text-placeholder focus:border-app-brand-border-500 focus:ring-2 focus:ring-app-focus-halo"
                  placeholder="Ex: joao@gmail.com"
                  type="email"
                  @keyup.enter="addParticipante"
                >
              </span>

              <button class="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-app-brand-action px-5 text-sm font-medium text-app-on-brand hover:bg-app-action-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-focus" type="button" @click="addParticipante"><span aria-hidden="true" class="mdi mdi-plus text-lg" /> Adicionar</button>
            </div>

            <p v-if="errorMessage" class="mt-2 text-xs text-app-danger-text-600" role="alert">{{ errorMessage }}</p>
          </div>
        </div>

        <ul aria-label="Participantes da equipe" class="mt-4 space-y-2">
          <li class="flex min-w-0 items-center gap-3 rounded-lg border border-app-border-soft px-3 py-2" data-testid="participante-1">
            <span aria-hidden="true" class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-app-selection-soft text-sm font-medium text-app-link-hover">{{ (ownerLabel || 'Você').charAt(0).toUpperCase() }}</span>
            <span class="min-w-0 truncate text-sm text-app-text-body-strong">{{ ownerLabel || 'Você' }}</span>
            <span class="shrink-0 rounded-full bg-app-selection-soft px-2 py-1 text-xs text-app-link">participante 1 · você</span>
          </li>

          <li v-for="participant in participants" :key="participant" class="flex min-w-0 items-center gap-3 rounded-lg border border-app-border-soft px-3 py-2">
            <span aria-hidden="true" class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-app-surface-muted text-sm font-medium text-app-text-secondary">{{ participant.charAt(0).toUpperCase() }}</span>
            <span class="min-w-0 flex-1 truncate text-sm text-app-text-body-strong" :title="participant">{{ participant }}</span>
            <span class="hidden text-xs text-app-text-muted sm:inline">Convidado</span>
            <button :aria-label="`Remover ${participant}`" class="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-app-text-muted hover:bg-app-surface-muted hover:text-app-text-body-strong" type="button" @click="removeParticipante(participant)"><span aria-hidden="true" class="mdi mdi-close text-lg" /></button>
          </li>
        </ul>

        <p aria-live="polite" class="mt-3 text-xs text-app-text-secondary">{{ progressText }}</p>
      </div>

      <aside aria-label="Orientações da inscrição" class="min-w-0 rounded-lg bg-app-surface-subtle p-5 sm:p-6">
        <div v-if="editionName" class="mb-5 border-b border-app-border-default pb-4">
          <p class="text-xs font-medium uppercase tracking-wide text-app-text-muted">Edição selecionada</p>
          <p class="mt-1 text-sm font-semibold text-app-text-body-strong">{{ editionName }}</p>
          <p v-if="editionLocation" class="mt-1 text-xs text-app-text-muted">{{ editionLocation }}</p>
        </div>

        <div class="space-y-5">
          <div class="flex gap-3">
            <span aria-hidden="true" class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-app-selection/70 text-app-link"><span class="mdi mdi-account-group-outline text-xl" /></span>
            <div><h3 class="text-sm font-semibold text-app-text-body-strong">{{ minParticipants }} a {{ maxParticipants }} participantes</h3><p class="mt-1 text-sm leading-5 text-app-text-secondary">Sua equipe deve ter entre {{ minParticipants }} e {{ maxParticipants }} membros, contando com você.</p></div>
          </div>

          <div class="flex gap-3">
            <span aria-hidden="true" class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-app-selection/70 text-app-link"><span class="mdi mdi-lightbulb-outline text-xl" /></span>
            <div><h3 class="text-sm font-semibold text-app-text-body-strong">Nome do projeto</h3><p class="mt-1 text-sm leading-5 text-app-text-secondary">Escolha um nome para sua ideia. Você poderá completar as informações depois.</p></div>
          </div>

          <div class="flex gap-3">
            <span aria-hidden="true" class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-app-selection/70 text-app-link"><span class="mdi mdi-email-outline text-xl" /></span>
            <div><h3 class="text-sm font-semibold text-app-text-body-strong">Convide seus colegas</h3><p class="mt-1 text-sm leading-5 text-app-text-secondary">Adicione o e-mail dos participantes que já têm conta na plataforma.</p></div>
          </div>

          <div class="border-t border-app-border-default pt-5">
            <div class="flex gap-3 rounded-lg bg-app-selection-soft p-3">
              <span aria-hidden="true" class="mdi mdi-information-outline text-xl text-app-link" />
              <div><h3 class="text-sm font-semibold text-app-link-strong">Próximas etapas</h3><p class="mt-1 text-sm leading-5 text-app-text-secondary">Depois, você poderá revisar os dados e confirmar a inscrição.</p></div>
            </div>
          </div>
        </div>
      </aside>
    </section>

    <div class="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
      <button class="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-app-border-default bg-app-surface px-5 text-sm font-medium text-app-text-secondary hover:bg-app-surface-subtle" type="button" @click="emit('back')"><span aria-hidden="true" class="mdi mdi-arrow-left text-lg" /> Voltar</button>
      <button class="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-app-brand-action px-5 text-sm font-medium text-app-on-brand hover:bg-app-action-hover disabled:cursor-not-allowed disabled:opacity-50" :disabled="!canContinue" type="button" @click="emit('continue')">Revisar inscrição <span aria-hidden="true" class="mdi mdi-arrow-right text-lg" /></button>
    </div>
  </div>
</template>
