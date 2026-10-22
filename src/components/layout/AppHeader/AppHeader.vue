<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppButton from '@/components/ui/AppButton'
import HeaderSearch from '@/components/ui/HeaderSearch/HeaderSearch.vue'
import HeaderActions from '@/components/ui/HeaderActions/HeaderActions.vue'

const router = useRouter()

const props = withDefaults(
  defineProps<{
    isLogged: boolean
    userAvatar?: string
    userName?: string
  }>(),
  {
    userName: '',
  },
)

const emit = defineEmits<{
  (
    e: 'menu-option-click',
    option: 'perfil' | 'configuracoes' | 'sair',
  ): void
}>()
</script>

<template>
  <header
    class="flex h-16 w-full items-center justify-between bg-white px-4 sm:px-5 md:h-16 md:px-2 xl:px-10"
  >
    <!-- Logo mobile -->
    <span
      class="whitespace-nowrap text-lg font-bold text-blue-600 md:hidden"
    >
      // 24H
    </span>

    <!-- Lupa: abre o campo ao passar o mouse ou focar -->
    <HeaderSearch class="ml-auto mr-3" />

    <!-- Usuário logado -->
    <HeaderActions
      v-if="props.isLogged"
      :user-avatar="props.userAvatar"
      :user-name="props.userName"
      @menu-option-click="emit('menu-option-click', $event)"
    />

    <!-- Usuário deslogado -->
    <div
      v-else
      class="flex items-center gap-2"
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