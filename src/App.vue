<script lang="ts" setup>
  import { ref, computed } from 'vue'
  import AvatarUpload from '@/components/layout/AvatarUpload'
  import AppHeader from './components/layout/AppHeader/AppHeader.vue'
  import EventDateRange from './components/ui/EventDateRange/EventDateRange.vue'
  import { Sidebar } from './components/ui/Sidebar'
  import EvaluationBadge from './components/ui/EvaluationBadge/EvaluationBadge.vue'

  const activeItem = ref('home')
  const isLoggedIn = ref(true)
  const file: File = { name: '', lastModified: 0, size: 0, type: '', webkitRelativePath: '' }
</script>
<template>

  <div class="flex">
    <Sidebar v-model:active-item="activeItem" :is-logged-in="isLoggedIn" />


    <main class="flex-1 flex-row">
      <AppHeader :is-logged="true" :notification-count="3" user-avatar="/avatar.png" user-name="Renan" />
      <div class="mx-10">
        <RouterView />
      </div>
      <EvaluationBadge status="Pendente" />

  <EvaluationBadge
    status="Avaliado"
    score="9.5"
  />
    </main>
  </div>
</template>
<style></style>
