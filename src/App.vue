<script lang="ts" setup>
import { ref } from 'vue';
import HeroSection from './components/ui/HeroSection/heroSection.vue';

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

const search = ref('')
</script>
<template>

  <div class="flex">
    <HeroSection
    title="Desenvolva, colabore e inove no HackIFC // 24H"
    subtitle="Desenvolva, colabore e inove no HackIFC // 24H"
    v-model="search"
  />
    </div>
</template>
<style></style>
