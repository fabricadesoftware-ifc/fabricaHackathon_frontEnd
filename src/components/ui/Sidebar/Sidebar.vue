<script setup lang="ts">
  import { computed } from 'vue'
  import {
    navigationItems,
    type NavItem,
  } from '@/constants/navigation'
  import { useAuthStore } from '@/stores/auth'

  export type SidebarItem = NavItem

  const props = withDefaults(
    defineProps<{
      items?: NavItem[]
      activeItem: string
      collapsed?: boolean
      isLoggedIn?: boolean
    }>(),
    {
      isLoggedIn: true,
      collapsed: false,
      items: () => navigationItems,
    },
  )

  const emit = defineEmits<{
    'update:activeItem': [id: string]
  }>()

  const authStore = useAuthStore()
  const visibleItems = computed(() => props.items.filter(item => {
    if (item.requiresAuth && !props.isLoggedIn) return false
    return !item.roles?.length || (authStore.userRole !== null && item.roles.includes(authStore.userRole))
  }))
  const publicItems = computed(() => visibleItems.value.filter(item => !item.requiresAuth))
  const privateItems = computed(() => visibleItems.value.filter(item => item.requiresAuth && item.id !== 'config'))
  const settingsItem = computed(() => visibleItems.value.find(item => item.id === 'config'))

  function itemClasses (id: string) {
    return [
      'flex h-10 min-w-0 items-center gap-3 rounded-xl px-3 text-sm transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-focus-ring motion-reduce:transition-none',
      props.collapsed && 'justify-center px-0',
      props.activeItem === id
        ? 'bg-app-surface-muted-neutral font-semibold text-app-text-strong-neutral'
        : 'font-medium text-app-text-secondary-neutral hover:bg-app-surface-subtle-neutral hover:text-app-text-strong-neutral',
    ]
  }
</script>

<template>
  <aside
    id="app-sidebar"
    :class="[
      'sticky top-0 hidden h-screen shrink-0 self-start flex-col border-r border-app-border-default-neutral bg-app-surface transition-[width] duration-200 motion-reduce:transition-none md:flex',
      collapsed ? 'w-17' : 'w-62',
    ]"
  >
    <div class="flex h-15 shrink-0 items-center overflow-hidden px-4">
      <span v-if="!collapsed" class="whitespace-nowrap font-semibold text-app-text-strong-neutral">
        HackIFC <span class="text-app-link">// 24H</span>
      </span>

      <span v-else aria-label="HackIFC // 24H" class="mdi mdi-code-tags mx-auto text-xl text-app-text-strong-neutral" role="img" />
    </div>

    <div class="min-h-0 flex-1 overflow-y-auto px-2.5 pt-4">
      <nav aria-label="Navegação principal" class="flex flex-col gap-1">
        <RouterLink
          v-for="item in publicItems"
          :key="item.id"
          :aria-current="activeItem === item.id ? 'page' : undefined"
          :aria-label="collapsed ? item.label : undefined"
          :class="itemClasses(item.id)"
          :title="collapsed ? item.label : undefined"
          :to="item.route"
          @click="emit('update:activeItem', item.id)"
        >
          <span aria-hidden="true" :class="['mdi shrink-0 text-lg', item.icon]" />
          <span v-if="!collapsed" class="truncate">{{ item.label }}</span>
        </RouterLink>
      </nav>

      <div v-if="privateItems.length > 0" class="mt-7">
        <p v-if="!collapsed" class="mb-3 px-3 text-[10px] font-semibold tracking-[0.16em] text-app-text-muted-neutral uppercase">
          Área de trabalho
        </p>

        <div v-else aria-hidden="true" class="mx-3 mb-3 border-t border-app-border-default-neutral" />

        <nav aria-label="Área de trabalho" class="flex flex-col gap-1">
          <RouterLink
            v-for="item in privateItems"
            :key="item.id"
            :aria-current="activeItem === item.id ? 'page' : undefined"
            :aria-label="collapsed ? item.label : undefined"
            :class="itemClasses(item.id)"
            :title="collapsed ? item.label : undefined"
            :to="item.route"
            @click="emit('update:activeItem', item.id)"
          >
            <span aria-hidden="true" :class="['mdi shrink-0 text-lg', item.icon]" />
            <span v-if="!collapsed" class="truncate">{{ item.label }}</span>
          </RouterLink>
        </nav>
      </div>
    </div>

    <nav v-if="settingsItem" aria-label="Preferências" class="shrink-0 border-t border-app-border-default-neutral px-2.5 py-3">
      <RouterLink
        :aria-current="activeItem === settingsItem.id ? 'page' : undefined"
        :aria-label="collapsed ? settingsItem.label : undefined"
        :class="itemClasses(settingsItem.id)"
        :title="collapsed ? settingsItem.label : undefined"
        :to="settingsItem.route"
        @click="emit('update:activeItem', settingsItem.id)"
      >
        <span aria-hidden="true" :class="['mdi shrink-0 text-lg', settingsItem.icon]" />
        <span v-if="!collapsed" class="truncate">{{ settingsItem.label }}</span>
      </RouterLink>
    </nav>
  </aside>
</template>
