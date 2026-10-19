<script setup lang="ts">
import AppButton from '@/components/ui/AppButton'
import HeaderActions from '@/components/ui/HeaderActions/HeaderActions.vue'
import SearchBar from '@/components/ui/SearchBar'

const props = withDefaults(
  defineProps<{
    isLogged: boolean
    userAvatar?: string
    userName?: string
    notificationCount?: number
    modelValue?: string
    placeholder?: string
    debounceMs?: number
  }>(),
  {
    userName: '',
    notificationCount: 0,
    modelValue: '',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue' | 'search', value: string): void
  (e: 'notification-click'): void
  (
    e: 'menu-option-click',
    option: 'perfil' | 'configuracoes' | 'sair',
  ): void
}>()
</script>

<template>
  <header
    class="flex h-16 w-full items-center justify-between bg-white px-4 sm:px-5 md:h-20 xl:px-10"
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
      :notification-count="props.notificationCount"
      :user-avatar="props.userAvatar"
      :user-name="props.userName"
      @menu-option-click="emit('menu-option-click', $event)"
      @notification-click="emit('notification-click')"
    />

    <!-- Usuário deslogado -->
    <div
      v-else
      class="ml-auto flex items-center gap-2"
    >
      <AppButton
        label="Entrar"
        variant="text"
      />

      <AppButton
        label="Criar conta"
        variant="primary"
      />
    </div>
  </header>
</template>