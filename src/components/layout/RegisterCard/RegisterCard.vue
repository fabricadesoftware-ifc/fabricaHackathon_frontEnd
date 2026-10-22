<script setup lang="ts">
import { reactive, ref } from 'vue'

export interface Props {
  submitText?: string
  isLoading?: boolean
}

withDefaults(defineProps<Props>(), {
  submitText: 'Criar conta',
  isLoading: false,
})

interface RegisterPayload {
  name: string
  surname: string
  email: string
  password: string
  passwordConfirm: string
  acceptTerms: boolean
}

type FieldName = keyof RegisterPayload

const emit = defineEmits<{
  (e: 'submit', payload: RegisterPayload): void
  (e: 'login-redirect'): void
  (e: 'open-terms'): void
}>()

const showPassword = ref(false)
const showPasswordConfirm = ref(false)

const form = reactive<RegisterPayload>({
  name: '',
  surname: '',
  email: '',
  password: '',
  passwordConfirm: '',
  acceptTerms: false,
})

const errors = reactive<Record<FieldName, string>>({
  name: '',
  surname: '',
  email: '',
  password: '',
  passwordConfirm: '',
  acceptTerms: '',
})

function clearError(field: FieldName) {
  errors[field] = ''

  if (field === 'password') {
    errors.passwordConfirm = ''
  }
}

function validate(): boolean {
  for (const key of Object.keys(errors) as FieldName[]) {
    errors[key] = ''
  }

  if (!form.name.trim()) {
    errors.name = 'O nome é obrigatório.'
  }

  if (!form.surname.trim()) {
    errors.surname = 'O sobrenome é obrigatório.'
  }

  const email = form.email.trim()

  if (!email) {
    errors.email = 'O e-mail é obrigatório.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Insira um e-mail válido.'
  }

  if (!form.password) {
    errors.password = 'A senha é obrigatória.'
  } else if (form.password.length < 8) {
    errors.password = 'A senha deve ter pelo menos 8 caracteres.'
  }

  if (!form.passwordConfirm) {
    errors.passwordConfirm = 'Confirme sua senha.'
  } else if (form.password !== form.passwordConfirm) {
    errors.passwordConfirm = 'As senhas não coincidem.'
  }

  if (!form.acceptTerms) {
    errors.acceptTerms = 'Aceite os termos para continuar.'
  }

  return Object.values(errors).every(error => !error)
}

function handleSubmit() {
  if (!validate()) return

  emit('submit', {
    name: form.name.trim(),
    surname: form.surname.trim(),
    email: form.email.trim(),
    password: form.password,
    passwordConfirm: form.passwordConfirm,
    acceptTerms: form.acceptTerms,
  })
}

function inputClass(field: FieldName) {
  return [
    'w-full rounded-lg border px-3 py-2 text-sm sm:text-base text-gray-900',
    'placeholder-gray-400 transition-colors focus:outline-none focus:ring-1',
    'disabled:bg-gray-100 disabled:text-gray-500',
    errors[field]
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-blue-500',
  ]
}
</script>

<template>
  <div
    class="mx-auto flex w-full max-w-150 flex-col rounded-xl border border-gray-200 bg-white px-5 py-8 font-sans shadow sm:px-10 sm:py-11"
  >
    <!-- Cabeçalho -->
    <div class="mb-4 flex flex-col text-center">
      <span class="mb-4 font-semibold text-gray-900">
        HackIFC
        <span class="text-blue-600">// 24H</span>
      </span>

      <h1 class="text-2xl font-normal text-gray-900">
        Crie sua conta
      </h1>

      <p class="text-sm text-gray-600 sm:text-base">
        Crie sua conta para gerenciar seus projetos e participar de hackathons.
      </p>
    </div>

    <!-- Formulário -->
    <form
      class="mt-2 flex flex-col gap-4"
      novalidate
      @submit.prevent="handleSubmit"
    >
      <!-- Nome e sobrenome -->
      <div class="flex flex-col gap-3 sm:flex-row">
        <!-- Nome -->
        <div class="min-w-0 flex-1 text-start">
          <label
            for="register-name"
            class="mb-1 block pl-2 text-xs tracking-wide text-gray-600 sm:text-sm"
          >
            Nome
          </label>

          <input
            id="register-name"
            v-model="form.name"
            type="text"
            autocomplete="given-name"
            placeholder="Insira seu nome"
            :disabled="isLoading"
            :aria-invalid="Boolean(errors.name)"
            :aria-describedby="errors.name ? 'register-name-error' : undefined"
            :class="inputClass('name')"
            @input="clearError('name')"
          >

          <span
            v-if="errors.name"
            id="register-name-error"
            class="mt-1 block pl-2 text-xs text-red-500"
          >
            {{ errors.name }}
          </span>
        </div>

        <!-- Sobrenome -->
        <div class="min-w-0 flex-1 text-start">
          <label
            for="register-surname"
            class="mb-1 block pl-2 text-xs tracking-wide text-gray-600 sm:text-sm"
          >
            Sobrenome
          </label>

          <input
            id="register-surname"
            v-model="form.surname"
            type="text"
            autocomplete="family-name"
            placeholder="Insira seu sobrenome"
            :disabled="isLoading"
            :aria-invalid="Boolean(errors.surname)"
            :aria-describedby="errors.surname ? 'register-surname-error' : undefined"
            :class="inputClass('surname')"
            @input="clearError('surname')"
          >

          <span
            v-if="errors.surname"
            id="register-surname-error"
            class="mt-1 block pl-2 text-xs text-red-500"
          >
            {{ errors.surname }}
          </span>
        </div>
      </div>

      <!-- E-mail -->
      <div class="text-start">
        <label
          for="register-email"
          class="mb-1 block pl-2 text-xs tracking-wide text-gray-600 sm:text-sm"
        >
          E-mail
        </label>

        <input
          id="register-email"
          v-model="form.email"
          type="email"
          autocomplete="email"
          placeholder="Insira seu e-mail"
          :disabled="isLoading"
          :aria-invalid="Boolean(errors.email)"
          :aria-describedby="errors.email ? 'register-email-error' : undefined"
          :class="inputClass('email')"
          @input="clearError('email')"
        >

        <span
          v-if="errors.email"
          id="register-email-error"
          class="mt-1 block pl-2 text-xs text-red-500"
        >
          {{ errors.email }}
        </span>
      </div>

      <!-- Senha -->
      <div class="text-start">
        <label
          for="register-password"
          class="mb-1 block pl-2 text-xs tracking-wide text-gray-600 sm:text-sm"
        >
          Senha
        </label>

        <div class="relative">
          <input
            id="register-password"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="new-password"
            placeholder="Insira sua senha"
            :disabled="isLoading"
            :aria-invalid="Boolean(errors.password)"
            :aria-describedby="errors.password ? 'register-password-error' : undefined"
            :class="[...inputClass('password'), 'pr-11']"
            @input="clearError('password')"
          >

          <button
            type="button"
            :disabled="isLoading"
            :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'"
            :aria-pressed="showPassword"
            class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-blue-500 disabled:opacity-50"
            @click="showPassword = !showPassword"
          >
            <span
              :class="[
                'mdi text-xl',
                showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline',
              ]"
              aria-hidden="true"
            />
          </button>
        </div>

        <span
          v-if="errors.password"
          id="register-password-error"
          class="mt-1 block pl-2 text-xs text-red-500"
        >
          {{ errors.password }}
        </span>
      </div>

      <!-- Confirmar senha -->
      <div class="text-start">
        <label
          for="register-password-confirm"
          class="mb-1 block pl-2 text-xs tracking-wide text-gray-600 sm:text-sm"
        >
          Confirme sua senha
        </label>

        <div class="relative">
          <input
            id="register-password-confirm"
            v-model="form.passwordConfirm"
            :type="showPasswordConfirm ? 'text' : 'password'"
            autocomplete="new-password"
            placeholder="Confirme sua senha"
            :disabled="isLoading"
            :aria-invalid="Boolean(errors.passwordConfirm)"
            :aria-describedby="errors.passwordConfirm ? 'register-password-confirm-error' : undefined"
            :class="[...inputClass('passwordConfirm'), 'pr-11']"
            @input="clearError('passwordConfirm')"
          >

          <button
            type="button"
            :disabled="isLoading"
            :aria-label="showPasswordConfirm ? 'Ocultar confirmação de senha' : 'Mostrar confirmação de senha'"
            :aria-pressed="showPasswordConfirm"
            class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-blue-500 disabled:opacity-50"
            @click="showPasswordConfirm = !showPasswordConfirm"
          >
            <span
              :class="[
                'mdi text-xl',
                showPasswordConfirm ? 'mdi-eye-off-outline' : 'mdi-eye-outline',
              ]"
              aria-hidden="true"
            />
          </button>
        </div>

        <span
          v-if="errors.passwordConfirm"
          id="register-password-confirm-error"
          class="mt-1 block pl-2 text-xs text-red-500"
        >
          {{ errors.passwordConfirm }}
        </span>
      </div>

      <!-- Termos e condições -->
      <div class="flex flex-col gap-1">
        <div class="flex items-center gap-2">
          <input
            id="register-terms"
            v-model="form.acceptTerms"
            type="checkbox"
            :disabled="isLoading"
            :aria-invalid="Boolean(errors.acceptTerms)"
            :aria-describedby="errors.acceptTerms ? 'register-terms-error' : undefined"
            class="h-4 w-4 shrink-0 cursor-pointer rounded border-gray-300 accent-blue-600 disabled:opacity-50"
            @change="clearError('acceptTerms')"
          >

          <span class="text-sm text-gray-700">
            <label
              for="register-terms"
              class="cursor-pointer"
            >
              Concordo com os
            </label>

            <button
              type="button"
              :disabled="isLoading"
              class="font-medium text-blue-500 underline underline-offset-2 hover:text-blue-600 disabled:opacity-50"
              @click="emit('open-terms')"
            >
              termos &amp; condições
            </button>
          </span>
        </div>

        <span
          v-if="errors.acceptTerms"
          id="register-terms-error"
          class="block pl-2 text-xs text-red-500"
        >
          {{ errors.acceptTerms }}
        </span>
      </div>

      <!-- Botão de cadastro -->
      <button
        type="submit"
        :disabled="isLoading"
        class="mt-2 flex w-full items-center justify-center rounded-lg bg-[#2563eb] px-4 py-2.5 text-sm font-medium text-white shadow transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
      >
        <span
          v-if="isLoading"
          class="mdi mdi-loading mdi-spin mr-2"
          aria-hidden="true"
        />

        {{ submitText }}
      </button>

      <!-- Link para login -->
      <div class="text-center text-sm font-medium text-gray-600">
        Já tem uma conta?

        <button
          type="button"
          :disabled="isLoading"
          class="font-medium text-blue-500 underline underline-offset-2 hover:text-blue-600 disabled:opacity-50"
          @click="emit('login-redirect')"
        >
          Entrar
        </button>
      </div>
    </form>
  </div>
</template>