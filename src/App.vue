<script lang="ts" setup>
  import EventCard from './components/ui/eventCard.vue';
  import StatusProject from './components/ui/statusProject.vue';
  import ProjectCard from './components/ui/projectCard.vue';
  import AppSelect from '@/components/ui/AppSelect'
import { ref } from 'vue'

// --- Tipo ---
const tipoOptions = [
  { label: 'Frontend', value: 'frontend' },
  { label: 'Backend', value: 'backend' },
  { label: 'Fullstack', value: 'fullstack' },
]
const tipoSelecionado = ref<string | null>(null)

// --- Ano ---
const anoOptions = [
  { label: '2023', value: '2023' },
  { label: '2024', value: '2024' },
  { label: '2025', value: '2025' },
  { label: '2026', value: '2026' },
]
const anoSelecionado = ref<string | null>(null)

// --- Status ---
const statusOptions = [
  { label: 'Ativo', value: 'ativo' },
  { label: 'Inativo', value: 'inativo' },
  { label: 'Pendente', value: 'pendente' },
]
const statusSelecionado = ref<string | null>(null)
</script>

<template>

  <div class="flex gap-4">
    <AppSelect
      v-model="tipoSelecionado"
      :options="tipoOptions"
      placeholder="Tipo"
    />

    <AppSelect
      v-model="anoSelecionado"
      :options="anoOptions"
      placeholder="Ano"
    />

    <AppSelect
      v-model="statusSelecionado"
      :options="statusOptions"
      placeholder="Status"
    />
  </div>
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
