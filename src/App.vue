<script lang="ts" setup>
  import { ref } from 'vue'
  import EventCard from './components/ui/eventCard.vue'
  import ProjectCard from './components/ui/projectCard.vue'
  import { Sidebar } from './components/ui/Sidebar'
  import StatusProject from './components/ui/statusProject.vue'

  const activeItem = ref('home')
  const isLoggedIn = ref(true)

</script>

<template>
  <div class="flex">
    <Sidebar v-model:active-item="activeItem" :is-logged-in="isLoggedIn" />

    <main class="flex-1">
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
    </main>
  </div>
</template>

<style>

</style>
