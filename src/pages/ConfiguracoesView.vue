<template>
  <PageHeader title="Configurações" subtitle="Atualize suas informações pessoais" />

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
          <AvatarUpload :src="currentPhotoUrl" @update:file="handleFileUpdate" />
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

  <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm mt-10">
    <div class="flex flex-col gap-20 md:flex-row md:items-start mx-10">
      <div class="">
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

  <UnsavedChangesBar
    :has-changes="hasChanges"
    @cancel="handleCancel"
    @save="handleSave"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import PageHeader from '@/components/ui/PageHeader/PageHeader.vue'
import settingSectionHeader from '@/components/ui/SettingSectionHeader/settingSectionHeader.vue'
import AvatarUpload from '@/components/layout/AvatarUpload/AvatarUpload.vue'
import ProfileForm from '@/components/layout/ProfileForm/ProfileForm.vue'
import DangerZoneSection from '@/components/layout/DangerZoneSection/DangerZoneSection.vue'
import DangerActionItem from '@/components/layout/DangerActionItem/DangerActionItem.vue'
import UnsavedChangesBar from '@/components/layout/UnsavedChangesBar/UnsavedChangesBar.vue'

const currentPhotoUrl = ref<string | undefined>(undefined)
const nome = ref('')
const sobrenome = ref('')
const username = ref('')
const email = ref('')
const bio = ref('')

// snapshot inicial, pra comparar e saber se mudou algo
const initialState = {
  nome: nome.value,
  sobrenome: sobrenome.value,
  username: username.value,
  email: email.value,
  bio: bio.value,
}

const hasChanges = computed(() => {
  return (
    nome.value !== initialState.nome ||
    sobrenome.value !== initialState.sobrenome ||
    username.value !== initialState.username ||
    email.value !== initialState.email ||
    bio.value !== initialState.bio
  )
})

function handleFileUpdate(file: File) {
  console.log('Arquivo selecionado:', file)
}

function handleCancel() {
  nome.value = initialState.nome
  sobrenome.value = initialState.sobrenome
  username.value = initialState.username
  email.value = initialState.email
  bio.value = initialState.bio
}

function handleSave() {
  console.log('Salvando...', {
    nome: nome.value,
    sobrenome: sobrenome.value,
    username: username.value,
    email: email.value,
    bio: bio.value,
  })
}
</script>