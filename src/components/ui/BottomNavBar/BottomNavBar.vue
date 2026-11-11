<script setup lang="ts">
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import {
    navigationItems,
    type NavItem,
  } from '@/constants/navigation'
  import { useAuthStore } from '@/stores/auth'

  const props = withDefaults(
    defineProps<{
      activeItem?: string
      isLoggedIn?: boolean
      items?: NavItem[]
    }>(),
    {
      isLoggedIn: false,
      items: () => navigationItems,
    },
  )

  const emit = defineEmits<{
    'update:activeItem': [id: string]
  }>()

  const route = useRoute()
  const authStore = useAuthStore()
  const visibleItems = computed(() =>
    props.items.filter(item => {
      // Verifica se o item deve aparecer no mobile.
      if (item.showOnMobile === false) {
        return false
      }

      // Verifica se o usuário está autenticado.
      if (item.requiresAuth && !props.isLoggedIn) {
        return false
      }

      // Verifica as permissões do perfil.
      if (item.roles?.length) {
        return (
          authStore.userRole !== null
          && item.roles.includes(authStore.userRole)
        )
      }

      return true
    }),
  )

  const currentItem = computed(() => {
    if (props.activeItem !== undefined) {
      return props.activeItem
    }

    const active = visibleItems.value.reduce<NavItem | undefined>((matching, item) => {
      const matches = route.path === item.route || route.path.startsWith(`${item.route}/`)
      return matches && (!matching || item.route.length > matching.route.length) ? item : matching
    }, undefined)

    return active?.id ?? ''
  })

  function handleNavigation (id: string) {
    emit('update:activeItem', id)
  }
</script>

<template>
  <nav
    aria-label="Navegação principal"
    class="pb-[env(safe-area-inset-bottom)] fixed inset-x-0 bottom-0 z-50 border-t border-app-border-default-neutral bg-app-surface md:hidden"
  >
    <div class="flex h-17 w-full items-center justify-around gap-1 px-2">
      <RouterLink
        v-for="item in visibleItems"
        :key="item.id"
        :aria-current="currentItem === item.id ? 'page' : undefined"
        :aria-label="item.label"
        class="flex min-w-0 flex-1 flex-col items-center justify-center rounded-xl px-1 py-2 transition-colors"
        :class="
          currentItem === item.id
            ? 'bg-app-selection-soft text-app-link'
            : 'text-app-text-muted-neutral hover:bg-app-surface-subtle-neutral'
        "
        :to="item.route"
        @click="handleNavigation(item.id)"
      >
        <span
          class="mdi text-[22px] leading-6"
          :class="item.icon"
        />

        <span
          v-if="currentItem === item.id"
          class="mt-1 max-w-full truncate text-[10px] font-semibold leading-3"
        >
          {{ item.label }}
        </span>
      </RouterLink>
    </div>
  </nav>
</template>
