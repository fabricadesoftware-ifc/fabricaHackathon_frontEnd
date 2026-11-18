<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useDisplay } from 'vuetify'
  import {
    VAvatar,
    VIcon,
    VList,
    VListItem,
    VMenu,
  } from 'vuetify/components'

  const { smAndDown, mdAndDown } = useDisplay()

  const size = computed(() => {
    if (smAndDown.value) return 30
    return 34
  })

  const menuClass = computed(() => {
    if (smAndDown.value) return 'menu-sm'
    if (mdAndDown.value) return 'menu-md'
    return 'menu-lg'
  })

  interface Props {
    userAvatar?: string
    userName: string
  }

  const props = defineProps<Props>()

  type MenuOption = 'perfil' | 'configuracoes' | 'sair'

  const emit = defineEmits<{
    (e: 'menu-option-click', option: MenuOption): void
  }>()

  const menuOpen = ref(false)

  function handleOptionClick (option: MenuOption) {
    emit('menu-option-click', option)
    menuOpen.value = false
  }

</script>

<template>
  <div class="flex items-center justify-end">

    <v-menu v-model="menuOpen" location="bottom end">

      <template #activator="{ props: menuProps }">

        <button
          v-bind="menuProps"
          :aria-label="`Abrir menu de perfil de ${props.userName}`"
          class="inline-flex h-10 items-center gap-1 rounded-lg px-1 text-app-text-secondary-neutral transition-colors duration-200 hover:bg-app-surface-muted-neutral focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-focus-ring motion-reduce:transition-none"
          type="button"
        >
          <v-avatar color="app-avatar" :size="size">
            <img v-if="props.userAvatar" alt="" class="h-full w-full object-cover object-center" :src="props.userAvatar">
            <v-icon v-else color="app-on-brand" icon="mdi-account" />
          </v-avatar>

          <span aria-hidden="true" class="mdi mdi-chevron-down text-base" />
        </button>

      </template>

      <v-list class="simple-menu" :class="menuClass" density="compact">

        <v-list-item class="font-semibold opacity-70" disabled :title="props.userName" />

        <v-list-item title="Perfil" @click="handleOptionClick('perfil')" />

        <v-list-item title="Configurações" @click="handleOptionClick('configuracoes')" />

        <v-list-item title="Sair" @click="handleOptionClick('sair')" />

      </v-list>

    </v-menu>

  </div>
</template>

<style scoped>
/* Menu */
.simple-menu {
  background-color: var(--app-surface-plain) !important;
  border-radius: 8px !important;
  padding: 2px !important;
  min-width: 150px !important;
}

.simple-menu :deep(.v-list-item) {
  min-height: 32px !important;
  padding: 4px 10px !important;
  border-radius: 6px !important;
  color: var(--app-menu-copy) !important;
}

.simple-menu :deep(.v-list-item-title) {
  color: var(--app-menu-copy) !important;
  font-size: 14px !important;
}

.simple-menu :deep(.v-list-item:hover) {
  background-color: var(--app-menu-hover) !important;
}

.simple-menu :deep(.v-list-item--disabled) {
  opacity: 0.5 !important;
  min-height: 28px !important;
}

.menu-sm {
  min-width: 130px !important;
}

.menu-md {
  min-width: 150px !important;
}

.menu-lg {
  min-width: 160px !important;
}

</style>
