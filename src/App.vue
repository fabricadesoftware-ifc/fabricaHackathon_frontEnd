<script lang="ts" setup>
import { ref } from 'vue';
import heroSection from './components/ui/HeroSection/heroSection.vue';

const projetos: ProjectCardItem[] = [
  {
    id: 1,
    logo: '/images/logo.png',
    status: 'ativo',
    statusLabel: 'Ativo',
    description: 'O alugaê é um sistema desenvolvido com intuito de ajudar as pessoas',
    title: 'Alugaê',
    team: 'Os melhores',
    event: 'HackIFC // 2026 · Fabrica',
  },
]
</script>
<template>

  <div class="flex">
    <heroSection></heroSection>
    </div>
</template>
<style></style>
