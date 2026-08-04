<script lang="ts" setup>
  import { ref } from 'vue'
  import logo from '@/assets/logo.png'
  import AppHeader from './components/layout/AppHeader/index.ts'
  import EventCard from './components/ui/eventCard.vue'
  import ProjectCard from './components/ui/projectCard.vue'
  import StatusProject from './components/ui/statusProject.vue'
  const model = ref('')
</script>

<template>
  <!-- Header de exemplo na app vue -->
  <AppHeader
    class="mb-[3vw]"
    :debounce-ms="100"
    :is-logged="true"
    :model-value="model"
    :notification-count="5"
    placeholder="Pesquisar hackathons ou projetos..."
    :user-avatar="logo"
    user-name="Renan"
  />

  <div>
    <div>
      <EventCard
        end-date="2 novembro"
        image="/images/hackifc.png"
        location="Fabrica"
        start-date="1 de Novembro"
        status="inscricoes"
        status-label="Inscrições"
        :tags="['Criatividade', 'Performance', 'Inovação']"
        :teams="8"
        title="HackIFC // 2026"
      />
    </div>
  </div>

  <div>
    <StatusProject
      label="Ativo"
      status="ativo"
    />
  </div>

  <div>
    <ProjectCard
      description="O alugaê é um sistema desenvolvido com intuito de ajudar as pessoas"
      event="HackIFC // 2026 · Fabrica"
      logo="/images/logo.png"
      status="ativo"
      status-label="Ativo"
      team="Os melhores"
      title="Alugaê"
    />
  </div>
</template>

  <style>

  </style>
