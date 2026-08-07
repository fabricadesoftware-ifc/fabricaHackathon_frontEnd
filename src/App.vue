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
import ProfileForm from './components/layout/ProfileForm/ProfileForm.vue';
const activeItem = ref('home')
const isLoggedIn = ref(true)
const nome = ref('')
const sobrenome = ref('')
const username = ref('')
const email = ref('')
const bio = ref('')
const search = ref('')
</script>
<template>

  <div class="flex">
    <Sidebar v-model:active-item="activeItem" :is-logged-in="isLoggedIn" />



    <main class="flex-1 flex-row">
      <ProfileForm v-model:nome="nome" v-model:sobrenome="sobrenome" v-model:username="username" v-model:email="email"
        v-model:bio="bio" />
      <SearchBar placeholder="Pesquisar hackathons ou projetos..." modelValue="asdasd"></SearchBar>
      <PageHeader title="Explore Hackathon" subtitle="Descubra edições passadas e em andamento"></PageHeader>
      <SearchBar placeholder="Pesquisar hackathons..." modelValue=""></SearchBar>



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
      <SearchBar placeholder="Pesquisar hackathons ou projetos..." modelValue="asdasd"></SearchBar>
      <ResultsBar total="66" start="1" end="12"> </ResultsBar>
    </main>
  </div>
</template>
<style></style>
