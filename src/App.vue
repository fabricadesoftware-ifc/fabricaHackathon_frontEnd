<script lang="ts" setup>
import { ref } from 'vue'
import AppHeader from "./components/layout/AppHeader/index.ts";
import { CardGrid, type ProjectCardItem } from './components/layout/CardGrid'
import { Section } from './components/layout/Section'
import AppButton from './components/ui/AppButton/index.ts'
import EventCard from './components/ui/eventCard.vue'
import HeaderActions from './components/ui/HeaderActions/index.ts'
import SearchBar from './components/ui/SearchBar'
import { Sidebar } from './components/ui/Sidebar'

const activeItem = ref('home')
const isLoggedIn = ref(true)

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
    <Sidebar v-model:active-item="activeItem" :is-logged-in="isLoggedIn" />

    <main class="flex-1 bg-gray-50">
      <AppHeader class="mb-[3vw]" :debounce-ms="100" :is-logged="true" :model-value="model" :notification-count="5"
        placeholder="Pesquisar hackathons ou projetos..." :user-avatar="logo" user-name="Renan" />
      <div>
        <ProjectCard description="O alugaê é um sistema desenvolvido com intuito de ajudar as pessoas"
          event="HackIFC // 2026 · Fabrica" logo="/images/logo.png" status="ativo" status-label="Ativo"
          team="Os melhores" title="Alugaê" />
      </div>
      <div>
        <ProjectCard description="O alugaê é um sistema desenvolvido com intuito de ajudar as pessoas"
          event="HackIFC // 2026 · Fabrica" logo="/images/logo.png" status="ativo" status-label="Ativo"
          team="Os melhores" title="Alugaê" />
      </div>
      <div class="flex items-center gap-3 p-4">
        <AppButton variant="text" label="Entrar" @click="() => console.log('entrar clicado')" />
        <AppButton variant="primary" label="Criar conta" @click="() => console.log('criar conta clicado')" />
      </div>
      <Section class="mt-6" title="Em andamento">
        <CardGrid :items="projetos" />
      </Section>

      <div class="flex items-center gap-3 p-4">
        <AppButton label="Entrar" variant="text" @click="() => console.log('entrar clicado')" />
        <AppButton label="Criar conta" variant="primary" @click="() => console.log('criar conta clicado')" />
      </div>

      <HeaderActions />
      <SearchBar placeholder="Pesquisar hackathons ou projetos..." modelValue="asdasd"></SearchBar>
      <SearchBar model-value="asdasd" placeholder="Pesquisar hackathons ou projetos..." />
    </main>
  </div>
</template>
<style></style>
