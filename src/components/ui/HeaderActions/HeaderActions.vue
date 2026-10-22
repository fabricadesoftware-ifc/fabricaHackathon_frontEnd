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
  if (mdAndDown.value) return 34
  return 45
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


function handleOptionClick(option: MenuOption) {
  emit('menu-option-click', option)
  menuOpen.value = false
}


</script>


<template>
  <div class="flex items-center gap-8 justify-end">

    <v-menu v-model="menuOpen" location="bottom end">

      <template #activator="{ props: menuProps }">

        <v-avatar v-bind="menuProps" class="cursor-pointer avatar" color="#3B82F6" :size="size">
          <img v-if="props.userAvatar" :alt="props.userName" class="h-full w-full object-cover" :src="props.userAvatar">
          <v-icon v-else color="white" icon="mdi-account" />
        </v-avatar>

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
.avatar {
  transition: opacity 0.15s ease-in-out;
}


.avatar:hover {
  opacity: 0.9;
}


/* Menu */
.simple-menu {
  background-color: #ffffff !important;
  border-radius: 8px !important;
  padding: 2px !important;
  min-width: 150px !important;
}


.simple-menu :deep(.v-list-item) {
  min-height: 32px !important;
  padding: 4px 10px !important;
  border-radius: 6px !important;
  color: #212121 !important;
}


.simple-menu :deep(.v-list-item-title) {
  color: #212121 !important;
  font-size: 14px !important;
}


.simple-menu :deep(.v-list-item:hover) {
  background-color: #f0f0f0 !important;
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
