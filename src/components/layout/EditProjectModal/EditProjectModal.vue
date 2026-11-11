<script setup lang="ts">
  import { reactive, ref, watch } from 'vue'
  import AppButton from '@/components/ui/AppButton/AppButton.vue'
  import LogoUpload from '@/components/ui/LogoUpload/LogoUpload.vue'

  interface EditProjectPayload {
    nome_equipe: string
    nome_projeto: string
    descricao_projeto: string
    tema: number | null
    /** Nova logo escolhida (null = manter a atual). */
    logo: File | null
    /** true = o criador pediu para remover a logo atual. */
    removerLogo: boolean
  }

  const props = withDefaults(
    defineProps<{
      modelValue: boolean
      teamName: string
      projectName: string
      description: string
      /** Nome da equipe só muda enquanto as inscrições estão abertas. */
      teamNameLocked?: boolean
      temas?: { id: number, descricao_tema: string }[]
      temaId?: number | null
      logoUrl?: string | null
      loading?: boolean
      error?: string
    }>(),
    {
      logoUrl: null,
      temas: () => [],
      temaId: null,
      loading: false,
      error: '',
    },
  )

  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'save', payload: EditProjectPayload): void
  }>()

  const form = reactive<EditProjectPayload>({
    nome_equipe: '',
    nome_projeto: '',
    descricao_projeto: '',
    tema: null,
    logo: null,
    removerLogo: false,
  })
  const erroLogo = ref('')
  // Troca a chave do preview ao remover a logo atual.
  const logoKey = ref(0)

  function removerLogoAtual () {
    form.logo = null
    form.removerLogo = true
    logoKey.value++
  }

  function aoEscolherLogo (arquivo: File | null) {
    form.logo = arquivo
    form.removerLogo = false
    erroLogo.value = ''
  }

  // Preenche o formulário ao abrir o modal
  watch(
    () => props.modelValue,
    open => {
      if (!open) return

      form.nome_equipe = props.teamName
      form.nome_projeto = props.projectName
      form.descricao_projeto = props.description
      form.tema = props.temaId
      form.logo = null
      form.removerLogo = false
      erroLogo.value = ''
      logoKey.value++
    },
    { immediate: true },
  )

  function closeModal () {
    if (props.loading) return

    emit('update:modelValue', false)
  }

  function handleSave () {
    if (props.loading) return

    if (
      !form.nome_equipe.trim()
      || !form.nome_projeto.trim()
    ) {
      return
    }

    emit('save', {
      nome_equipe: form.nome_equipe.trim(),
      nome_projeto: form.nome_projeto.trim(),
      descricao_projeto: form.descricao_projeto.trim(),
      tema: form.tema,
      logo: form.logo,
      removerLogo: form.removerLogo,
    })
  }

  function handleKeydown (event: KeyboardEvent) {
    if (event.key === 'Escape') {
      closeModal()
    }
  }
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4"
      @click.self="closeModal"
      @keydown="handleKeydown"
    >
      <div
        aria-labelledby="edit-project-title"
        aria-modal="true"
        class="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
        role="dialog"
        tabindex="-1"
      >
        <!-- Cabeçalho -->
        <div class="mb-6 flex items-start justify-between">
          <div>
            <h2 id="edit-project-title" class="text-xl font-semibold text-gray-900">
              Editar projeto
            </h2>

            <p class="mt-1 text-sm text-gray-500">
              Atualize as informações da sua equipe e projeto.
            </p>
          </div>

          <button
            aria-label="Fechar modal"
            class="text-xl text-gray-400 hover:text-gray-700"
            :disabled="loading"
            type="button"
            @click="closeModal"
          >
            ✕
          </button>
        </div>

        <!-- Formulário -->
        <form class="flex flex-col gap-5" @submit.prevent>
          <!-- Nome da equipe -->
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700" for="edit-team-name">
              Nome da equipe
            </label>

            <input
              id="edit-team-name"
              v-model="form.nome_equipe"
              class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500"
              :disabled="loading || teamNameLocked"
              required
              type="text"
            >
          </div>

          <!-- Nome do projeto -->
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700" for="edit-project-name">
              Nome do projeto
            </label>

            <input
              id="edit-project-name"
              v-model="form.nome_projeto"
              class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500"
              :disabled="loading"
              required
              type="text"
            >
          </div>

          <!-- Tema -->
          <div v-if="temas.length > 0">
            <label class="mb-2 block text-sm font-medium text-gray-700" for="edit-tema">
              Tema do projeto
            </label>

            <select
              id="edit-tema"
              v-model="form.tema"
              class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500"
              :disabled="loading"
            >
              <option disabled :value="null">Selecione um tema</option>
              <option v-for="t in temas" :key="t.id" :value="t.id">{{ t.descricao_tema }}</option>
            </select>
          </div>

          <!-- Descrição -->
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700" for="edit-description">
              Descrição do projeto
            </label>

            <textarea
              id="edit-description"
              v-model="form.descricao_projeto"
              class="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500"
              :disabled="loading"
              placeholder="Conte o que o sistema faz e para quem."
              rows="4"
            />
          </div>

          <p class="rounded-lg bg-blue-50 px-4 py-3 text-xs text-blue-800">
            O link do sistema é informado na <strong>pré-avaliação</strong> e aparece automaticamente no projeto.
          </p>

          <!-- Logo -->
          <div>
            <span class="mb-2 block text-sm font-medium text-gray-700">Logo do projeto</span>

            <LogoUpload
              :key="logoKey"
              :accepted-formats="['image/png', 'image/jpeg', 'image/webp']"
              :max-size-mb="5"
              :model-value="form.removerLogo ? null : logoUrl"
              @error="erroLogo = $event"
              @update:model-value="aoEscolherLogo"
            />

            <button
              v-if="logoUrl && !form.removerLogo && !form.logo"
              class="mt-2 text-sm text-red-600 hover:underline"
              :disabled="loading"
              type="button"
              @click="removerLogoAtual"
            >
              Remover logo atual
            </button>

            <p v-if="form.removerLogo" class="mt-2 text-sm text-gray-500">
              A logo será removida ao salvar.
            </p>

            <p v-if="erroLogo" class="mt-1 text-sm text-red-600">{{ erroLogo }}</p>
          </div>

          <!-- Erro -->
          <p v-if="error" class="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600" role="alert">
            {{ error }}
          </p>

          <!-- Botões -->
          <div class="mt-2 flex justify-end gap-3 border-t border-gray-100 pt-5">
            <AppButton :disabled="loading" label="Cancelar" variant="secondary" @click="closeModal" />

            <AppButton
              :disabled="loading"
              :label="loading ? 'Salvando...' : 'Salvar alterações'"
              :loading="loading"
              variant="primary"
              @click="handleSave"
            />
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>
