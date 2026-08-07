<script lang="ts" setup>
import { ref } from 'vue';
import HeroSection from './components/ui/HeroSection/heroSection.vue';
import settingSectionHeader from './components/ui/SettingSectionHeader/settingSectionHeader.vue';
import SettingSectionHeader from './components/ui/SettingSectionHeader/settingSectionHeader.vue';

const search = ref('')
</script>
<template>

  <div class="p-6 flex flex-col gap-4">
    <SettingSectionHeader
      icon="mdi mdi-account"
      title="Perfil do Usuário"
      subtitle="Gerencie suas informações pessoais"
      variant="perfil"
    />

    <SettingSectionHeader
      icon="mdi mdi-alert-circle"
      title="Zona de Perigo"
      subtitle="Ações irreversíveis na sua conta"
      variant="perigo"
    />
  </div>
</template>
<style></style>
