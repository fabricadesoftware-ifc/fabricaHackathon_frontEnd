<script setup lang="ts">
import { ref } from 'vue'

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

function handleNotificationClick() {
  emit('notification-click')
}

function handleOptionClick(option: MenuOption) {
  emit('menu-option-click', option)
  menuOpen.value = false
}
</script>

<template>
  <div class="flex items-center gap-5"> 
    <button
      class="relative bg-transparent border-none cursor-pointer text-2xl notification-btn"
      @click="handleNotificationClick"
      aria-label="Notificações"
    >
      <v-icon icon="mdi-bell-outline" size="30" color="black" />
      <v-badge
        v-if="props.notificationCount > 0"
        :content="props.notificationCount"
        color="red"
        overlap
        class="absolute -top-1 -right-1"
      />
    </button> 

    <!-- Avatar + Menu -->
    <v-menu v-model="menuOpen" location="bottom end">
      <template #activator="{ props: menuProps }">
        <v-avatar
          v-bind="menuProps"
          :image="props.userAvatar || undefined"
          size="40"
          class="cursor-pointer"
        >
          <v-icon v-if="!props.userAvatar" icon="mdi-account" />
        </v-avatar>
      </template>

      <v-list density="compact" class="simple-menu">
        <v-list-item
          :title="props.userName"
          class="font-semibold text-sm opacity-70 "
          disabled
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
  padding: 0 12px !important;
  margin: 0 !important;
  border-radius: 6px !important;
  color: #212121 !important;    
}

.simple-menu :deep(.v-list-item__overlay) {
  background-color: #f0f0f0 !important;
  opacity: 0 !important;
}
.simple-menu :deep(.v-list-item-title) {
  color: #212121 !important;
}

.simple-menu :deep(.v-list-item:hover) {
  background-color: #f0f0f0 !important;
}

.simple-menu :deep(.v-list-item--disabled) {
  opacity: 0.5 !important;
  padding-top: 4px !important;
  min-height: 28px !important;
}
</style>  