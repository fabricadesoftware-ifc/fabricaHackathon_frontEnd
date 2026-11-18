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

  const navWidthClass = computed(() => {
    if (visibleItems.value.length >= 5) return 'w-80'
    if (visibleItems.value.length === 4) return 'w-68'
    return 'w-52'
  })

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
    class="fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom))] left-1/2 z-50 flex max-w-[calc(100vw-1rem)] -translate-x-1/2 items-center gap-0.5 rounded-full border border-app-border-default-neutral bg-app-surface p-1.5 shadow-app-soft min-[360px]:gap-1 md:hidden"
    :class="navWidthClass"
  >
    <RouterLink
      v-for="item in visibleItems"
      :key="item.id"
      :aria-current="currentItem === item.id ? 'page' : undefined"
      :aria-label="item.label"
      class="flex h-10 min-w-10 basis-0 grow items-center justify-center overflow-hidden rounded-full px-1.5 text-app-text-secondary-neutral transition-[flex-grow,background-color,color] duration-300 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-focus-ring motion-reduce:transition-none min-[360px]:h-11 min-[360px]:min-w-11"
      :class="currentItem === item.id ? 'grow-[3.2] bg-app-surface-muted-neutral text-app-text-strong-neutral' : 'hover:bg-app-surface-subtle-neutral'"
      :to="item.route"
      @click="handleNavigation(item.id)"
    >
      <span aria-hidden="true" class="mdi shrink-0 text-xl leading-none" :class="item.icon" />

      <span
        aria-hidden="true"
        class="min-w-0 overflow-hidden text-[11px] font-semibold leading-none whitespace-nowrap transition-[max-width,opacity,margin] duration-300 ease-out motion-reduce:transition-none min-[360px]:text-xs"
        :class="currentItem === item.id ? 'ml-1 max-w-28 opacity-100' : 'ml-0 max-w-0 opacity-0'"
      >{{ item.label }}</span>
    </RouterLink>
  </nav>
</template>
