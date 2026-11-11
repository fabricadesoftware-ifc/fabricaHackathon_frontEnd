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
      <p class="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">Acesse sua conta</p>

      <h1 class="text-[30px] font-bold leading-tight tracking-tight text-slate-800 sm:text-[34px]">
        Bem-vindo de volta
      </h1>

      <p class="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
        Entre para acompanhar suas edições e projetos.
      </p>
    </div>

    <form class="space-y-5" novalidate @submit.prevent="handleSubmit">
      <div>
        <label class="mb-2 block text-sm font-medium text-slate-700" for="login-email">E-mail</label>

        <input
          id="login-email"
          v-model="form.email"
          :aria-describedby="errors.email ? 'login-email-error' : undefined"
          :aria-invalid="Boolean(errors.email)"
          autocomplete="email"
          class="h-12 w-full rounded-lg border bg-white px-4 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-500"
          :class="errors.email ? 'border-red-400' : 'border-slate-300'"
          :disabled="isLoading"
          inputmode="email"
          placeholder="seuemail@exemplo.com"
          type="email"
          @input="errors.email = ''"
        >

        <p v-if="errors.email" id="login-email-error" class="mt-1.5 text-xs text-red-600">{{ errors.email }}</p>
      </div>

      <div>
        <label class="mb-2 block text-sm font-medium text-slate-700" for="login-password">Senha</label>

        <div class="relative">
          <input
            id="login-password"
            v-model="form.password"
            :aria-describedby="errors.password ? 'login-password-error' : undefined"
            :aria-invalid="Boolean(errors.password)"
            autocomplete="current-password"
            class="h-12 w-full rounded-lg border bg-white px-4 pr-12 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-500"
            :class="errors.password ? 'border-red-400' : 'border-slate-300'"
            :disabled="isLoading"
            placeholder="Digite sua senha"
            :type="showPassword ? 'text' : 'password'"
            @input="errors.password = ''"
          >

          <button
            :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'"
            :aria-pressed="showPassword"
            class="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-lg text-slate-500 transition-colors hover:text-blue-600 disabled:opacity-50"
            :disabled="isLoading"
            type="button"
            @click="showPassword = !showPassword"
          >
            <span aria-hidden="true" class="mdi text-xl" :class="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'" />
          </button>
        </div>

        <p v-if="errors.password" id="login-password-error" class="mt-1.5 text-xs text-red-600">{{ errors.password }}</p>
      </div>

      <label class="inline-flex min-h-6 cursor-pointer items-center gap-3 text-sm text-slate-600">
        <input v-model="form.rememberMe" class="h-4 w-4 rounded border-slate-300 accent-[#2563EB]" :disabled="isLoading" type="checkbox">
        Lembrar sessão
      </label>

      <p v-if="error" class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700" role="alert">
        {{ error }}
      </p>

      <button
        class="flex h-12 w-full items-center justify-center rounded-lg bg-[#2563EB] px-5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        :disabled="isLoading"
        type="submit"
      >
        <span v-if="isLoading" aria-hidden="true" class="mdi mdi-loading mdi-spin mr-2 text-lg" />
        {{ isLoading ? 'Entrando...' : submitText }}
      </button>
    </form>

    <p class="mt-5 text-center text-xs leading-5 text-slate-500">
      Esqueceu a senha? Fale com a organização do evento para redefini-la.
    </p>

    <div class="mt-8 border-t border-slate-200 pt-6 text-center text-sm text-slate-600">
      Ainda não tem uma conta?
      <button class="ml-1 font-semibold text-blue-600 hover:text-blue-700 hover:underline disabled:opacity-50" :disabled="isLoading" type="button" @click="emit('create-account')">
        Criar conta
      </button>
    </div>
  </div>
</template>
