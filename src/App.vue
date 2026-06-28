<script lang="ts" setup>
  import EventCard from './components/ui/eventCard.vue';
  import StatusProject from './components/ui/statusProject.vue';
  import ProjectCard from './components/ui/projectCard.vue';

</script>

<template>
  <div>
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

  <div>
    <StatusProject
      label="Ativo"
      status="ativo"
    />
  </div>

  <div>
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
</template>

  <style>

  </style>
