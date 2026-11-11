<script setup lang="ts">
  import { ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import AuthLayout from '@/components/layout/AuthLayout/AuthLayout.vue'
  import LoginCard from '@/components/layout/LoginCard/LoginCard.vue'
  import { useAuthStore } from '@/stores/auth'

  const router = useRouter()
  const route = useRoute()
  const authStore = useAuthStore()

  const error = ref('')

  interface LoginPayload {
    email: string
    password: string
    rememberMe: boolean
  }

  async function handleLogin (payload: LoginPayload) {
    error.value = ''

    try {
      await authStore.signIn(
        payload.email,
        payload.password,
        payload.rememberMe,
      )

      const redirect = route.query.redirect

      await router.push(
        typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//')
          ? redirect
          : '/home',
      )
    } catch (error_) {
      error.value
        = error_ instanceof Error
          ? error_.message
          : 'Não foi possível realizar o login.'
    }
  }
</script>

<template>
  <AuthLayout mode="login">
    <LoginCard
      :error="error"
      :is-loading="authStore.isLoading"
      @create-account="router.push({ path: '/registro', query: route.query.redirect ? { redirect: route.query.redirect } : {} })"
      @submit="handleLogin"
    />
  </AuthLayout>
</template>
