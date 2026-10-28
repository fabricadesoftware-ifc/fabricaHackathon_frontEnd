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
  (e: 'update:teamName', value: string): void
  (e: 'update:projectName', value: string): void
  (e: 'update:participants', value: string[]): void
  (e: 'update:logo', value: File | null): void
  (e: 'back'): void
  (e: 'continue'): void
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

function addParticipante() {
  const email = emailInput.value.trim()
  if (!email) { errorMessage.value = 'Informe um e-mail.'; return }
  if (!email.includes('@') || !email.includes('.com')) { errorMessage.value = 'E-mail inválido.'; return }
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

function removeParticipante(email: string) {
  emit('update:participants', props.participants.filter(participant => participant !== email))
}

function removeLogo() {
  emit('update:logo', null)
  logoKey.value++
}
</script>

<template>
  <div class="w-full min-w-0">
    <section class="grid min-w-0 gap-7 rounded-lg border border-slate-200 bg-white p-5 sm:p-7 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)] lg:gap-9">
      <div class="min-w-0">
        <div class="mb-7 flex items-start gap-4">
          <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600" aria-hidden="true"><span class="mdi mdi-account-group-outline text-2xl" /></span>
          <div>
            <h2 class="text-xl font-semibold text-slate-800">Sua equipe</h2>
            <p class="mt-1 text-sm text-slate-600">Esta edição exige de {{ minParticipants }} a {{ maxParticipants }} participantes por equipe, contando com você.</p>
          </div>
        </div>

        <div class="space-y-5">
          <label class="block">
            <span class="mb-2 block text-sm font-medium text-slate-700">Nome da equipe</span>
            <span class="relative block">
              <span class="mdi mdi-account-multiple-outline pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xl text-slate-500" aria-hidden="true" />
              <input :value="teamName" type="text" placeholder="Ex: Alugaê" class="h-12 w-full rounded-lg border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100" @input="emit('update:teamName', ($event.target as HTMLInputElement).value)">
            </span>
          </label>
          <label class="block">
            <span class="mb-2 block text-sm font-medium text-slate-700">Nome do projeto</span>
            <span class="relative block">
              <span class="mdi mdi-cube-outline pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xl text-slate-500" aria-hidden="true" />
              <input :value="projectName" type="text" maxlength="100" placeholder="Ex: Alugaê App" class="h-12 w-full rounded-lg border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100" @input="emit('update:projectName', ($event.target as HTMLInputElement).value)">
            </span>
            <span class="mt-1.5 block text-xs text-slate-500">Você pode mudar o nome depois. Descrição e tema também ficam para depois.</span>
          </label>
          <div>
            <p class="mb-2 text-sm font-medium text-slate-700">Imagem do projeto <span class="font-normal text-slate-500">(opcional)</span></p>
            <LogoUpload
              :key="logoPreview || logoKey"
              :model-value="logoPreview || null"
              :accepted-formats="['image/png', 'image/jpeg', 'image/webp']"
              :max-size-mb="5"
              @update:model-value="emit('update:logo', $event)"
            />
            <button v-if="logoPreview" type="button" class="mt-2 text-sm font-medium text-slate-600 hover:text-blue-600" @click="removeLogo">Remover imagem</button>
          </div>
          <div>
            <label for="participant-email" class="block text-sm font-medium text-slate-700">Participantes (e-mail)</label>
            <p class="mb-2 mt-1 text-xs text-slate-500">Seus colegas precisam ter criado a conta na plataforma antes. Use o e-mail do cadastro de cada um.</p>
            <div class="flex flex-col gap-2 sm:flex-row">
              <span class="relative min-w-0 flex-1">
                <span class="mdi mdi-email-outline pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xl text-slate-500" aria-hidden="true" />
                <input id="participant-email" v-model="emailInput" type="email" placeholder="Ex: joao@gmail.com" class="h-12 w-full rounded-lg border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100" @keyup.enter="addParticipante">
              </span>
              <button type="button" class="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-5 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600" @click="addParticipante"><span class="mdi mdi-plus text-lg" aria-hidden="true" /> Adicionar</button>
            </div>
            <p v-if="errorMessage" class="mt-2 text-xs text-red-600" role="alert">{{ errorMessage }}</p>
          </div>
        </div>

        <ul class="mt-4 space-y-2" aria-label="Participantes da equipe">
          <li class="flex min-w-0 items-center gap-3 rounded-lg border border-slate-100 px-3 py-2" data-testid="participante-1">
            <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-medium text-blue-700" aria-hidden="true">{{ (ownerLabel || 'Você').charAt(0).toUpperCase() }}</span>
            <span class="min-w-0 truncate text-sm text-slate-700">{{ ownerLabel || 'Você' }}</span>
            <span class="shrink-0 rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-600">participante 1 · você</span>
          </li>
          <li v-for="participant in participants" :key="participant" class="flex min-w-0 items-center gap-3 rounded-lg border border-slate-100 px-3 py-2">
            <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-medium text-slate-600" aria-hidden="true">{{ participant.charAt(0).toUpperCase() }}</span>
            <span class="min-w-0 flex-1 truncate text-sm text-slate-700" :title="participant">{{ participant }}</span>
            <span class="hidden text-xs text-slate-500 sm:inline">Convidado</span>
            <button type="button" :aria-label="`Remover ${participant}`" class="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700" @click="removeParticipante(participant)"><span class="mdi mdi-close text-lg" aria-hidden="true" /></button>
          </li>
        </ul>
        <p class="mt-3 text-xs text-slate-600" aria-live="polite">{{ progressText }}</p>
      </div>

      <aside class="min-w-0 rounded-lg bg-slate-50 p-5 sm:p-6" aria-label="Orientações da inscrição">
        <div v-if="editionName" class="mb-5 border-b border-slate-200 pb-4">
          <p class="text-xs font-medium uppercase tracking-wide text-slate-500">Edição selecionada</p>
          <p class="mt-1 text-sm font-semibold text-slate-700">{{ editionName }}</p>
          <p v-if="editionLocation" class="mt-1 text-xs text-slate-500">{{ editionLocation }}</p>
        </div>
        <div class="space-y-5">
          <div class="flex gap-3">
            <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100/70 text-blue-600" aria-hidden="true"><span class="mdi mdi-account-group-outline text-xl" /></span>
            <div><h3 class="text-sm font-semibold text-slate-700">{{ minParticipants }} a {{ maxParticipants }} participantes</h3><p class="mt-1 text-sm leading-5 text-slate-600">Sua equipe deve ter entre {{ minParticipants }} e {{ maxParticipants }} membros, contando com você.</p></div>
          </div>
          <div class="flex gap-3">
            <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100/70 text-blue-600" aria-hidden="true"><span class="mdi mdi-lightbulb-outline text-xl" /></span>
            <div><h3 class="text-sm font-semibold text-slate-700">Nome do projeto</h3><p class="mt-1 text-sm leading-5 text-slate-600">Escolha um nome para sua ideia. Você poderá completar as informações depois.</p></div>
          </div>
          <div class="flex gap-3">
            <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100/70 text-blue-600" aria-hidden="true"><span class="mdi mdi-email-outline text-xl" /></span>
            <div><h3 class="text-sm font-semibold text-slate-700">Convide seus colegas</h3><p class="mt-1 text-sm leading-5 text-slate-600">Adicione o e-mail dos participantes que já têm conta na plataforma.</p></div>
          </div>
          <div class="border-t border-slate-200 pt-5">
            <div class="flex gap-3 rounded-lg bg-blue-50 p-3">
              <span class="mdi mdi-information-outline text-xl text-blue-600" aria-hidden="true" />
              <div><h3 class="text-sm font-semibold text-blue-800">Próximas etapas</h3><p class="mt-1 text-sm leading-5 text-slate-600">Depois, você poderá revisar os dados e confirmar a inscrição.</p></div>
            </div>
          </div>
        </div>
      </aside>
    </section>

    <div class="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
      <button type="button" class="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 text-sm font-medium text-slate-600 hover:bg-slate-50" @click="emit('back')"><span class="mdi mdi-arrow-left text-lg" aria-hidden="true" /> Voltar</button>
      <button type="button" :disabled="!canContinue" class="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50" @click="emit('continue')">Revisar inscrição <span class="mdi mdi-arrow-right text-lg" aria-hidden="true" /></button>
    </div>
  </div>
</template>
