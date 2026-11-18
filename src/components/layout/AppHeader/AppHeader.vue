<script setup lang="ts">
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import AppButton from '@/components/ui/AppButton'
  import HeaderActions from '@/components/ui/HeaderActions/HeaderActions.vue'
  import HeaderSearch from '@/components/ui/HeaderSearch/HeaderSearch.vue'
  import ThemeToggle from '@/components/ui/ThemeToggle.vue'
  import { navigationItems } from '@/constants/navigation'

  const route = useRoute()
  const router = useRouter()

  const props = withDefaults(
    defineProps<{
      isLogged: boolean
      sectionTitle?: string
      sidebarCollapsed?: boolean
      userAvatar?: string
      userName?: string
    }>(),
    {
      sidebarCollapsed: false,
      sectionTitle: 'HackIFC',
      userName: '',
    },
  )

  const emit = defineEmits<{
    (
      e: 'menu-option-click',
      option: 'perfil' | 'configuracoes' | 'sair',
    ): void
    (e: 'toggle-sidebar'): void
  }>()

  const section = computed(() => navigationItems.find(item =>
    route.path === item.route || route.path.startsWith(`${item.route}/`),
  ))

  const sectionIcon = computed(() => {
    if (section.value) return section.value.icon
    if (route.name === 'projeto-novo') return 'mdi-folder-plus-outline'
    if (route.name === 'nao-encontrada') return 'mdi-help-circle-outline'
    return 'mdi-file-document-outline'
  })

  const breadcrumbs = computed(() => route.path.split('/').filter(Boolean).map((_, index, segments) => {
    const path = `/${segments.slice(0, index + 1).join('/')}`
    const resolved = router.resolve(path)
    return resolved.name !== 'nao-encontrada' && typeof resolved.meta.title === 'string'
      ? { title: resolved.meta.title, path }
      : null
  }).filter((item): item is { title: string, path: string } => item !== null))
</script>

<template>
  <header class="group/header sticky top-0 z-40 flex h-15 w-full min-w-0 items-center gap-2 border-b border-app-border-default-neutral bg-app-surface px-3 sm:gap-3 sm:px-5 md:px-6">
    <div class="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
      <span class="shrink-0 whitespace-nowrap text-lg font-bold text-app-link md:hidden">// 24H</span>

      <button
        aria-controls="app-sidebar"
        :aria-expanded="!props.sidebarCollapsed"
        :aria-label="props.sidebarCollapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'"
        class="hidden size-9 shrink-0 items-center justify-center rounded-lg text-app-text-secondary-neutral transition-colors duration-200 hover:bg-app-surface-muted-neutral focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-focus-ring motion-reduce:transition-none md:inline-flex"
        type="button"
        @click="emit('toggle-sidebar')"
      >
        <span aria-hidden="true" class="mdi mdi-dock-left text-xl" />
      </button>

      <span aria-hidden="true" class="hidden h-5 w-px shrink-0 bg-app-border-default-neutral md:block" />

      <div class="flex min-w-0 items-center gap-2 max-[400px]:group-has-[.header-search:focus-within]/header:hidden">
        <span aria-hidden="true" class="hidden shrink-0 text-lg text-app-text-secondary-neutral min-[340px]:inline" :class="['mdi', sectionIcon]" />

        <nav aria-label="Caminho da página" class="flex min-w-0 items-center gap-1.5 text-sm">
          <template v-for="(item, index) in breadcrumbs" :key="item.path">
            <span v-if="index > 0" aria-hidden="true" class="hidden shrink-0 text-app-text-muted-neutral sm:inline">/</span>

            <span
              v-if="index === breadcrumbs.length - 1"
              aria-current="page"
              class="min-w-0 truncate font-semibold text-app-text-strong-neutral"
            >{{ item.title }}</span>

            <RouterLink
              v-else
              class="hidden shrink-0 whitespace-nowrap text-app-text-secondary-neutral transition-colors duration-200 hover:text-app-text-strong-neutral focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-focus-ring motion-reduce:transition-none sm:inline"
              :to="item.path"
            >{{ item.title }}</RouterLink>
          </template>

          <span v-if="breadcrumbs.length === 0" class="min-w-0 truncate font-semibold text-app-text-strong-neutral">{{ props.sectionTitle }}</span>
        </nav>
      </div>
    </div>

    <div class="flex shrink-0 items-center gap-1 sm:gap-2">
      <HeaderSearch />
      <ThemeToggle minimal />

      <span v-if="props.isLogged" aria-hidden="true" class="mx-0.5 h-5 w-px shrink-0 bg-app-border-default-neutral" />

      <HeaderActions
        v-if="props.isLogged"
        :user-avatar="props.userAvatar"
        :user-name="props.userName"
        @menu-option-click="emit('menu-option-click', $event)"
      />

      <div v-else class="flex items-center gap-1 sm:gap-2">
        <div class="flex items-center gap-1 sm:hidden">
          <button
            aria-label="Entrar"
            class="flex size-8 items-center justify-center rounded-lg text-app-text-secondary-neutral hover:bg-app-surface-muted-neutral focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-focus-ring"
            title="Entrar"
            type="button"
            @click="router.push('/login')"
          >
            <span aria-hidden="true" class="mdi mdi-login text-lg" />
          </button>

          <button
            aria-label="Criar conta"
            class="flex size-8 items-center justify-center rounded-lg text-app-text-secondary-neutral hover:bg-app-surface-muted-neutral focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-focus-ring"
            title="Criar conta"
            type="button"
            @click="router.push('/registro')"
          >
            <span aria-hidden="true" class="mdi mdi-account-plus-outline text-lg" />
          </button>
        </div>

        <div class="hidden items-center gap-2 sm:flex">
          <AppButton label="Entrar" variant="text" @click="router.push('/login')" />
          <AppButton label="Criar conta" variant="primary" @click="router.push('/registro')" />
        </div>
      </div>
    </div>
  </header>
</template>
