<script lang="ts" setup>
import { ref } from 'vue';
import EventCard from './components/ui/eventCard.vue';
import StatusProject from './components/ui/statusProject.vue';
import ProjectCard from './components/ui/projectCard.vue';
import AppButton from './components/ui/AppButton/index.ts';
import HeaderActions from './components/ui/HeaderActions/index.ts';
import SearchBar from './components/ui/SearchBar'
import { Sidebar } from './components/ui/Sidebar'
import PageHeader from './components/ui/PageHeader/PageHeader.vue';
const activeItem = ref('home')
const isLoggedIn = ref(true)

</script>
<template>
  <div class="flex">
    <Sidebar v-model:active-item="activeItem" :is-logged-in="isLoggedIn" />
    <main class="flex-1 ms-8 me">
      <SearchBar placeholder="Pesquisar hackathons ou projetos..." modelValue="asdasd"></SearchBar>
      <PageHeader title="Explore Hackathon" subtitle="Descubra edições passadas e em andamento"></PageHeader>
      <SearchBar placeholder="Pesquisar hackathons..." modelValue=""></SearchBar>

      <div>
        <div>
          <EventCard end-date="2 novembro" image="/images/hackifc.png" location="Fabrica" start-date="1 de Novembro"
            status="inscricoes" status-label="Inscrições" :tags="['Criatividade', 'Performance', 'Inovação']" :teams="8"
            title="HackIFC // 2026" />
        </div>
      </div>

      <div>
        <StatusProject label="Ativo" status="ativo" />
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
      <HeaderActions />
    </main>
    </div>
</template>
<style></style>
