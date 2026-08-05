<template>
  <header class="flex items-center min-w-full bg-white pr-[20px] pl-[30px] py-[10px]">

    <searchBar
      class="flex-1 justify-start"
      :debounce-ms="props.debounceMs"
      :model-value="props.modelValue"
      :placeholder="props.placeholder"
      @search="emit('search', $event)"
      @update:model-value="emit('update:modelValue', $event)"
    />

    <HeaderActions
      v-if="props.isLogged"
      class="flex-1 justify-end"
      :notification-count="props.notificationCount"
      :user-avatar="props.userAvatar"
      :user-name="props.userName"
      @menu-option-click="emit('menu-option-click', $event)"
      @notification-click="emit('notification-click')"
    />

    <div
      v-else
      class="flex flex-1 gap-3.25 justify-end"
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
