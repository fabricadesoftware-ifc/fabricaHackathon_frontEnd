<script lang="ts" setup>
  import { ref, computed } from 'vue'
  import AvatarUpload from '@/components/layout/AvatarUpload'
  import AppHeader from './components/layout/AppHeader/AppHeader.vue'
  import EventDateRange from './components/ui/EventDateRange/EventDateRange.vue'
  import { Sidebar } from './components/ui/Sidebar'

  const activeItem = ref('home')
  const isLoggedIn = ref(true)
  const file: File = { name: '', lastModified: 0, size: 0, type: '', webkitRelativePath: '' }
</script>
<template>

  <div class="flex">
    <main class="flex-1 flex-row">
      <AppHeader :is-logged="true" :notification-count="3" user-avatar="/avatar.png" user-name="Renan" />
      <RouterView />
      <EventDateRange :start-date="'01/03/2025'" :end-date="'15/04/2025'" />
      <AvatarUpload
      @update:file="file"
      />
      <DangerZoneSection>
    <ul>
      <li>
        <DangerActionItem 
        icon='mdi mdi-exit-to-app'
        title="Sair da conta"
        subtitle="encerre sua sessão"
        variant="sair"
        />
      </li>
      <li>
        <DangerActionItem 
        icon='mdi mdi-trash-can-outline'
        title="Excluir conta"
        subtitle="Isso deleta todas as informações das contas"
        variant="excluir"
        />
      </li>
    </ul>
  </DangerZoneSection>
    </main>
  </div>
</template>
<style></style>
