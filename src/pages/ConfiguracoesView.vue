<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'

import PageHeader from '@/components/ui/PageHeader/PageHeader.vue'
import settingSectionHeader from '@/components/ui/SettingSectionHeader/settingSectionHeader.vue'
import AvatarUpload from '@/components/layout/AvatarUpload/AvatarUpload.vue'
import ProfileForm from '@/components/layout/ProfileForm/ProfileForm.vue'
import DangerZoneSection from '@/components/layout/DangerZoneSection/DangerZoneSection.vue'
import DangerActionItem from '@/components/layout/DangerActionItem/DangerActionItem.vue'
import UnsavedChangesBar from '@/components/layout/UnsavedChangesBar/UnsavedChangesBar.vue'

interface ProfileData {
  nome: string
  sobrenome: string
  username: string
  email: string
  bio: string
}

// Dados iniciais do usuário.
// Futuramente serão carregados do backend.
const initialState = ref<ProfileData>({
  nome: '',
  sobrenome: '',
  username: '',
  email: '',
  bio: '',
})

// Campos editáveis.
const nome = ref(initialState.value.nome)
const sobrenome = ref(initialState.value.sobrenome)
const username = ref(initialState.value.username)
const email = ref(initialState.value.email)
const bio = ref(initialState.value.bio)

// Foto de perfil.
const savedPhotoUrl = ref<string | undefined>(undefined)
const currentPhotoUrl = ref<string | undefined>(savedPhotoUrl.value)

const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)

// Estados.
const isSaving = ref(false)
const saveError = ref('')

// Retorna os dados atuais do formulário.
function getFormData(): ProfileData {
  return {
    nome: nome.value,
    sobrenome: sobrenome.value,
    username: username.value,
    email: email.value,
    bio: bio.value,
  }
}

// Identifica alterações nos dados ou no avatar.
const hasChanges = computed(() => {
  const initial = initialState.value

  const profileChanged =
    nome.value !== initial.nome ||
    sobrenome.value !== initial.sobrenome ||
    username.value !== initial.username ||
    email.value !== initial.email ||
    bio.value !== initial.bio

  return profileChanged || selectedFile.value !== null
})

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

  const initial = initialState.value

  nome.value = initial.nome
  sobrenome.value = initial.sobrenome
  username.value = initial.username
  email.value = initial.email
  bio.value = initial.bio

  selectedFile.value = null

  clearPreview()

  currentPhotoUrl.value = savedPhotoUrl.value
  saveError.value = ''
}

// Simula o salvamento das alterações.
async function handleSave() {
  if (!hasChanges.value || isSaving.value) return

  isSaving.value = true
  saveError.value = ''

  try {
    // Simulação de uma requisição ao backend.
    await new Promise(resolve => setTimeout(resolve, 500))

    const updatedProfile = getFormData()

    // Atualiza os dados considerados salvos.
    initialState.value = { ...updatedProfile }

    // Mantém a foto selecionada após salvar.
    if (selectedFile.value) {
      const previousSavedPhotoUrl = savedPhotoUrl.value

      savedPhotoUrl.value = URL.createObjectURL(selectedFile.value)
      currentPhotoUrl.value = savedPhotoUrl.value

      if (previousSavedPhotoUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(previousSavedPhotoUrl)
      }

      selectedFile.value = null
      clearPreview()
    }

    console.log('Perfil salvo (mock):', updatedProfile)
  } catch (error) {
    console.error('Erro ao salvar perfil:', error)
    saveError.value = 'Não foi possível salvar as alterações.'
  } finally {
    isSaving.value = false
  }
}

// Libera as URLs temporárias.
onUnmounted(() => {
  clearPreview()

  if (savedPhotoUrl.value?.startsWith('blob:')) {
    URL.revokeObjectURL(savedPhotoUrl.value)
  }
})
</script>

<template>
  <PageHeader
    title="Configurações"
    subtitle="Atualize suas informações pessoais"
  />

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
          v-model:username="username"
          v-model:email="email"
          v-model:bio="bio"
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
        <DangerActionItem
          icon="mdi mdi-logout"
          title="Sair"
          subtitle="Encerrar sessão neste dispositivo"
          variant="sair"
        />

        <DangerActionItem
          icon="mdi mdi-delete-outline"
          title="Excluir conta"
          subtitle="Essa ação não pode ser desfeita"
          variant="excluir"
        />
      </div>
    </div>
  </div>

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