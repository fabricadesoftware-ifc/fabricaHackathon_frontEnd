<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import LoginCard from '@/components/layout/LoginCard/LoginCard.vue'
import AuthLayout from '@/components/layout/AuthLayout/AuthLayout.vue'
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

async function handleLogin(payload: LoginPayload) {
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
    } catch (err) {
        error.value =
            err instanceof Error
                ? err.message
                : 'Não foi possível realizar o login.'
    }
}
</script>

<template>
  <AuthLayout mode="login">
    <LoginCard
      :is-loading="authStore.isLoading"
      :error="error"
      @submit="handleLogin"
      @create-account="router.push({ path: '/registro', query: route.query.redirect ? { redirect: route.query.redirect } : {} })"
    />
  </AuthLayout>
</template>
