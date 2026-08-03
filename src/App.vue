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
  <div class="hidden">
    <div>
        <EventCard
            endDate="2 novembro"
            image="/images/hackifc.png"
            location="Fabrica"
            startDate="1 de Novembro"
            status="inscricoes"
            statusLabel="Inscrições"
            :tags="['Criatividade', 'Performance', 'Inovação']"
            :teams="8"
            title="HackIFC // 2026"
        />
    </div>
  </div>

  <div class="hidden">
    <StatusProject
      label="Ativo"
      status="ativo"
    />
  </div>

  <div class="hidden">
    <ProjectCard
        logo="/images/logo.png"
        status="ativo"
        statusLabel="Ativo"
        description="O alugaê é um sistema desenvolvido com intuito de ajudar as pessoas"
        title="Alugaê"
        team="Os melhores"
        event="HackIFC // 2026 · Fabrica"
    />
  </div>

  <div>
    <AppHeader
      :debounce-ms="100"
      :is-logged="true"
      :model-value="model"
      :notification-count="5"
      placeholder="Pesquisar hackathons ou projetos..."
      :user-avatar="logo"
      user-name="Renan"
    />
  </div>
</template>

  <style>

  </style>
