<template>
  <aside
    :class="[
      'max-[400px]:hidden relative flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300',
      rail ? 'w-[72px]' : 'w-60',
    ]"
  >
    <div class="flex h-16 shrink-0 items-center overflow-hidden px-4">
      <span v-if="!rail" class="whitespace-nowrap font-semibold text-gray-900">
        HackIFC <span class="text-blue-600">// 24H</span>
      </span>

      <span v-else class="whitespace-nowrap text-sm font-semibold text-blue-600">
        // 24H
      </span>
    </div>

    <button
      :aria-label="rail ? 'Expandir menu' : 'Recolher menu'"
      class="absolute -right-3 top-5 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm hover:bg-gray-100"
      type="button"
      @click="rail = !rail"
    >
      <span :class="['mdi text-base', rail ? 'mdi-chevron-right' : 'mdi-chevron-left']" />
    </button>

    <nav class="mt-2 flex flex-col gap-1 px-3">
      <RouterLink
        v-for="item in publicItems"
        :key="item.id"
        :class="itemClasses(item.id)"
        :to="item.route"
        @click="emit('update:activeItem', item.id)"
      >
        <span :class="['mdi text-lg', item.icon]" />
        <span v-if="!rail" class="whitespace-nowrap">{{ item.label }}</span>
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
        <span v-if="!rail" class="whitespace-nowrap">{{ item.label }}</span>
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'

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
      { id: 'home', label: 'Home', icon: 'mdi-home', route: '/home' },
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

  const rail = ref(false)

  const publicItems = computed(() => props.items.filter(item => !item.requiresAuth))
  const privateItems = computed(() =>
    props.items.filter(item => item.requiresAuth && props.isLoggedIn),
  )

  function itemClasses (id: string) {
    return [
      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
      rail.value && 'justify-center px-0',
      props.activeItem === id
        ? 'bg-blue-600 text-white'
        : 'text-gray-600 hover:bg-gray-100',
    ]
  }
</script>
