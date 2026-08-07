<script lang="ts" setup>
  import EventCard from './components/ui/eventCard.vue';
  import StatusProject from './components/ui/statusProject.vue';
  import ProjectCard from './components/ui/projectCard.vue';
  import InfoCard from './components/ui/InfoCard/InfoCard.vue';

</script>

<template>
  <InfoCard
      title="Sobre o Hackathon"
      description="O hackathon de desenvolvimento web é um evento que reúne programadores, designers e outros profissionais da tecnologia para criar soluções digitais em um curto período de tempo. Durante o evento, os participantes trabalham em equipe para desenvolver sites, sistemas ou aplicações web que resolvam problemas reais ou apresentem ideias inovadoras."
      criteria-label="lista de critérios"
      :criteria="['Vue', 'TypeScript', 'Vuetify']"
    />
</template>

  <style>

  </style>
