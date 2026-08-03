<template>
  <header class="flex bg-white min-w-max justify-between items-center py-6.75 pr-9 pl-[80px]">

    <searchBar
      class="flex-1 justify-start"
      :debounce-ms="props.debounceMs"
      :model-value="props.modelValue"
      :placeholder="props.placeholder"
    />

    <HeaderActions
      v-if="props.isLogged"
      class="flex-1 flex items-center gap-6 justify-end"
      :notification-count="props.notificationCount"
      :user-avatar="props.userAvatar"
      :user-name="props.userName"
    />

    <div
      v-else
      class="flex-1 flex items-center gap-6 justify-end"
    >
      <AppButton class="text-[30px]" label="Entrar" variant="text" />
      <AppButton class="text-[30px]" label="Criar conta" variant="primary" />
    </div>

  </header>
</template>

<script setup lang="ts">
  import AppButton from '@/components/ui/AppButton'
  import HeaderActions from '@/components/ui/HeaderActions'
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
</script>
