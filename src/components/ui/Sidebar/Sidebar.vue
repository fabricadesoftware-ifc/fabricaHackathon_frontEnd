<template>
  <aside class="h-screen w-60 border-r border-gray-200 bg-white">
    <!--criando os arquivos aqui ok renan vamos ver se tu vai ler esse código, seu bobao -->
  </aside>
</template>

<script setup lang="ts">
  export interface SidebarItem {
    id: string
    label: string
    icon: string
    route: string
    requiresAuth?: boolean
  }

  defineProps<{
    items?: SidebarItem[]
    activeItem: string
    isLoggedIn?: boolean
  }>()
</script>
