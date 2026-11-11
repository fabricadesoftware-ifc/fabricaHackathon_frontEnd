<script setup lang="ts">
  import { computed, onUnmounted, ref, watch } from 'vue'
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
    nome.value.trim() !== initialState.value.nome
    || sobrenome.value.trim() !== initialState.value.sobrenome
    || selectedFile.value !== null,
  )

  function clearPreview () {
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
      previewUrl.value = null
    }
  }

  function handleFileUpdate (file: File) {
    if (isSaving.value) return
    clearPreview()
    selectedFile.value = file
    previewUrl.value = URL.createObjectURL(file)
    saveOk.value = false
  }

  function handleCancel () {
    if (isSaving.value) return
    nome.value = initialState.value.nome
    sobrenome.value = initialState.value.sobrenome
    selectedFile.value = null
    clearPreview()
    saveError.value = ''
    saveOk.value = false
  }

  async function handleSave () {
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
        saveError.value = mensagens.length > 0 ? mensagens.join(' ') : error.message
      } else {
        saveError.value = 'Não foi possível salvar as alterações.'
      }
    } finally {
      isSaving.value = false
    }
  }

  function sair () {
    auth.signOut()
    void router.push('/login')
  }

  onUnmounted(clearPreview)
</script>

<template>
  <div
    class="w-full min-w-0 md:pb-8"
    :class="hasChanges ? 'pb-32' : 'pb-6'"
  >
    <header class="mb-6">
      <h1 class="text-2xl font-semibold tracking-tight text-app-text-heading">Configurações</h1>
      <p class="mt-1 text-sm text-app-text-muted">Gerencie seu perfil e sua sessão.</p>
    </header>

    <p
      v-if="avisoSolicitacao"
      class="mb-5 rounded-lg border px-4 py-3 text-sm"
      :class="avisoSolicitacao.tom === 'amber'
        ? 'border-app-warning-border-200 bg-app-warning-surface-50 text-app-warning-text-800'
        : 'border-app-danger-border-200 bg-app-danger-surface-50 text-app-danger-text-700'"
      role="status"
    >
      {{ avisoSolicitacao.texto }}
    </p>

    <div class="space-y-5">
      <section aria-labelledby="profile-heading" class="w-full max-w-[1000px] rounded-lg border border-app-border-default bg-app-surface p-5 sm:p-6">
        <h2 id="profile-heading" class="text-lg font-semibold text-app-text-body-strong">Meu perfil</h2>
        <p class="mt-1 text-sm text-app-text-muted">Atualize sua foto e suas informações pessoais.</p>

        <div class="mt-5 border-b border-app-border-default pb-5">
          <AvatarUpload :disabled="isSaving" :src="currentPhotoUrl" @update:file="handleFileUpdate">
            <p class="truncate font-medium text-app-text-body-strong">{{ displayName }}</p>
            <p class="truncate text-sm text-app-text-muted">{{ email }}</p>
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
          <span v-if="hasChanges" class="inline-flex items-center gap-2 text-sm text-app-text-muted">
            <span aria-hidden="true" class="h-1.5 w-1.5 rounded-full bg-app-action" />
            Alterações não salvas
          </span>

          <span v-else-if="saveOk" class="text-sm text-app-success-text-700" role="status">Perfil atualizado.</span>
          <span v-else class="text-sm text-app-text-muted">Nome e sobrenome podem ser alterados aqui.</span>

          <button
            :aria-busy="isSaving"
            class="inline-flex min-h-10 items-center justify-center rounded-lg bg-app-brand-action px-4 text-sm font-medium text-app-on-brand transition-colors hover:bg-app-action-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-focus disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="!hasChanges || isSaving"
            type="button"
            @click="handleSave"
          >
            {{ isSaving ? 'Salvando...' : 'Salvar alterações' }}
          </button>
        </div>

        <p v-if="saveError" class="mt-3 text-sm text-app-danger-text-600" role="alert">{{ saveError }}</p>
      </section>

      <section aria-labelledby="account-heading" class="w-full max-w-[1000px] rounded-lg border border-app-border-default bg-app-surface p-5 sm:p-6">
        <h2 id="account-heading" class="text-lg font-semibold text-app-text-body-strong">Informações da conta</h2>
        <p class="mt-1 text-sm text-app-text-muted">Esses dados não podem ser alterados nesta página.</p>

        <dl class="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <dt class="text-sm font-medium text-app-text-secondary">Nome de usuário</dt>

            <dd class="mt-1 flex items-center gap-2 text-sm text-app-text-body-strong">
              <span class="min-w-0 break-all">{{ username }}</span>
              <span aria-hidden="true" class="mdi mdi-lock-outline shrink-0 text-base text-app-text-placeholder" />
            </dd>
          </div>

          <div>
            <dt class="text-sm font-medium text-app-text-secondary">E-mail</dt>

            <dd class="mt-1 flex items-center gap-2 text-sm text-app-text-body-strong">
              <span class="min-w-0 break-all">{{ email }}</span>
              <span aria-hidden="true" class="mdi mdi-lock-outline shrink-0 text-base text-app-text-placeholder" />
            </dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="session-heading" class="w-full max-w-[1000px] rounded-lg border border-app-border-default bg-app-surface p-5 sm:p-6">
        <h2 id="session-heading" class="text-lg font-semibold text-app-text-body-strong">Sessão</h2>

        <div class="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p class="text-sm font-medium text-app-text-body-strong">Sair da conta</p>
            <p class="mt-0.5 text-sm text-app-text-muted">Encerre sua sessão neste dispositivo.</p>
          </div>

          <button
            class="inline-flex min-h-10 items-center gap-2 rounded-lg border border-app-border-default px-3.5 text-sm font-medium text-app-text-secondary transition-colors hover:border-app-border-strong hover:bg-app-surface-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-focus"
            type="button"
            @click="sair"
          >
            <span aria-hidden="true" class="mdi mdi-logout text-base" />
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
