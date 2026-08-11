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
    <Sidebar v-model:active-item="activeItem" :is-logged-in="isLoggedIn" />


    <main class="flex-1 flex-row bg-[#F9FAFB]">
      <AppHeader :is-logged="true" :notification-count="3" user-avatar="/avatar.png" user-name="Renan" />
      <div class="mx-10">
        <RouterView />
      </div>
      
    </main>
  </div>
</template>
<style></style>
