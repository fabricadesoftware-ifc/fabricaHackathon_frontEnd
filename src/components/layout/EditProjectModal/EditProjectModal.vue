<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import AppButton from '@/components/ui/AppButton/AppButton.vue'
import LogoUpload from '@/components/ui/LogoUpload/LogoUpload.vue'

interface EditProjectPayload {
    nome_equipe: string
    nome_projeto: string
    descricao_projeto: string
    link_deploy_projeto: string
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
        deployUrl: string
        logoUrl?: string | null
        loading?: boolean
        error?: string
    }>(),
    {
        logoUrl: null,
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
    link_deploy_projeto: '',
    logo: null,
    removerLogo: false,
})
const erroLogo = ref('')
// Troca a chave do preview ao remover a logo atual.
const logoKey = ref(0)

function removerLogoAtual() {
    form.logo = null
    form.removerLogo = true
    logoKey.value++
}

function aoEscolherLogo(arquivo: File | null) {
    form.logo = arquivo
    form.removerLogo = false
    erroLogo.value = ''
}

// Preenche o formulário ao abrir o modal
watch(
    () => props.modelValue,
    (open) => {
        if (!open) return

        form.nome_equipe = props.teamName
        form.nome_projeto = props.projectName
        form.descricao_projeto = props.description
        form.link_deploy_projeto = props.deployUrl
        form.logo = null
        form.removerLogo = false
        erroLogo.value = ''
        logoKey.value++
    },
    { immediate: true },
)

function closeModal() {
    if (props.loading) return

    emit('update:modelValue', false)
}

function handleSave() {
    if (props.loading) return

    if (
        !form.nome_equipe.trim() ||
        !form.nome_projeto.trim() ||
        !form.descricao_projeto.trim()
    ) {
        return
    }

    emit('save', {
        nome_equipe: form.nome_equipe.trim(),
        nome_projeto: form.nome_projeto.trim(),
        descricao_projeto: form.descricao_projeto.trim(),
        link_deploy_projeto: form.link_deploy_projeto.trim(),
        logo: form.logo,
        removerLogo: form.removerLogo,
    })
}

function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
        closeModal()
    }
}
</script>

<template>
    <Teleport to="body">
        <div v-if="modelValue" class="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4"
            @click.self="closeModal" @keydown="handleKeydown">
            <div role="dialog" aria-modal="true" aria-labelledby="edit-project-title" tabindex="-1"
                class="w-full max-w-xl rounded-xl bg-white p-6 shadow-xl">
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

                    <button type="button" class="text-xl text-gray-400 hover:text-gray-700" aria-label="Fechar modal"
                        :disabled="loading" @click="closeModal">
                        ✕
                    </button>
                </div>

                <!-- Formulário -->
                <form class="flex flex-col gap-5" @submit.prevent>
                    <!-- Nome da equipe -->
                    <div>
                        <label for="edit-team-name" class="mb-2 block text-sm font-medium text-gray-700">
                            Nome da equipe
                        </label>

                        <input id="edit-team-name" v-model="form.nome_equipe" type="text" required :disabled="loading"
                            class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500">
                    </div>

                    <!-- Nome do projeto -->
                    <div>
                        <label for="edit-project-name" class="mb-2 block text-sm font-medium text-gray-700">
                            Nome do projeto
                        </label>

                        <input id="edit-project-name" v-model="form.nome_projeto" type="text" required
                            :disabled="loading"
                            class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500">
                    </div>

                    <!-- Descrição -->
                    <div>
                        <label for="edit-description" class="mb-2 block text-sm font-medium text-gray-700">
                            Descrição do projeto
                        </label>

                        <textarea id="edit-description" v-model="form.descricao_projeto" rows="4" required
                            :disabled="loading"
                            class="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500" />
                    </div>

                    <!-- Link do deploy -->
                    <div>
                        <label for="edit-deploy" class="mb-2 block text-sm font-medium text-gray-700">
                            Link do deploy
                        </label>

                        <input id="edit-deploy" v-model="form.link_deploy_projeto" type="url"
                            placeholder="https://meuprojeto.vercel.app" :disabled="loading"
                            class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500">

                        <p class="mt-1 text-xs text-gray-500">
                            Opcional. Informe uma URL válida.
                        </p>
                    </div>

                    <!-- Logo -->
                    <div>
                        <span class="mb-2 block text-sm font-medium text-gray-700">Logo do projeto</span>

                        <LogoUpload :key="logoKey" :accepted-formats="['image/png', 'image/jpeg', 'image/webp']"
                            :max-size-mb="5" :model-value="form.removerLogo ? null : logoUrl"
                            @error="erroLogo = $event" @update:model-value="aoEscolherLogo" />

                        <button v-if="logoUrl && !form.removerLogo && !form.logo" type="button"
                            class="mt-2 text-sm text-red-600 hover:underline" :disabled="loading"
                            @click="removerLogoAtual">
                            Remover logo atual
                        </button>

                        <p v-if="form.removerLogo" class="mt-2 text-sm text-gray-500">
                            A logo será removida ao salvar.
                        </p>
                        <p v-if="erroLogo" class="mt-1 text-sm text-red-600">{{ erroLogo }}</p>
                    </div>

                    <!-- Erro -->
                    <p v-if="error" role="alert" class="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                        {{ error }}
                    </p>

                    <!-- Botões -->
                    <div class="mt-2 flex justify-end gap-3 border-t border-gray-100 pt-5">
                        <AppButton label="Cancelar" variant="secondary" :disabled="loading" @click="closeModal" />

                        <AppButton :label="loading ? 'Salvando...' : 'Salvar alterações'" variant="primary"
                            :disabled="loading" :loading="loading" @click="handleSave" />
                    </div>
                </form>
            </div>
        </div>
    </Teleport>
</template>