import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import {
  login,
  obterUsuarioAtual,
} from '@/services/auth'

import {
  getToken,
  setTokens,
} from '@/services/http'

import type { Usuario } from '@/types/usuario'

export const useAuthStore = defineStore('auth', () => {
  // Estado da autenticação
  const user = ref<Usuario | null>(null)
  const accessToken = ref<string | null>(getToken())
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isInitialized = ref(false)

  // Verifica se o usuário está autenticado
  const isAuthenticated = computed(() =>
    Boolean(accessToken.value && user.value),
  )

  // Perfil do usuário
  const userRole = computed(() => user.value?.tipoUser ?? null)

  // Busca os dados do usuário autenticado
  async function fetchUser() {
    if (!accessToken.value) return

    user.value = await obterUsuarioAtual()
  }

  // Realiza o login
  async function signIn(
    username: string,
    password: string,
    rememberMe = false,
  ) {
    isLoading.value = true
    error.value = null

    try {
      const tokens = await login(username, password)

      setTokens(
        {
          access: tokens.access,
          refresh: tokens.refresh,
        },
        rememberMe,
      )

      accessToken.value = tokens.access

      await fetchUser()

      isInitialized.value = true

      return user.value
    } catch (err) {
      signOut()

      error.value =
        err instanceof Error
          ? err.message
          : 'Não foi possível realizar o login.'

      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Encerra a sessão
  function signOut() {
    setTokens(null)

    accessToken.value = null
    user.value = null
  }


  async function restoreSession() {
    if (isInitialized.value) return

    accessToken.value = getToken()

    if (!accessToken.value) {
      user.value = null
      isInitialized.value = true
      return
    }

    try {
      await fetchUser()
    } catch {
      signOut()
    } finally {
      isInitialized.value = true
    }
  }

  return {
    user,
    accessToken,
    isLoading,
    error,
    isAuthenticated,
    isInitialized,
    userRole,
    fetchUser,
    signIn,
    signOut,
    restoreSession,
  }
})