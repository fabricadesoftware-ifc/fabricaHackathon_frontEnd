<template>
  <header class="flex w-full h-20 max-[400px]:h-15 bg-white justify-between items-center min-[401px]:px-5 max-[400px]:px-3 xl:px-10">

    <searchBar
      class="w-full max-w-xl max-[400px]:hidden"
      :debounce-ms="props.debounceMs"
      :model-value="props.modelValue"
      :placeholder="props.placeholder"
      @search="emit('search', $event)"
      @update:model-value="emit('update:modelValue', $event)"
    />

    <button
      class="min-[401px]:hidden bg-transparent"
    >
      <span class="mdi mdi-menu text-[35px]" />
    </button>

    <HeaderActions
      v-if="!props.isLogged"
      class="ml-auto"
      :notification-count="props.notificationCount"
      :user-avatar="props.userAvatar"
      :user-name="props.userName"
      @menu-option-click="emit('menu-option-click', $event)"
      @notification-click="emit('notification-click')"
    />

    <div
      v-else
      class="min-[401px]:flex-1 flex min-[401px]:items-center gap-2 min-[401px]::gap-3 min-[401px]:justify-center min-[401px]:justify-end"
    >
      <AppButton label="Entrar" variant="text" />
      <AppButton label="Criar conta" variant="primary" />
    </div>

  </header>
</template>

<script setup lang="ts">
  import AppButton from '@/components/ui/AppButton'
  import HeaderActions from '@/components/ui/HeaderActions/HeaderActions.vue'
  import searchBar from '@/components/ui/SearchBar'

  const props = defineProps<{
    isLogged: boolean

    userAvatar?: string
    userName: string
    notificationCount: number

    modelValue: string
    placeholder?: string
    debounceMs?: number
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue' | 'search', value: string): void

    (e: 'notification-click'): void
    (e: 'menu-option-click', option: 'perfil' | 'configuracoes' | 'sair'): void
  }>()

</script>
