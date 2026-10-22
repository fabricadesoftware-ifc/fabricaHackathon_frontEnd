<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import Sidebar from '@/components/ui/Sidebar/Sidebar.vue'
import BottomNavBar from '@/components/ui/BottomNavBar'
import AppHeader from '@/components/layout/AppHeader/AppHeader.vue'

import { navigationItems } from '@/constants/navigation'

const route = useRoute()
const router = useRouter()

function handleMenuOption(option: 'perfil' | 'configuracoes' | 'sair') {
  switch (option) {
    case 'sair':
      authStore.signOut()
      void router.push('/login')
      break

    case 'perfil':
    case 'configuracoes':
      void router.push('/configuracoes')
      break
  }
}

const isAuthPage = computed(() =>
  ['/login', '/registro'].includes(route.path)
)

const authStore = useAuthStore()

const isLoggedIn = computed(() => authStore.isAuthenticated)



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
    <Sidebar v-if="!isAuthPage" :active-item="activeItem" :is-logged-in="isLoggedIn" />

    <!-- Conteúdo -->
    <div class="flex min-w-0 flex-1 flex-col">
      <AppHeader
  v-if="!isAuthPage"
  :is-logged="isLoggedIn"
  @menu-option-click="handleMenuOption"
/>

      <main class="min-w-0 flex-1 p-4 pb-[calc(6rem+env(safe-area-inset-bottom))] sm:p-6 md:m-10 md:p-0 md:pb-0">
        <RouterView />
      </main>
    </div>


    <BottomNavBar v-if="!isAuthPage" :active-item="activeItem" :is-logged-in="isLoggedIn" />
  </div>
</template>