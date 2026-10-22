<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import RegisterCard from '@/components/layout/RegisterCard/RegisterCard.vue'

import { registrarUsuario } from '@/services/auth'
import { ApiError } from '@/services/http'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isLoading = ref(false)
const error = ref('')

interface RegisterForm {
  name: string
  surname: string
  email: string
  password: string
  passwordConfirm: string
  acceptTerms: boolean
  perfil: 'PARTICIPANTE' | 'AVALIADOR' | 'PROFESSOR'
}

// Exibe mensagens de validação retornadas pelo Django.
function getErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    const fieldErrors = Object.values(err.fields).flat()

    if (fieldErrors.length) {
      return fieldErrors.join(' | ')
    }

    return err.message
  }

  return err instanceof Error
    ? err.message
    : 'Não foi possível criar sua conta.'
}

// Abre os termos em outra aba para não perder o que já foi preenchido.
function abrirTermos() {
  window.open(router.resolve('/termos').href, '_blank', 'noopener')
}

async function handleRegister(form: RegisterForm) {
  if (isLoading.value) return

  isLoading.value = true
  error.value = ''

  // Cadastro do usuário.
  try {
    await registrarUsuario({
      first_name: form.name,
      last_name: form.surname,
      email: form.email,
      username: form.email,
      password: form.password,
      ...(form.perfil !== 'PARTICIPANTE' && { perfil_solicitado: form.perfil }),
    })
  } catch (err) {
    error.value = getErrorMessage(err)
    isLoading.value = false
    return
  }

  // Login automático após o cadastro.
  try {
    await authStore.signIn(
      form.email,
      form.password,
      false,
    )

    await router.push('/home')
  } catch {
    error.value =
      'Sua conta foi criada, mas não foi possível entrar automaticamente. Acesse a página de login para continuar.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-[70vh] items-center justify-center">
    <div class="w-full">
      <RegisterCard
        :is-loading="isLoading"
        @submit="handleRegister"
        @login-redirect="router.push('/login')"
        @open-terms="abrirTermos"
      />

      <p
        v-if="error"
        role="alert"
        class="mt-4 text-center text-sm text-red-600"
      >
        {{ error }}
      </p>
    </div>
  </div>
</template>