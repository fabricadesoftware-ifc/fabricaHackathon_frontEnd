<script setup lang="ts">
  import { computed, ref } from 'vue'
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
      isLoggedIn?: boolean
    }>(),
    {
      isLoggedIn: true,
      items: () => navigationItems,
    },
  )

  const emit = defineEmits<{
    'update:activeItem': [id: string]
  }>()

  const rail = ref(false)
  const authStore = useAuthStore()

  const publicItems = computed(() =>
    props.items.filter(item => !item.requiresAuth),
  )

  const privateItems = computed(() =>
    props.items.filter(item => {
      if (!item.requiresAuth || !props.isLoggedIn) {
        return false
      }

      if (item.roles?.length) {
        return (
          authStore.userRole !== null
          && item.roles.includes(authStore.userRole)
        )
      }

      return true
    }),
  )

  function itemClasses (id: string) {
    return [
      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
      rail.value && 'justify-center px-0',
      props.activeItem === id
        ? 'bg-app-action text-app-on-brand'
        : 'text-app-text-secondary-neutral hover:bg-app-surface-muted-neutral',
    ]
  }
</script>

<template>
  <aside
    :class="[
      'sticky top-0 hidden h-screen shrink-0 self-start flex-col border-r border-app-border-default-neutral bg-app-surface transition-all duration-300 md:flex',
      rail ? 'w-18' : 'w-60',
    ]"
  >
    <!-- Logo -->
    <div class="flex h-16 shrink-0 items-center overflow-hidden px-4">
      <span
        v-if="!rail"
        class="whitespace-nowrap font-semibold text-app-text-strong-neutral"
      >
        HackIFC <span class="text-app-link">// 24H</span>
      </span>

      <span
        v-else
        class="whitespace-nowrap text-sm font-semibold text-app-link"
      >
        // 24H
      </span>
    </div>

    <!-- Botão para recolher/expandir -->
    <button
      :aria-label="rail ? 'Expandir menu' : 'Recolher menu'"
      class="absolute -right-3 top-5 flex h-6 w-6 items-center justify-center rounded-full border border-app-border-default-neutral bg-app-surface text-app-text-muted-neutral shadow-sm hover:bg-app-surface-muted-neutral"
      type="button"
      @click="rail = !rail"
    >
      <span
        :class="[
          'mdi text-base',
          rail ? 'mdi-chevron-right' : 'mdi-chevron-left',
        ]"
      />
    </button>

    <!-- Navegação pública -->
    <nav class="mt-2 flex flex-col gap-1 px-3">
      <RouterLink
        v-for="item in publicItems"
        :key="item.id"
        :class="itemClasses(item.id)"
        :to="item.route"
        @click="emit('update:activeItem', item.id)"
      >
        <span :class="['mdi text-lg', item.icon]" />

        <span
          v-if="!rail"
          class="whitespace-nowrap"
        >
          {{ item.label }}
        </span>
      </RouterLink>
    </nav>

    <!-- Separador -->
    <div
      v-if="privateItems.length > 0"
      class="mx-3 my-3 border-t border-app-border-default-neutral"
    />

    <!-- Navegação privada -->
    <nav
      v-if="privateItems.length > 0"
      class="flex flex-col gap-1 px-3"
    >
      <RouterLink
        v-for="item in privateItems"
        :key="item.id"
        :class="itemClasses(item.id)"
        :to="item.route"
        @click="emit('update:activeItem', item.id)"
      >
        <span :class="['mdi text-lg', item.icon]" />

        <span
          v-if="!rail"
          class="whitespace-nowrap"
        >
          {{ item.label }}
        </span>
      </RouterLink>
    </nav>
  </aside>
</template>
