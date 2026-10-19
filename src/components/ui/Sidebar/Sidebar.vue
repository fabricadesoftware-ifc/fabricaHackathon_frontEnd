<script setup lang="ts">
import { computed, ref } from 'vue'

import {
  navigationItems,
  type NavItem,
} from '@/constants/navigation'

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

const publicItems = computed(() =>
  props.items.filter(item => !item.requiresAuth),
)

const privateItems = computed(() =>
  props.items.filter(
    item => item.requiresAuth && props.isLoggedIn,
  ),
)

function itemClasses(id: string) {
  return [
    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
    rail.value && 'justify-center px-0',
    props.activeItem === id
      ? 'bg-blue-600 text-white'
      : 'text-gray-600 hover:bg-gray-100',
  ]
}
</script>

<template>
  <aside
    :class="[
      'relative hidden h-screen shrink-0 flex-col border-r border-gray-200 bg-white transition-all duration-300 md:flex',
      rail ? 'w-18' : 'w-60',
    ]"
  >
    <!-- Logo -->
    <div class="flex h-16 shrink-0 items-center overflow-hidden px-4">
      <span
        v-if="!rail"
        class="whitespace-nowrap font-semibold text-gray-900"
      >
        HackIFC <span class="text-blue-600">// 24H</span>
      </span>

      <span
        v-else
        class="whitespace-nowrap text-sm font-semibold text-blue-600"
      >
        // 24H
      </span>
    </div>

    <!-- Botão para recolher/expandir -->
    <button
      :aria-label="rail ? 'Expandir menu' : 'Recolher menu'"
      class="absolute -right-3 top-5 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm hover:bg-gray-100"
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
      class="mx-3 my-3 border-t border-gray-200"
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