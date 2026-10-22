<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppButton from '@/components/ui/AppButton'
import HeaderActions from '@/components/ui/HeaderActions/HeaderActions.vue'
import SearchBar from '@/components/ui/SearchBar'

const router = useRouter()

const props = withDefaults(
  defineProps<{
    isLogged: boolean
    userAvatar?: string
    userName?: string
    modelValue?: string
    placeholder?: string
    debounceMs?: number
  }>(),
  {
    userName: '',
    modelValue: '',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue' | 'search', value: string): void
  (
    e: 'menu-option-click',
    option: 'perfil' | 'configuracoes' | 'sair',
  ): void
}>()
</script>

<template>
  <header
    class="flex h-16 w-full items-center justify-between bg-white px-4 sm:px-5 md:h-20 md:px-2 xl:px-10"
  >
    <!-- Logo mobile -->
    <span
      class="whitespace-nowrap text-lg font-bold text-blue-600 md:hidden"
    >
      // 24H
    </span>

    <!-- Pesquisa desktop -->
    <SearchBar
      class="hidden w-full max-w-xl md:flex"
      :debounce-ms="props.debounceMs"
      :model-value="props.modelValue"
      :placeholder="props.placeholder"
      @search="emit('search', $event)"
      @update:model-value="emit('update:modelValue', $event)"
    />

    <!-- Usuário logado -->
    <HeaderActions
      v-if="props.isLogged"
      class="ml-auto"
      :user-avatar="props.userAvatar"
      :user-name="props.userName"
      @menu-option-click="emit('menu-option-click', $event)"
    />

    <!-- Usuário deslogado -->
    <div
      v-else
      class="ml-auto flex items-center gap-2"
    >
      <AppButton
        label="Entrar"
        variant="text"
        @click="router.push('/login')"
      />

      <AppButton
        label="Criar conta"
        variant="primary"
        @click="router.push('/registro')"
      />
    </div>
  </header>
</template>