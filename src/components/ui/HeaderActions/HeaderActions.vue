<script setup lang="ts">
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
</script>

<template>
  <div class="flex items-center gap-5">

    <button
      class="relative bg-transparent border-none cursor-pointer text-2xl"
      @click="emit('notification-click')"
    >
      <span class="mdi mdi-bell"></span>

      <span
        v-if="props.notificationCount > 0"
        class="absolute -top-2 -right-2 flex items-center justify-center w-[18px] h-[18px] rounded-full bg-red-500 text-white text-xs font-bold"
      >
        {{ props.notificationCount }}
      </span>
    </button>


 
    <div class="flex items-center gap-3">
      <img
        v-if="props.userAvatar"
        :src="props.userAvatar"
        alt="Avatar"
        class="w-10 h-10 rounded-full object-cover"
      />

      <div
        v-else
        class="flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 text-xl"
      >
        <span class="mdi mdi-account"></span>
      </div>
    </div>

  </div>
</template>