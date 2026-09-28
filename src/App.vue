<script lang="ts" setup>
import Sidebar from './components/ui/Sidebar/Sidebar.vue';
</script>
<template>
  <div class="flex min-w-full">
    <Sidebar active-item="home" :is-logged-in="false"></Sidebar>
  </div>
</template>
<style></style>