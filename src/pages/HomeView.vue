<script setup lang="ts">
import { computed, ref } from 'vue'
import HeroSection from '@/components/ui/HeroSection/heroSection.vue';
import FilterChipGroup from '@/components/ui/FilterChipGroup/FilterChipGroup.vue';
import Section from '@/components/layout/Section/Section.vue';
import CardGrid from '@/components/layout/CardGrid/CardGrid.vue';
const selectedFilter = ref('all');

const filters = [
    { label: 'Todos', value: 'all' },
    { label: '2º Ano', value: '2ano' },
    { label: '3º Ano', value: '3ano' },
    { label: 'Fábrica', value: 'fabrica' },
];

const projects: ProjectCardItem[] = [
    {
        id: 1,
        logo: '/images/logo-projeto-a.png',
        status: 'ativo',
        statusLabel: 'Em andamento',
        description: 'Descrição do projeto A',
        title: 'Projeto A',
        team: '2º Ano',
        event: 'HACKIFC 2026',
    },
    {
        id: 2,
        logo: '/images/logo-projeto-b.png',
        status: 'finalizado',
        statusLabel: 'Concluído',
        description: 'Descrição do projeto B',
        title: 'Projeto B',
        team: '3º Ano',
        event: 'HACKIFC 2026',
    },
    {
        id: 3,
        logo: '/images/logo-projeto-b.png',
        status: 'finalizado',
        statusLabel: 'Concluído',
        description: 'Descrição do projeto B',
        title: 'Projeto B',
        team: '3º Ano',
        event: 'HACKIFC 2026',
    },
    {
        id: 4,
        logo: '/images/logo-projeto-b.png',
        status: 'finalizado',
        statusLabel: 'Concluído',
        description: 'Descrição do projeto B',
        title: 'Projeto B',
        team: '3º Ano',
        event: 'HACKIFC 2026',
    },
];
</script>
<template>

    <HeroSection title="Desenvolva, colabore e inove no HackIFC // 24H"
        subtitle="Desenvolva, colabore e inove no HackIFC // 24H" :model-value="search"
        @update:model-value="search = $event" />

    <div class="flex justify-center w-full">
        <FilterChipGroup :options="filters" v-model="selectedFilter" />
    </div>
    <div class="gap-10 mt-10">

        <div class="p-6">
            <Section title="2 ano" to="/projetos" link-text="Ver todos">
                <CardGrid :items="projects" />
            </Section>
        </div>

        <div class="p-6">
            <Section title="2 ano" to="/projetos" link-text="Ver todos">
                <CardGrid :items="projects" />
            </Section>
        </div>

    </div>
</template>