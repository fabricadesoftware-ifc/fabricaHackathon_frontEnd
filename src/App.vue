<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { RouterView, useRoute, useRouter } from 'vue-router'
  import AppHeader from '@/components/layout/AppHeader/AppHeader.vue'
  import BottomNavBar from '@/components/ui/BottomNavBar'
  import Sidebar from '@/components/ui/Sidebar/Sidebar.vue'
  import { navigationLoading } from '@/composables/useNavigationLoading'
  import { navigationItems } from '@/constants/navigation'
  import { useAuthStore } from '@/stores/auth'

  const route = useRoute()
  const router = useRouter()

  function handleMenuOption (option: 'perfil' | 'configuracoes' | 'sair') {
    switch (option) {
      case 'sair': {
        authStore.signOut()
        void router.push('/login')
        break
      }

      case 'perfil':
      case 'configuracoes': {
        void router.push('/configuracoes')
        break
      }
    }
  }

  const isAuthPage = computed(() =>
    ['/login', '/registro'].includes(route.path),
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
  const sidebarCollapsed = ref(false)
  const currentSection = computed(() => typeof route.meta.title === 'string' ? route.meta.title : 'HackIFC')

  // Nome exibido no menu do topo (cai para o e-mail se não houver nome).
  const userName = computed(() => {
    const u = authStore.user
    if (!u) return ''
    return `${u.first_name} ${u.last_name}`.trim() || u.email
  })

  const activeItem = computed(() => {
    const items = [...navigationItems]
    items.sort((a, b) => b.route.length - a.route.length)
    const matchingItem = items.find(item =>
      route.path === item.route
      || route.path.startsWith(`${item.route}/`),
    )

    return matchingItem?.id ?? ''
  })
</script>

<template>
  <div class="flex min-h-screen bg-app-canvas">
    <div
      v-if="navigationLoading"
      aria-label="Carregando página"
      class="pointer-events-none fixed inset-x-0 top-0 z-100 h-0.5 overflow-hidden"
      role="progressbar"
    >
      <div class="navigation-progress-indicator h-full w-1/3 bg-app-action-indicator motion-reduce:w-full" />
    </div>

    <!-- Sidebar desktop -->
    <Sidebar v-if="!isFullscreenPage" :active-item="activeItem" :collapsed="sidebarCollapsed" :is-logged-in="isLoggedIn" />

    <!-- Conteúdo -->
    <div class="flex min-w-0 flex-1 flex-col">
      <AppHeader
        v-if="!isFullscreenPage"
        :is-logged="isLoggedIn"
        :section-title="currentSection"
        :sidebar-collapsed="sidebarCollapsed"
        :user-avatar="authStore.user?.foto_perfil ?? undefined"
        :user-name="userName"
        @menu-option-click="handleMenuOption"
        @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed"
      />

      <main
        class="min-w-0 flex-1"
        :class="isFullscreenPage ? '' : 'p-4 pb-[calc(6rem+env(safe-area-inset-bottom))] sm:p-6 sm:pb-[calc(6rem+env(safe-area-inset-bottom))] md:mx-10 md:mb-8 md:mt-2 md:p-0 md:pb-0'"
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

<style scoped>
  .navigation-progress-indicator {
    animation: navigation-progress 1.2s ease-in-out infinite;
  }

  @keyframes navigation-progress {
    from { transform: translateX(-100%); }
    to { transform: translateX(300%); }
  }

  @media (prefers-reduced-motion: reduce) {
    .navigation-progress-indicator { animation: none; }
  }
</style>
