<script setup>
import { RouterView } from 'vue-router';
import Sidebar from './components/ui/Sidebar/Sidebar.vue';
import AppHeader from './components/layout/AppHeader/AppHeader.vue';
</script>
<template>
  <div class="flex">
    <Sidebar :active-item="'home'" />
    <div >
      <AppHeader :is-logged="true"/>
      <RouterView />
    </div>
  </div>
</template>
