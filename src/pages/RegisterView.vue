<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import RegisterCard from '@/components/layout/RegisterCard/RegisterCard.vue'
import AuthLayout from '@/components/layout/AuthLayout/AuthLayout.vue'

import { registrarUsuario } from '@/services/auth'
import { ApiError } from '@/services/http'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
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

    // Volta ao que a pessoa queria fazer (ex.: inscrever a equipe), se veio de um link com redirect.
    const redirect = route.query.redirect
    await router.push(
      typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//')
        ? redirect
        : '/home',
    )
  } catch {
    error.value =
      'Sua conta foi criada, mas não foi possível entrar automaticamente. Acesse a página de login para continuar.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <AuthLayout mode="register">
    <RegisterCard
      :is-loading="isLoading"
      :error="error"
      @submit="handleRegister"
      @login-redirect="router.push({ path: '/login', query: route.query.redirect ? { redirect: route.query.redirect } : {} })"
      @open-terms="abrirTermos"
    />
  </AuthLayout>
</template>
