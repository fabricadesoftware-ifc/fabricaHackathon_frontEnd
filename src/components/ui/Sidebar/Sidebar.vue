<template>
  <aside class="flex h-screen w-60 flex-col border-r border-gray-200 bg-white">
    <div class="flex h-16 shrink-0 items-center px-4">
      <span class="whitespace-nowrap font-semibold text-gray-900">
        HackIFC <span class="text-blue-600">// 24H</span>
      </span>
    </div>

    <nav class="flex flex-col gap-1 px-3">
      <RouterLink
        v-for="item in items"
        :key="item.id"
        class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600"
        :to="item.route"
      >
        <span :class="['mdi text-lg', item.icon]" />
        <span class="whitespace-nowrap">{{ item.label }}</span>
      </RouterLink>
    </nav>
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

  interface Props {
    items?: SidebarItem[]
    activeItem: string
    isLoggedIn?: boolean
  }

  withDefaults(defineProps<Props>(), {
    isLoggedIn: false,
    items: () => [
      { id: 'home', label: 'Home', icon: 'mdi-home', route: '/' },
      { id: 'edicoes', label: 'Edições', icon: 'mdi-code-tags', route: '/edicoes' },
      { id: 'projetos', label: 'Meus projetos', icon: 'mdi-folder', route: '/projetos', requiresAuth: true },
      { id: 'equipes', label: 'Minhas equipes', icon: 'mdi-account-group', route: '/equipes', requiresAuth: true },
      { id: 'inscricao', label: 'Inscrição', icon: 'mdi-clipboard-text', route: '/inscricao', requiresAuth: true },
      { id: 'config', label: 'Configurações', icon: 'mdi-cog', route: '/configuracoes', requiresAuth: true },
    ],
  })
</script>
