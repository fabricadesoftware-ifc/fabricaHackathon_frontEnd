<script setup lang="ts">
import { computed, ref, watch } from 'vue'
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

// Estado transitório: acesso direto e recarregamento nunca implicam uma conclusão.
const completedEvaluationPath = ref<string | null>(null)
const isFullscreenPage = computed(() => isAuthPage.value || (
  route.name === 'avaliacao-projeto' && completedEvaluationPath.value === route.path
))

watch(() => route.path, () => {
  completedEvaluationPath.value = null
})

const authStore = useAuthStore()

const isLoggedIn = computed(() => authStore.isAuthenticated)

// Nome exibido no menu do topo (cai para o e-mail se não houver nome).
const userName = computed(() => {
  const u = authStore.user
  if (!u) return ''
  return `${u.first_name} ${u.last_name}`.trim() || u.email
})



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
    <Sidebar v-if="!isFullscreenPage" :active-item="activeItem" :is-logged-in="isLoggedIn" />

    <!-- Conteúdo -->
    <div class="flex min-w-0 flex-1 flex-col">
      <AppHeader
  v-if="!isFullscreenPage"
  :is-logged="isLoggedIn"
  :user-avatar="authStore.user?.foto_perfil ?? undefined"
  :user-name="userName"
  @menu-option-click="handleMenuOption"
/>

      <main
        class="min-w-0 flex-1"
        :class="isFullscreenPage ? '' : 'p-4 pb-[calc(6rem+env(safe-area-inset-bottom))] sm:p-6 md:mx-10 md:mb-8 md:mt-2 md:p-0 md:pb-0'"
      >
        <RouterView v-slot="{ Component }">
          <component
            :is="Component"
            v-if="route.name === 'avaliacao-projeto'"
            @evaluation-completed="completedEvaluationPath = $event"
          />
          <component :is="Component" v-else />
        </RouterView>
      </main>
    </div>


    <BottomNavBar v-if="!isFullscreenPage" :active-item="activeItem" :is-logged-in="isLoggedIn" />
  </div>
</template>
