<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterView, useRoute } from 'vue-router'

import Sidebar from '@/components/ui/Sidebar/Sidebar.vue'
import BottomNavBar from '@/components/ui/BottomNavBar'
import AppHeader from '@/components/layout/AppHeader/AppHeader.vue'

import { navigationItems } from '@/constants/navigation'

const route = useRoute()

// Temporário: substituir pelo estado real de autenticação.
const isLoggedIn = ref(true)

const activeItem = computed(() => {
  const matchingItem = [...navigationItems]
    .sort((a, b) => b.route.length - a.route.length)
    .find(item =>
      route.path === item.route ||
      route.path.startsWith(`${item.route}/`),
    )

  return matchingItem?.id ?? ''
})
</script>

<template>
  <div class="flex min-h-screen bg-white">
    <!-- Sidebar desktop -->
    <Sidebar
      :active-item="activeItem"
      :is-logged-in="isLoggedIn"
    />

    <!-- Conteúdo -->
    <div class="flex min-w-0 flex-1 flex-col">
      <AppHeader
        :is-logged="isLoggedIn"
      />

      <main
        class="min-w-0 flex-1 p-4 pb-[calc(6rem+env(safe-area-inset-bottom))] sm:p-6 md:m-10 md:p-0 md:pb-0"
      >
        <RouterView />
      </main>
    </div>


    <BottomNavBar
      :active-item="activeItem"
      :is-logged-in="isLoggedIn"
    />
  </div>
</template>