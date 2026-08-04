<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useDisplay } from 'vuetify'
  import {
    VAvatar,
    VBadge,
    VIcon,
    VList,
    VListItem,
    VMenu,
  } from 'vuetify/components'

  const { smAndDown, mdAndDown } = useDisplay()

  const size = computed(() => {
    if (smAndDown.value) return 50
    if (mdAndDown.value) return 60
    return 70
  })
  const badgeClass = computed(() => {
    if (smAndDown.value) return 'badge-sm'
    if (mdAndDown.value) return 'badge-md'
    return 'badge-lg'
  })
  const menuClass = computed(() => {
    if (smAndDown.value) return 'menu-sm'
    if (mdAndDown.value) return 'menu-md'
    return 'menu-lg'
  })

  interface Props {
    userAvatar?: string
    userName: string
    notificationCount: number
  }

  const props = defineProps<Props>()

  type MenuOption = 'perfil' | 'configuracoes' | 'sair'

  const emit = defineEmits<{
    (e: 'notification-click'): void
    (e: 'menu-option-click', option: MenuOption): void
  }>()

  const menuOpen = ref(false)

  function handleNotificationClick () {
    emit('notification-click')
  }

  function handleOptionClick (option: MenuOption) {
    emit('menu-option-click', option)
    menuOpen.value = false
  }

</script>

<template>
  <div class="flex items-center gap-8 justify-end">
    <button
      aria-label="Notificações"
      class="relative bg-transparent border-none cursor-pointer notification-btn"
      @click="handleNotificationClick"
    >
      <v-icon
        color="black"
        icon="mdi-bell-outline"
        :size="size"
      />

      <v-badge
        v-if="props.notificationCount > 0"
        :class="['simple-badge absolute -top-1 -right-1', badgeClass]"
        color="red"
        :content="props.notificationCount"
        overlap
      />
    </button>

    <!-- Avatar + Menu -->
    <v-menu v-model="menuOpen" location="bottom end">
      <template #activator="{ props: menuProps }">
        <v-avatar
          v-bind="menuProps"
          class="cursor-pointer"
          :image="props.userAvatar || undefined"
          :size="size"
        >
          <v-icon v-if="!props.userAvatar" icon="mdi-account" />
        </v-avatar>
      </template>

      <v-list
        class="simple-menu"
        :class="menuClass"
        density="compact"
      >
        <v-list-item
          class="font-semibold text-sm opacity-70 "
          disabled
          :title="props.userName"
        />
        <v-list-item title="Perfil" @click="handleOptionClick('perfil')" />
        <v-list-item title="Configurações" @click="handleOptionClick('configuracoes')" />
        <v-list-item title="Sair" @click="handleOptionClick('sair')" />
      </v-list>
    </v-menu>

  </div>
</template>

<style scoped>
.notification-btn:hover {
  opacity: 0.7;
}

.simple-menu {
  background-color: #ffffff !important;
  border-radius: 8px !important;
  padding: 0 !important;
  min-width: 180px !important;
}

.simple-menu :deep(.v-list) {
  padding: px !important;
}

.simple-menu :deep(.v-list-item) {
  min-height: 31px !important;
  padding: 10px 20px !important;
  margin: 0 !important;
  border-radius: 6px !important;
  color: #212121 !important;
}

.simple-menu :deep(.v-list-item__overlay) {
  background-color: #f0f0f0 !important;
  opacity: 0 !important;
  font-size: 30px;
}
.simple-menu :deep(.v-list-item-title) {
  color: #212121 !important;
  font-size: 30px;
}

.simple-menu :deep(.v-list-item:hover) {
  background-color: #f0f0f0 !important;
}

.simple-menu :deep(.v-list-item--disabled) {
  opacity: 0.5 !important;
  padding-top: 4px !important;
  min-height: 28px !important;
}

.menu-sm {
  min-width: 150px !important;
}

.menu-sm :deep(.v-list-item) {
  min-height: 40px !important;
  padding: 8px 14px !important;
}

.menu-sm :deep(.v-list-item-title) {
  font-size: 18px !important;
}

.menu-sm :deep(.v-list-item--disabled) {
  min-height: 36px !important;
}
.menu-md {
  min-width: 180px !important;
}

.menu-md :deep(.v-list-item) {
  min-height: 46px !important;
  padding: 10px 18px !important;
}

.menu-md :deep(.v-list-item-title) {
  font-size: 24px !important;
}

.menu-md :deep(.v-list-item--disabled) {
  min-height: 40px !important;
}
.menu-lg {
  min-width: 220px !important;
}

.menu-lg :deep(.v-list-item) {
  min-height: 54px !important;
  padding: 12px 20px !important;
}

.menu-lg :deep(.v-list-item-title) {
  font-size: 30px !important;
}

.menu-lg :deep(.v-list-item--disabled) {
  min-height: 46px !important;
}

.badge-sm :deep(.v-badge__badge) {
  width: 28px;
  height: 28px;
  font-size: 18px;
  border-radius: 100%;
}

.badge-md :deep(.v-badge__badge) {
  width: 28px;
  height: 28px;
  font-size: 17px;
  border-radius: 100%;
}

.badge-lg :deep(.v-badge__badge) {
  width: 32px;
  height: 32px;
  font-size: 21px;
  border-radius: 100%;
}

</style>
