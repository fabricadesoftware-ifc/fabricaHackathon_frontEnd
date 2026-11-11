<script setup lang="ts">
  import { reactive, ref } from 'vue'

  export interface Props {
    submitText?: string
    isLoading?: boolean
    error?: string
  }

  withDefaults(defineProps<Props>(), {
    submitText: 'Entrar',
    isLoading: false,
    error: '',
  })

  const emit = defineEmits<{
    (e: 'submit', payload: { email: string, password: string, rememberMe: boolean }): void
    (e: 'create-account'): void
  }>()

  const showPassword = ref(false)
  const form = reactive({ email: '', password: '', rememberMe: false })
  const errors = reactive({ email: '', password: '' })

  function handleSubmit () {
    errors.email = ''
    errors.password = ''

    const email = form.email.trim()
    if (!email) {
      errors.email = 'O e-mail é obrigatório.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Insira um e-mail válido.'
    }

    if (!form.password) {
      errors.password = 'A senha é obrigatória.'
    }

    if (errors.email || errors.password) return
    emit('submit', { email, password: form.password, rememberMe: form.rememberMe })
  }
</script>

<template>
  <div>
    <div class="mb-8">
      <p class="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-app-link">Acesse sua conta</p>

      <h1 class="text-[30px] font-bold leading-tight tracking-tight text-app-text-heading sm:text-[34px]">
        Bem-vindo de volta
      </h1>

      <p class="mt-2 text-sm leading-6 text-app-text-muted sm:text-base">
        Entre para acompanhar suas edições e projetos.
      </p>
    </div>

    <form class="space-y-5" novalidate @submit.prevent="handleSubmit">
      <div>
        <label class="mb-2 block text-sm font-medium text-app-text-body-strong" for="login-email">E-mail</label>

        <input
          id="login-email"
          v-model="form.email"
          :aria-describedby="errors.email ? 'login-email-error' : undefined"
          :aria-invalid="Boolean(errors.email)"
          autocomplete="email"
          class="h-12 w-full rounded-lg border bg-app-surface px-4 text-sm text-app-text-heading outline-none transition-colors placeholder:text-app-text-placeholder hover:border-app-border-active focus:border-app-brand-border-500 focus:ring-2 focus:ring-app-focus-halo disabled:bg-app-surface-subtle disabled:text-app-text-muted"
          :class="errors.email ? 'border-app-danger-border-400' : 'border-app-border-strong'"
          :disabled="isLoading"
          inputmode="email"
          placeholder="seuemail@exemplo.com"
          type="email"
          @input="errors.email = ''"
        >

        <p v-if="errors.email" id="login-email-error" class="mt-1.5 text-xs text-app-danger-text-600">{{ errors.email }}</p>
      </div>

      <div>
        <label class="mb-2 block text-sm font-medium text-app-text-body-strong" for="login-password">Senha</label>

        <div class="relative">
          <input
            id="login-password"
            v-model="form.password"
            :aria-describedby="errors.password ? 'login-password-error' : undefined"
            :aria-invalid="Boolean(errors.password)"
            autocomplete="current-password"
            class="h-12 w-full rounded-lg border bg-app-surface px-4 pr-12 text-sm text-app-text-heading outline-none transition-colors placeholder:text-app-text-placeholder hover:border-app-border-active focus:border-app-brand-border-500 focus:ring-2 focus:ring-app-focus-halo disabled:bg-app-surface-subtle disabled:text-app-text-muted"
            :class="errors.password ? 'border-app-danger-border-400' : 'border-app-border-strong'"
            :disabled="isLoading"
            placeholder="Digite sua senha"
            :type="showPassword ? 'text' : 'password'"
            @input="errors.password = ''"
          >

          <button
            :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'"
            :aria-pressed="showPassword"
            class="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-lg text-app-text-muted transition-colors hover:text-app-link disabled:opacity-50"
            :disabled="isLoading"
            type="button"
            @click="showPassword = !showPassword"
          >
            <span aria-hidden="true" class="mdi text-xl" :class="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'" />
          </button>
        </div>

        <p v-if="errors.password" id="login-password-error" class="mt-1.5 text-xs text-app-danger-text-600">{{ errors.password }}</p>
      </div>

      <label class="inline-flex min-h-6 cursor-pointer items-center gap-3 text-sm text-app-text-secondary">
        <input v-model="form.rememberMe" class="h-4 w-4 rounded border-app-border-strong accent-app-brand-text" :disabled="isLoading" type="checkbox">
        Lembrar sessão
      </label>

      <p v-if="error" class="rounded-lg border border-app-danger-border-200 bg-app-danger-surface-50 px-4 py-3 text-sm leading-5 text-app-danger-text-700" role="alert">
        {{ error }}
      </p>

      <button
        class="flex h-12 w-full items-center justify-center rounded-lg bg-app-brand-action px-5 text-sm font-semibold text-app-on-brand transition-colors hover:bg-app-action-hover disabled:cursor-not-allowed disabled:opacity-70"
        :disabled="isLoading"
        type="submit"
      >
        <span v-if="isLoading" aria-hidden="true" class="mdi mdi-loading mdi-spin mr-2 text-lg" />
        {{ isLoading ? 'Entrando...' : submitText }}
      </button>
    </form>

    <p class="mt-5 text-center text-xs leading-5 text-app-text-muted">
      Esqueceu a senha? Fale com a organização do evento para redefini-la.
    </p>

    <div class="mt-8 border-t border-app-border-default pt-6 text-center text-sm text-app-text-secondary">
      Ainda não tem uma conta?
      <button class="ml-1 font-semibold text-app-link hover:text-app-link-hover hover:underline disabled:opacity-50" :disabled="isLoading" type="button" @click="emit('create-account')">
        Criar conta
      </button>
    </div>
  </div>
</template>
