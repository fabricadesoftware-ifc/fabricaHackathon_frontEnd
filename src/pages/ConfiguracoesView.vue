<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

import PageHeader from '@/components/ui/PageHeader/PageHeader.vue'
import settingSectionHeader from '@/components/ui/SettingSectionHeader/settingSectionHeader.vue'
import AvatarUpload from '@/components/layout/AvatarUpload/AvatarUpload.vue'
import ProfileForm from '@/components/layout/ProfileForm/ProfileForm.vue'
import DangerZoneSection from '@/components/layout/DangerZoneSection/DangerZoneSection.vue'
import DangerActionItem from '@/components/layout/DangerActionItem/DangerActionItem.vue'
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

// Dados salvos (vêm da conta logada).
const initialState = ref<ProfileData>({ nome: '', sobrenome: '' })

// Campos editáveis.
const nome = ref('')
const sobrenome = ref('')

// Somente leitura: o e-mail é o login e o usuário não muda aqui.
const username = computed(() => auth.user?.username ?? '')
const email = computed(() => auth.user?.email ?? '')

// Foto de perfil.
const savedPhotoUrl = ref<string | undefined>(undefined)
const currentPhotoUrl = ref<string | undefined>(undefined)

const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)

// Estados.
const isSaving = ref(false)
const saveError = ref('')
const saveOk = ref(false)

// Preenche o formulário com os dados da conta (também quando ela termina de carregar).
watch(
  () => auth.user,
  user => {
    if (!user) return
    initialState.value = { nome: user.first_name, sobrenome: user.last_name }
    nome.value = user.first_name
    sobrenome.value = user.last_name
    savedPhotoUrl.value = user.foto_perfil ?? undefined
    if (!selectedFile.value) currentPhotoUrl.value = savedPhotoUrl.value
  },
  { immediate: true },
)

// Situação do pedido de perfil de Avaliador/Professor.
const avisoSolicitacao = computed(() => {
  const s = auth.user?.solicitacao_perfil
  if (!s) return null
  const perfil = s.perfil_solicitado === 'AVALIADOR' ? 'Avaliador' : 'Professor'
  if (s.status === 'PENDENTE') return { tom: 'amber', texto: `Seu pedido de perfil ${perfil} aguarda aprovação de um administrador.` }
  if (s.status === 'RECUSADA') return { tom: 'red', texto: `Seu pedido de perfil ${perfil} foi recusado.` }
  return null
})

// Identifica alterações nos dados ou no avatar.
const hasChanges = computed(() =>
  nome.value.trim() !== initialState.value.nome ||
  sobrenome.value.trim() !== initialState.value.sobrenome ||
  selectedFile.value !== null,
)

// Remove uma prévia anterior da memória.
function clearPreview() {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = null
  }
}

// Atualiza a foto selecionada.
function handleFileUpdate(file: File) {
  if (isSaving.value) return

  clearPreview()

  selectedFile.value = file
  previewUrl.value = URL.createObjectURL(file)
  currentPhotoUrl.value = previewUrl.value
}

// Cancela as alterações.
function handleCancel() {
  if (isSaving.value) return

  nome.value = initialState.value.nome
  sobrenome.value = initialState.value.sobrenome
  selectedFile.value = null

  clearPreview()

  currentPhotoUrl.value = savedPhotoUrl.value
  saveError.value = ''
}

// Salva nome, sobrenome e foto no back-end.
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

// Encerra a sessão neste dispositivo.
function sair() {
  auth.signOut()
  void router.push('/login')
}

// Libera as URLs temporárias.
onUnmounted(() => {
  clearPreview()
})
</script>

<template>
  <PageHeader
    title="Configurações"
    subtitle="Atualize suas informações pessoais"
  />

  <p
    v-if="avisoSolicitacao"
    class="mb-4 rounded-lg px-4 py-3 text-sm"
    :class="avisoSolicitacao.tom === 'amber' ? 'bg-amber-50 text-amber-800' : 'bg-red-50 text-red-700'"
    role="status"
  >
    {{ avisoSolicitacao.texto }}
  </p>

  <!-- Meu perfil -->
  <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
    <div class="flex flex-col gap-20 md:flex-row md:items-start mx-10">
      <div class="flex flex-col items-start gap-4 md:w-[290px] md:shrink-0">
        <settingSectionHeader
          icon="mdi mdi-account"
          title="Meu Perfil"
          subtitle="Editar informações pessoais"
          variant="perfil"
        />

        <div class="ml-8">
          <AvatarUpload
            :src="currentPhotoUrl"
            @update:file="handleFileUpdate"
          />
        </div>
      </div>

      <div class="min-w-0 flex-1">
        <ProfileForm
          v-model:nome="nome"
          v-model:sobrenome="sobrenome"
          :email="email"
          identity-readonly
          :show-bio="false"
          :username="username"
        />
      </div>
    </div>
  </div>

  <!-- Zona de perigo -->
  <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm mt-10">
    <div class="flex flex-col gap-20 md:flex-row md:items-start mx-10">
      <div>
        <DangerZoneSection />
      </div>

      <div class="min-w-0 flex-1">
        <button class="text-left" type="button" @click="sair">
          <DangerActionItem
            icon="mdi mdi-logout"
            title="Sair"
            subtitle="Encerrar sessão neste dispositivo"
            variant="sair"
          />
        </button>
      </div>
    </div>
  </div>

  <p v-if="saveOk && !hasChanges" class="mt-4 text-sm text-green-700" role="status">
    Perfil atualizado.
  </p>

  <!-- Mensagem de erro -->
  <p
    v-if="saveError"
    class="mt-4 text-sm text-red-600"
    role="alert"
  >
    {{ saveError }}
  </p>

  <!-- Barra de alterações -->
  <UnsavedChangesBar
    :has-changes="hasChanges"
    @cancel="handleCancel"
    @save="handleSave"
  />
</template>