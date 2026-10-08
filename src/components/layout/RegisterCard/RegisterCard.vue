<template>
  <div
    class="flex flex-col w-full max-w-150 mx-auto py-11 px-10 border border-gray-200 bg-white shadow rounded-xl font-sans"
  >
    <div class="flex flex-col text-center mb-4">
      <span class="whitespace-nowrap font-semibold text-gray-900 mb-4">
        HackIFC <span class="text-blue-600">// 24H</span>
      </span>
      <span class="whitespace-normal font-normal text-gray-900 text-2xl">
        Crie sua conta
      </span>
      <span class="whitespace-normal font-normal text-gray-600">
        Crie sua conta e gerencie seus projetos e participe de hackathons
      </span>
    </div>
    <form @submit.prevent="handleSubmit" class="flex flex-col gap-4 mt-2">
      <div class="flex flex-row gap-2 p-0 m-0 justify-between">
        <div class="text-start max-w-60">
          <label
            for="name"
            class="mb-1 text-xs sm:text-sm tracking-wide text-gray-600 pl-2"
          >
            Nome
          </label>
          <input
            id="name"
            v-model="form.name"
            type="name"
            placeholder="Insira seu nome"
            :disabled="isLoading"
            class="text-sm sm:text-base w-full border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-1 py-2 px-3 transition-colors disabled:bg-gray-100 disabled:text-gray-500"
            :class="
              errors.name
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 hover:border-gray-400'
            "
          />
          <span
            v-if="errors.name"
            class="text-xs text-red-500 pl-2 mt-1 block"
            >{{ errors.name }}</span
          >
        </div>

        <div class="text-start max-w-60">
          <label
            for="surname"
            class="mb-1 text-xs sm:text-sm tracking-wide text-gray-600 pl-2"
          >
            Sobrenome
          </label>
          <input
            id="surname"
            v-model="form.surname"
            type="name"
            placeholder="Insira seu sobrenome"
            :disabled="isLoading"
            class="text-sm sm:text-base relative w-full border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-1 py-2 px-3 transition-colors disabled:bg-gray-100 disabled:text-gray-500"
            :class="
              errors.name
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 hover:border-gray-400'
            "
          />
          <span
            v-if="errors.name"
            class="text-xs text-red-500 pl-2 mt-1 block"
            >{{ errors.name }}</span
          >
        </div>
      </div>

      <div class="text-start">
        <label
          for="email"
          class="mb-1 text-xs sm:text-sm tracking-wide text-gray-600 pl-2"
        >
          Email
        </label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          placeholder="Insira seu email"
          :disabled="isLoading"
          class="text-sm sm:text-base relative w-full border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-1 py-2 px-3 transition-colors disabled:bg-gray-100 disabled:text-gray-500"
          :class="
            errors.email
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 hover:border-gray-400'
          "
        />
        <span
          v-if="errors.email"
          class="text-xs text-red-500 pl-2 mt-1 block"
          >{{ errors.email }}</span
        >
      </div>
      <div class="text-start">
        <label
          for="senha"
          class="mb-1 text-xs sm:text-sm tracking-wide text-gray-600 pl-2"
        >
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
            :class="
              errors.password
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 hover:border-gray-400'
            "
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            :disabled="isLoading"
            class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-blue-500 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Alternar visibilidade da senha"
          >
            <svg
              v-if="!showPassword"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>
        <span
          v-if="errors.password"
          class="text-xs text-red-500 pl-2 mt-1 block"
          >{{ errors.password }}</span
        >
      </div>
      <div class="text-start">
        <label
          for="passwordConfirm"
          class="mb-1 text-xs sm:text-sm tracking-wide text-gray-600 pl-2"
        >
          Confirme sua senha
        </label>
        <div class="relative w-full">
          <input
            id="passwordConfirm"
            v-model="form.passwordConfirm"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Confirme sua senha"
            :disabled="isLoading"
            class="text-sm sm:text-base relative w-full border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-1 py-2 pl-3 pr-10 transition-colors disabled:bg-gray-100 disabled:text-gray-500"
            :class="
              errors.passwordConfirm
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 hover:border-gray-400'
            "
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            :disabled="isLoading"
            class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-blue-500 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Alternar visibilidade da senha"
          >
            <svg
              v-if="!showPassword"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>
        <span
          v-if="errors.passwordConfirm"
          class="text-xs text-red-500 pl-2 mt-1 block"
          >{{ errors.passwordConfirm }}</span
        >
      </div>

      <div class="flex flex-col mt-1">
        <label class="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            v-model="form.acceptTerms"
            :disabled="isLoading"
            class="w-4 h-4 text-blue-600 border rounded-lg cursor-pointer disabled:opacity-50 transition-colors"
            :class="
              errors.acceptTerms
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 hover:border-gray-400'
            "
          />
          <span
            class="text-sm text-gray-700 group-hover:text-gray-900 transition-colors"
            >Concordo com os
            <button
              class="text-blue-500 hover:text-blue-600 underline underline-offset-2 font-medium transition-all rounded-sm disabled:opacity-50"
              @click="$emit('open-terms')"
            >
              termos & condições
            </button></span
          >
        </label>
        <span v-if="errors.acceptTerms" class="text-xs text-red-500 pl-2 mt-1 block">{{ errors.acceptTerms }}</span>
      </div>


      <button
        type="submit"
        :disabled="isLoading"
        class="mt-2 w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#2563eb] hover:bg-blue-700 transition-all disabled:bg-blue-400 disabled:cursor-not-allowed"
      >
        <svg
          v-if="isLoading"
          class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        {{ submitText }}
      </button>

      <div class="text-center text-sm font-medium text-gray-600">
        Já tem uma conta?
        <button
          type="button"
          @click="$emit('login-redirect')"
          :disabled="isLoading"
          class="text-blue-500 hover:text-blue-600 underline underline-offset-2 font-medium transition-all rounded-sm disabled:opacity-50"
        >
          Entrar
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { error } from "console";
import { ref, reactive } from "vue";

export interface Props {
  submitText?: string;
  isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  submitText: "Entrar",
  isLoading: false,
});

const emit = defineEmits<{
  (
    e: "submit",
    payload: {
      name: string;
      surname: string;
      email: string;
      password: string;
      passwordConfirm: string;
      acceptTerms: boolean;
    },
  ): void;
  (e: "login-redirect"): void;
  (e: "open-terms"): void;
}>();

const showPassword = ref(false);

const form = reactive({
  name: "",
  surname: "",
  email: "",
  password: "",
  passwordConfirm: "",
  acceptTerms: false,
});

const errors = reactive({
  name: "",
  surname: "",
  email: "",
  password: "",
  passwordConfirm: "",
  acceptTerms: "",
});

const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const handleSubmit = () => {
  errors.name = "";
  errors.surname = "";
  errors.email = "";
  errors.password = "";
  errors.passwordConfirm = "";
  errors.acceptTerms = "";

  let valid = true;

  if (!form.email) {
    errors.email = "O e-mail é obrigatório.";
    valid = false;
  } else if (!isValidEmail(form.email)) {
    errors.email = "Insira um e-mail válido.";
    valid = false;
  }

  if (!form.password) {
    errors.password = "A senha é obrigatória.";
    valid = false;
  }

  if (form.password != form.passwordConfirm || !form.passwordConfirm) {
    if (!form.passwordConfirm) {
      errors.passwordConfirm = "A confirmação de senha é obrigatoria.";
      valid = false;
    }
    if (form.password != form.passwordConfirm) {
      errors.passwordConfirm = errors.password = "As senhas não coincidem.";
      valid = false;
    }
  }

  if (!form.name) {
    errors.name = "O nome é obrigatório.";
    valid = false;
  }

  if (!form.surname) {
    errors.surname = "O sobrenome é obrigatório.";
    valid = false;
  }

  if (!form.acceptTerms) {
    errors.acceptTerms = "Aceite os termos para continuar.";
    valid = false;
  }

  if (valid) {
    emit("submit", {
      name: form.name,
      surname: form.surname,
      email: form.email,
      password: form.password,
      acceptTerms: form.acceptTerms,
    });
  }
};
</script>
