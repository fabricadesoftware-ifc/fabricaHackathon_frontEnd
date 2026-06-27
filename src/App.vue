<script lang="ts" setup>
import EventCard from './components/ui/eventCard.vue';
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
            title="HackIFC // 2026 · Fabrica"
        />
    </div>
  </div>
</template>

  <style>

  </style>
