<template>
  <aside class="flex h-screen w-60 flex-col border-r border-gray-200 bg-white">
    <div class="flex h-16 shrink-0 items-center px-4">
      <span class="whitespace-nowrap font-semibold text-gray-900">
        HackIFC <span class="text-blue-600">// 24H</span>
      </span>
    </div>

    <nav class="mt-2 flex flex-col gap-1 px-3">
      <RouterLink
        v-for="item in publicItems"
        :key="item.id"
        :class="itemClasses(item.id)"
        :to="item.route"
        @click="emit('update:activeItem', item.id)"
      >
        <span :class="['mdi text-lg', item.icon]" />
        <span class="whitespace-nowrap">{{ item.label }}</span>
      </RouterLink>
    </nav>

    <div class="mx-3 my-3 border-t border-gray-200" />

    <nav v-if="privateItems.length > 0" class="flex flex-col gap-1 px-3">
      <RouterLink
        v-for="item in privateItems"
        :key="item.id"
        :class="itemClasses(item.id)"
        :to="item.route"
        @click="emit('update:activeItem', item.id)"
      >
        <span :class="['mdi text-lg', item.icon]" />
        <span class="whitespace-nowrap">{{ item.label }}</span>
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

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

  const props = withDefaults(defineProps<Props>(), {
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

  const emit = defineEmits<{
    'update:activeItem': [id: string]
  }>()

  const publicItems = computed(() => props.items.filter(item => !item.requiresAuth))
  const privateItems = computed(() =>
    props.items.filter(item => item.requiresAuth && props.isLoggedIn),
  )

  function itemClasses (id: string) {
    return [
      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
      props.activeItem === id
        ? 'bg-blue-600 text-white'
        : 'text-gray-600 hover:bg-gray-100',
    ]
  }
</script>
