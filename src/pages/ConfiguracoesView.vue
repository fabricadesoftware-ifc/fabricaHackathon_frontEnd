<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

import AvatarUpload from '@/components/layout/AvatarUpload/AvatarUpload.vue'
import ProfileForm from '@/components/layout/ProfileForm/ProfileForm.vue'
import UnsavedChangesBar from '@/components/layout/UnsavedChangesBar/UnsavedChangesBar.vue'
import { atualizarPerfil } from '@/services/auth'
import { ApiError } from '@/services/http'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

interface ProfileData {
  nome: string
  sobrenome: string
}

const initialState = ref<ProfileData>({ nome: '', sobrenome: '' })
const nome = ref('')
const sobrenome = ref('')

const username = computed(() => auth.user?.username ?? '')
const email = computed(() => auth.user?.email ?? '')
const displayName = computed(() =>
  [auth.user?.first_name, auth.user?.last_name].filter(Boolean).join(' ').trim() || username.value || email.value,
)

const savedPhotoUrl = ref<string | undefined>(undefined)
const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)
const currentPhotoUrl = computed(() => previewUrl.value ?? savedPhotoUrl.value)

const isSaving = ref(false)
const saveError = ref('')
const saveOk = ref(false)

watch(
  () => auth.user,
  user => {
    if (!user) return
    initialState.value = { nome: user.first_name, sobrenome: user.last_name }
    nome.value = user.first_name
    sobrenome.value = user.last_name
    savedPhotoUrl.value = user.foto_perfil ?? undefined
  },
  { immediate: true },
)

const avisoSolicitacao = computed(() => {
  const solicitacao = auth.user?.solicitacao_perfil
  if (!solicitacao) return null
  const perfil = solicitacao.perfil_solicitado === 'AVALIADOR' ? 'Avaliador' : 'Professor'
  if (solicitacao.status === 'PENDENTE') {
    return { tom: 'amber', texto: `Seu pedido de perfil ${perfil} aguarda aprovação de um administrador.` }
  }
  if (solicitacao.status === 'RECUSADA') {
    return { tom: 'red', texto: `Seu pedido de perfil ${perfil} foi recusado.` }
  }
  return null
})

const hasChanges = computed(() =>
  nome.value.trim() !== initialState.value.nome ||
  sobrenome.value.trim() !== initialState.value.sobrenome ||
  selectedFile.value !== null,
)

function clearPreview() {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = null
  }
}

function handleFileUpdate(file: File) {
  if (isSaving.value) return
  clearPreview()
  selectedFile.value = file
  previewUrl.value = URL.createObjectURL(file)
  saveOk.value = false
}

function handleCancel() {
  if (isSaving.value) return
  nome.value = initialState.value.nome
  sobrenome.value = initialState.value.sobrenome
  selectedFile.value = null
  clearPreview()
  saveError.value = ''
  saveOk.value = false
}

async function handleSave() {
  if (!hasChanges.value || isSaving.value) return

  if (!nome.value.trim() || !sobrenome.value.trim()) {
    saveError.value = 'Informe nome e sobrenome.'
    return
  }

  isSaving.value = true
  saveError.value = ''
  saveOk.value = false

  try {
    const atualizado = await atualizarPerfil({
      first_name: nome.value.trim(),
      last_name: sobrenome.value.trim(),
      foto: selectedFile.value,
    })

    selectedFile.value = null
    clearPreview()
    auth.setUser(atualizado)
    saveOk.value = true
  } catch (error) {
    if (error instanceof ApiError) {
      const mensagens = Object.values(error.fields).flat()
      saveError.value = mensagens.length ? mensagens.join(' ') : error.message
    } else {
      saveError.value = 'Não foi possível salvar as alterações.'
    }
  } finally {
    isSaving.value = false
  }
}

function sair() {
  auth.signOut()
  void router.push('/login')
}

onUnmounted(clearPreview)
</script>

<template>
  <div
    class="mx-auto w-full max-w-[1000px] md:pb-8"
    :class="hasChanges ? 'pb-32' : 'pb-6'"
  >
    <header class="mb-6">
      <h1 class="text-2xl font-semibold tracking-tight text-slate-800">Configurações</h1>
      <p class="mt-1 text-sm text-slate-500">Gerencie seu perfil e sua sessão.</p>
    </header>

    <p
      v-if="avisoSolicitacao"
      class="mb-5 rounded-lg border px-4 py-3 text-sm"
      :class="avisoSolicitacao.tom === 'amber'
        ? 'border-amber-200 bg-amber-50 text-amber-800'
        : 'border-red-200 bg-red-50 text-red-700'"
      role="status"
    >
      {{ avisoSolicitacao.texto }}
    </p>

    <div class="space-y-5">
      <section aria-labelledby="profile-heading" class="rounded-lg border border-slate-200 bg-white p-5 sm:p-6">
        <h2 id="profile-heading" class="text-lg font-semibold text-slate-700">Meu perfil</h2>
        <p class="mt-1 text-sm text-slate-500">Atualize sua foto e suas informações pessoais.</p>

        <div class="mt-5 border-b border-slate-200 pb-5">
          <AvatarUpload :src="currentPhotoUrl" :disabled="isSaving" @update:file="handleFileUpdate">
            <p class="truncate font-medium text-slate-700">{{ displayName }}</p>
            <p class="truncate text-sm text-slate-500">{{ email }}</p>
          </AvatarUpload>
        </div>

        <div class="mt-5">
          <ProfileForm
            v-model:nome="nome"
            v-model:sobrenome="sobrenome"
            :disabled="isSaving"
          />
        </div>

        <div class="mt-5 flex flex-wrap items-center justify-between gap-3">
          <span v-if="hasChanges" class="inline-flex items-center gap-2 text-sm text-slate-500">
            <span class="h-1.5 w-1.5 rounded-full bg-blue-600" aria-hidden="true" />
            Alterações não salvas
          </span>
          <span v-else-if="saveOk" class="text-sm text-green-700" role="status">Perfil atualizado.</span>
          <span v-else class="text-sm text-slate-500">Nome e sobrenome podem ser alterados aqui.</span>

          <button
            type="button"
            class="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#2563EB] px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="!hasChanges || isSaving"
            :aria-busy="isSaving"
            @click="handleSave"
          >
            {{ isSaving ? 'Salvando...' : 'Salvar alterações' }}
          </button>
        </div>

        <p v-if="saveError" class="mt-3 text-sm text-red-600" role="alert">{{ saveError }}</p>
      </section>

      <section aria-labelledby="account-heading" class="rounded-lg border border-slate-200 bg-white p-5 sm:p-6">
        <h2 id="account-heading" class="text-lg font-semibold text-slate-700">Informações da conta</h2>
        <p class="mt-1 text-sm text-slate-500">Esses dados não podem ser alterados nesta página.</p>

        <dl class="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <dt class="text-sm font-medium text-slate-600">Nome de usuário</dt>
            <dd class="mt-1 flex items-center gap-2 text-sm text-slate-700">
              <span class="min-w-0 break-all">{{ username }}</span>
              <span class="mdi mdi-lock-outline shrink-0 text-base text-slate-400" aria-hidden="true" />
            </dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-slate-600">E-mail</dt>
            <dd class="mt-1 flex items-center gap-2 text-sm text-slate-700">
              <span class="min-w-0 break-all">{{ email }}</span>
              <span class="mdi mdi-lock-outline shrink-0 text-base text-slate-400" aria-hidden="true" />
            </dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="session-heading" class="rounded-lg border border-slate-200 bg-white p-5 sm:p-6">
        <h2 id="session-heading" class="text-lg font-semibold text-slate-700">Sessão</h2>
        <div class="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p class="text-sm font-medium text-slate-700">Sair da conta</p>
            <p class="mt-0.5 text-sm text-slate-500">Encerre sua sessão neste dispositivo.</p>
          </div>
          <button
            type="button"
            class="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 px-3.5 text-sm font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            @click="sair"
          >
            <span class="mdi mdi-logout text-base" aria-hidden="true" />
            Sair da conta
          </button>
        </div>
      </section>
    </div>

    <UnsavedChangesBar
      :has-changes="hasChanges"
      :saving="isSaving"
      @cancel="handleCancel"
      @save="handleSave"
    />
  </div>
</template>
