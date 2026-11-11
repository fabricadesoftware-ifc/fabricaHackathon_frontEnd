<script setup lang="ts">
  import { reactive, ref } from 'vue'

  export interface Props {
    submitText?: string
    isLoading?: boolean
    error?: string
  }

  withDefaults(defineProps<Props>(), {
    submitText: 'Criar conta',
    isLoading: false,
    error: '',
  })

  interface RegisterPayload {
    name: string
    surname: string
    email: string
    password: string
    passwordConfirm: string
    acceptTerms: boolean
    perfil: 'PARTICIPANTE' | 'AVALIADOR' | 'PROFESSOR'
  }

  type FieldName = Exclude<keyof RegisterPayload, 'perfil'>

  const emit = defineEmits<{
    (e: 'submit', payload: RegisterPayload): void
    (e: 'login-redirect' | 'open-terms'): void
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
    perfil: 'PARTICIPANTE',
  })
  const errors = reactive<Record<FieldName, string>>({
    name: '',
    surname: '',
    email: '',
    password: '',
    passwordConfirm: '',
    acceptTerms: '',
  })

  function clearError (field: FieldName) {
    errors[field] = ''
    if (field === 'password') errors.passwordConfirm = ''
  }

  function validate (): boolean {
    for (const key of Object.keys(errors) as FieldName[]) errors[key] = ''

    if (!form.name.trim()) errors.name = 'O nome é obrigatório.'
    if (!form.surname.trim()) errors.surname = 'O sobrenome é obrigatório.'

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

    if (!form.acceptTerms) errors.acceptTerms = 'Aceite os termos para continuar.'
    return Object.values(errors).every(error => !error)
  }

  function handleSubmit () {
    if (!validate()) return
    emit('submit', {
      name: form.name.trim(),
      surname: form.surname.trim(),
      email: form.email.trim(),
      password: form.password,
      passwordConfirm: form.passwordConfirm,
      acceptTerms: form.acceptTerms,
      perfil: form.perfil,
    })
  }

  function inputClass (field: FieldName) {
    return [
      'h-12 w-full rounded-lg border bg-white px-4 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-500',
      errors[field] ? 'border-red-400' : 'border-slate-300',
    ]
  }
</script>

<template>
  <div>
    <div class="mb-7">
      <p class="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">Comece por aqui</p>
      <h1 class="text-[30px] font-bold leading-tight tracking-tight text-slate-800 sm:text-[34px]">Crie sua conta</h1>

      <p class="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
        Preencha seus dados para participar do HackIFC.
      </p>
    </div>

    <form class="space-y-4" novalidate @submit.prevent="handleSubmit">
      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700" for="register-name">Nome</label>

          <input
            id="register-name"
            v-model="form.name"
            :aria-describedby="errors.name ? 'register-name-error' : undefined"
            :aria-invalid="Boolean(errors.name)"
            autocomplete="given-name"
            :class="inputClass('name')"
            :disabled="isLoading"
            placeholder="Seu nome"
            type="text"
            @input="clearError('name')"
          >

          <p v-if="errors.name" id="register-name-error" class="mt-1.5 text-xs text-red-600">{{ errors.name }}</p>
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700" for="register-surname">Sobrenome</label>

          <input
            id="register-surname"
            v-model="form.surname"
            :aria-describedby="errors.surname ? 'register-surname-error' : undefined"
            :aria-invalid="Boolean(errors.surname)"
            autocomplete="family-name"
            :class="inputClass('surname')"
            :disabled="isLoading"
            placeholder="Seu sobrenome"
            type="text"
            @input="clearError('surname')"
          >

          <p v-if="errors.surname" id="register-surname-error" class="mt-1.5 text-xs text-red-600">{{ errors.surname }}</p>
        </div>
      </div>

      <div>
        <label class="mb-2 block text-sm font-medium text-slate-700" for="register-email">E-mail</label>

        <input
          id="register-email"
          v-model="form.email"
          :aria-describedby="errors.email ? 'register-email-error' : undefined"
          :aria-invalid="Boolean(errors.email)"
          autocomplete="email"
          :class="inputClass('email')"
          :disabled="isLoading"
          inputmode="email"
          placeholder="seuemail@exemplo.com"
          type="email"
          @input="clearError('email')"
        >

        <p v-if="errors.email" id="register-email-error" class="mt-1.5 text-xs text-red-600">{{ errors.email }}</p>
      </div>

      <div>
        <label class="mb-2 block text-sm font-medium text-slate-700" for="register-perfil">Quero me cadastrar como</label>

        <select
          id="register-perfil"
          v-model="form.perfil"
          :aria-describedby="form.perfil !== 'PARTICIPANTE' ? 'register-perfil-info' : undefined"
          class="h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-800 outline-none transition-colors hover:border-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
          :disabled="isLoading"
        >
          <option value="PARTICIPANTE">Participante</option>
          <option value="AVALIADOR">Avaliador</option>
          <option value="PROFESSOR">Professor</option>
        </select>

        <p
          v-if="form.perfil !== 'PARTICIPANTE'"
          id="register-perfil-info"
          class="mt-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs leading-5 text-slate-600"
        >
          Você entra como participante e o perfil é liberado após aprovação de um administrador.
        </p>
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700" for="register-password">Senha</label>

          <div class="relative">
            <input
              id="register-password"
              v-model="form.password"
              :aria-describedby="errors.password ? 'register-password-error' : undefined"
              :aria-invalid="Boolean(errors.password)"
              autocomplete="new-password"
              :class="[...inputClass('password'), 'pr-11']"
              :disabled="isLoading"
              placeholder="Mínimo de 8 caracteres"
              :type="showPassword ? 'text' : 'password'"
              @input="clearError('password')"
            >

            <button
              :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'"
              :aria-pressed="showPassword"
              class="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-slate-500 hover:text-blue-600 disabled:opacity-50"
              :disabled="isLoading"
              type="button"
              @click="showPassword = !showPassword"
            >
              <span aria-hidden="true" class="mdi text-xl" :class="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'" />
            </button>
          </div>

          <p v-if="errors.password" id="register-password-error" class="mt-1.5 text-xs text-red-600">{{ errors.password }}</p>
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700" for="register-password-confirm">Confirmar senha</label>

          <div class="relative">
            <input
              id="register-password-confirm"
              v-model="form.passwordConfirm"
              :aria-describedby="errors.passwordConfirm ? 'register-password-confirm-error' : undefined"
              :aria-invalid="Boolean(errors.passwordConfirm)"
              autocomplete="new-password"
              :class="[...inputClass('passwordConfirm'), 'pr-11']"
              :disabled="isLoading"
              placeholder="Repita sua senha"
              :type="showPasswordConfirm ? 'text' : 'password'"
              @input="clearError('passwordConfirm')"
            >

            <button
              :aria-label="showPasswordConfirm ? 'Ocultar confirmação de senha' : 'Mostrar confirmação de senha'"
              :aria-pressed="showPasswordConfirm"
              class="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-slate-500 hover:text-blue-600 disabled:opacity-50"
              :disabled="isLoading"
              type="button"
              @click="showPasswordConfirm = !showPasswordConfirm"
            >
              <span aria-hidden="true" class="mdi text-xl" :class="showPasswordConfirm ? 'mdi-eye-off-outline' : 'mdi-eye-outline'" />
            </button>
          </div>

          <p v-if="errors.passwordConfirm" id="register-password-confirm-error" class="mt-1.5 text-xs text-red-600">{{ errors.passwordConfirm }}</p>
        </div>
      </div>

      <div>
        <div class="flex items-start gap-3">
          <input
            id="register-terms"
            v-model="form.acceptTerms"
            :aria-describedby="errors.acceptTerms ? 'register-terms-error' : undefined"
            :aria-invalid="Boolean(errors.acceptTerms)"
            class="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-[#2563EB]"
            :disabled="isLoading"
            type="checkbox"
            @change="clearError('acceptTerms')"
          >

          <div class="text-sm leading-5 text-slate-600">
            <label class="cursor-pointer" for="register-terms">Li e concordo com os</label>

            <button
              class="ml-1 font-semibold text-blue-600 hover:text-blue-700 hover:underline disabled:opacity-50"
              :disabled="isLoading"
              type="button"
              @click="emit('open-terms')"
            >termos de uso</button>.
          </div>
        </div>

        <p v-if="errors.acceptTerms" id="register-terms-error" class="mt-1.5 text-xs text-red-600">{{ errors.acceptTerms }}</p>
      </div>

      <p v-if="error" class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700" role="alert">
        {{ error }}
      </p>

      <button
        class="flex h-12 w-full items-center justify-center rounded-lg bg-[#2563EB] px-5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        :disabled="isLoading"
        type="submit"
      >
        <span v-if="isLoading" aria-hidden="true" class="mdi mdi-loading mdi-spin mr-2 text-lg" />
        {{ isLoading ? 'Criando conta...' : submitText }}
      </button>
    </form>

    <div class="mt-7 border-t border-slate-200 pt-6 text-center text-sm text-slate-600">
      Já tem uma conta?
      <button
        class="ml-1 font-semibold text-blue-600 hover:text-blue-700 hover:underline disabled:opacity-50"
        :disabled="isLoading"
        type="button"
        @click="emit('login-redirect')"
      >Entrar</button>
    </div>
  </div>
</template>
