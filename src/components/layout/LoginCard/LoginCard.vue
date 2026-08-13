<template>
  <div class="flex flex-col w-full max-w-120 mx-auto py-11 px-10 border border-gray-200 bg-white shadow rounded-xl font-sans">
    <div class="flex flex-col text-center mb-4">
      <span class="whitespace-nowrap font-semibold text-gray-900 mb-4">
        HackIFC <span class="text-blue-600">// 24H</span>
      </span>
      <span class="whitespace-normal font-normal text-gray-900 text-2xl">
        Seja bem-vindo de volta
      </span>
      <span class="whitespace-normal font-normal text-gray-600">
        Gerencie seus projetos e participe de hackathons
      </span>
    </div>
    <form @submit.prevent="handleSubmit" class="flex flex-col gap-4 mt-2">
      <div class="text-start">
        <label for="email" class="mb-1 text-xs sm:text-sm tracking-wide text-gray-600 pl-2">
          Email
        </label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          placeholder="Insira seu email para continuar"
          :disabled="isLoading"
          class="text-sm sm:text-base relative w-full border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-1 py-2 px-3 transition-colors disabled:bg-gray-100 disabled:text-gray-500"
          :class="errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 hover:border-gray-400'"
        />
        <span v-if="errors.email" class="text-xs text-red-500 pl-2 mt-1 block">{{ errors.email }}</span>
      </div>
      <div class="text-start">
        <label for="senha" class="mb-1 text-xs sm:text-sm tracking-wide text-gray-600 pl-2">
          Senha
        </label>
        <div class="relative w-full">
          <input 
            id="senha" 
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Insira sua senha"
            :disabled="isLoading"
            class="text-sm sm:text-base relative w-full border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-1 py-2 pl-3 pr-10 transition-colors disabled:bg-gray-100 disabled:text-gray-500"
            :class="errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 hover:border-gray-400'"
          />
          <button 
            type="button" 
            @click="showPassword = !showPassword"
            :disabled="isLoading"
            class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-blue-500 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Alternar visibilidade da senha"
          >
            <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
            </svg>
             <svg v-else  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
        <span v-if="errors.password" class="text-xs text-red-500 pl-2 mt-1 block">{{ errors.password }}</span>
      </div>
      <div class="flex items-center justify-between mt-1">
        <label class="flex items-center gap-2 cursor-pointer group">
          <input 
  type="checkbox" 
  v-model="form.rememberMe"
  :disabled="isLoading"
  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-lg cursor-pointer disabled:opacity-50"
/>
          <span class="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">Lembrar-me</span>
        </label>
        <button 
          type="button" 
          @click="$emit('forgot-password')"
          :disabled="isLoading"
          class="text-sm text-blue-500 hover:text-blue-600 hover:underline underline-offset-2 transition-all focus:outline-none rounded-sm disabled:opacity-50"
        >
          Esqueci minha senha
        </button>
      </div>
      <button 
        type="submit" 
        :disabled="isLoading"
        class="mt-2 w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#2563eb] hover:bg-blue-700 transition-all disabled:bg-blue-400 disabled:cursor-not-allowed"
      >
        <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {{ submitText }}
      </button>
      <div class="flex items-center my-2">
        <div class="flex-1 border-t border-gray-300"></div>
        <span class="px-3 text-gray-400 text-sm font-medium">ou</span>
        <div class="flex-1 border-t border-gray-300"></div>
      </div>
      <button 
        type="button" 
        @click="$emit('google-login')"
        :disabled="isLoading"
        class="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Continuar com Google
      </button>
      <div class="text-center text-sm font-medium text-gray-600">
        Não tem uma conta ainda? 
        <button 
          type="button" 
          @click="$emit('create-account')"
          :disabled="isLoading"
          class="text-blue-500 hover:text-blue-600 underline underline-offset-2 font-medium transition-all rounded-sm disabled:opacity-50"
        >
          Criar conta
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

export interface Props {
  submitText?: string;
  isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  submitText: 'Entrar',
  isLoading: false,
});

const emit = defineEmits<{
  (e: 'submit', payload: { email: string; password: string; rememberMe: boolean }): void;
  (e: 'google-login'): void;
  (e: 'forgot-password'): void;
  (e: 'create-account'): void;
}>();

const showPassword = ref(false);

const form = reactive({
  email: '',
  password: '',
  rememberMe: false,
});

const errors = reactive({
  email: '',
  password: '',
});

const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const handleSubmit = () => {
  errors.email = '';
  errors.password = '';
  let valid = true;

  if (!form.email) {
    errors.email = 'O e-mail é obrigatório.';
    valid = false;
  } else if (!isValidEmail(form.email)) {
    errors.email = 'Insira um e-mail válido.';
    valid = false;
  }

  if (!form.password) {
    errors.password = 'A senha é obrigatória.';
    valid = false;
  }

  if (valid) {
    emit('submit', { 
      email: form.email, 
      password: form.password, 
      rememberMe: form.rememberMe 
    });
  }
};
</script>