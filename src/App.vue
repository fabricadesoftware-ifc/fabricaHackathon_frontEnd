<script setup>
import { RouterView } from 'vue-router';
import Sidebar from './components/ui/Sidebar/Sidebar.vue';
import AppHeader from './components/layout/AppHeader/AppHeader.vue';
</script>
<template>
  <div class="flex">
    <Sidebar :active-item="'home'" />
    <div class="flex-1">
      <AppHeader :is-logged="true"/>
      <main>
        <RouterView/>
      </main>
    </div>
  </div>
</template>
