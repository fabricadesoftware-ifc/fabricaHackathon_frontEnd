<script lang="ts" setup>
  import EventCard from './components/ui/eventCard.vue';
  import StatusProject from './components/ui/statusProject.vue';
  import ProjectCard from './components/ui/projectCard.vue';
  import AppButton from './components/ui/AppButton/index.ts';
</script>

<template>
  <div class="flex items-center gap-3 p-4">
    <AppButton variant="text" label="Entrar" @click="() => console.log('entrar clicado')" />
    <AppButton variant="primary" label="Criar conta" @click="() => console.log('criar conta clicado')" />
  </div>
</template>
  <style>

  </style>
