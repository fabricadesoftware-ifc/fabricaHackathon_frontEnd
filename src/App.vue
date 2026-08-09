<script lang="ts" setup>
import { ref, computed } from 'vue';

import { Sidebar } from './components/ui/Sidebar'

import AppHeader from './components/layout/AppHeader/AppHeader.vue';
import EventDateRange from './components/ui/EventDateRange/EventDateRange.vue';

const activeItem = ref('home')
const isLoggedIn = ref(true)

</script>
<template>

  <div class="flex">
    <Sidebar v-model:active-item="activeItem" :is-logged-in="isLoggedIn" />



    <main class="flex-1 flex-row">
      <AppHeader :is-logged="true" :notification-count="3" user-avatar="/avatar.png" user-name="Renan" />
      <RouterView />
      <EventDateRange :start-date="'01/03/2025'" :end-date="'15/04/2025'" />
    </main>
  </div>
</template>
<style></style>
