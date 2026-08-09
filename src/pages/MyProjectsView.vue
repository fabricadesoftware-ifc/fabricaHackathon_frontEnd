<template>
    <PageHeader title="Meus projetos" subtitle="Pesquise seus atuais e antigos projetos" />
    <div>
        <SearchFilterBar />
        <ResultsBar :total="hackathons.length" :start="startIndex + 1" :end="endIndex" />

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-4">
            <eventCard v-for="h in paginatedHackathons" :key="h.id" v-bind="h" />
        </div>

        <AppPagination v-model="currentPage" :length="totalPages" />
    </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import PageHeader from '@/components/ui/PageHeader/PageHeader.vue';
  import ResultsBar from '@/components/ui/ResultsBar/ResultsBar.vue';
  import SearchFilterBar from '@/components/ui/SearchFilterBar';
  import eventCard from '@/components/ui/eventCard.vue';
  import AppPagination from '@/components/layout/AppPagination/AppPagination.vue';

type Status = 'inscricoes' | 'avaliacao' | 'andamento' | 'finalizado';

interface Hackathon {
    id: number;
    title: string;
    image: string;
    status: Status;
    statusLabel: string;
    startDate: string;
    endDate: string;
    teams: number;
    location: string;
    tags: string[];
}

const hackathons: Hackathon[] = [
    {
        id: 1,
        title: 'Hackathon Fábrica',
        image: '/images/hackifc.png',
        status: 'andamento',
        statusLabel: 'Em andamento',
        startDate: '01/09/2026',
        endDate: '05/09/2026',
        teams: 12,
        location: 'Joinville',
        tags: ['Web', 'IA', 'Mobile'],
    },
    {
        id: 2,
        title: 'Hackathon 2º Ano',
        image: '/images/hackifc.png',
        status: 'finalizado',
        statusLabel: 'Finalizado',
        startDate: '10/03/2025',
        endDate: '14/03/2025',
        teams: 8,
        location: 'Joinville',
        tags: ['Backend', 'Dados'],
    },
    {
        id: 3,
        title: 'Hackathon 3º Ano',
        image: '/images/hackifc.png',
        status: 'inscricoes',
        statusLabel: 'Inscrição',
        startDate: '01/12/2026',
        endDate: '05/12/2026',
        teams: 5,
        location: 'Joinville',
        tags: ['Fullstack'],
    },
    {
        id: 4,
        title: 'Hackathon Fábrica',
        image: '/images/hackifc.png',
        status: 'andamento',
        statusLabel: 'Em andamento',
        startDate: '01/09/2026',
        endDate: '05/09/2026',
        teams: 12,
        location: 'Joinville',
        tags: ['Web', 'IA', 'Mobile'],
    },
    {
        id: 5,
        title: 'Hackathon 2º Ano',
        image: '/images/hackifc.png',
        status: 'finalizado',
        statusLabel: 'Finalizado',
        startDate: '10/03/2025',
        endDate: '14/03/2025',
        teams: 8,
        location: 'Joinville',
        tags: ['Backend', 'Dados'],
    },
    {
        id: 6,
        title: 'Hackathon 3º Ano',
        image: '/images/hackifc.png',
        status: 'inscricoes',
        statusLabel: 'Inscrição',
        startDate: '01/12/2026',
        endDate: '05/12/2026',
        teams: 5,
        location: 'Joinville',
        tags: ['Fullstack'],
    },
    {
        id: 7,
        title: 'Hackathon Fábrica',
        image: '/images/hackifc.png',
        status: 'andamento',
        statusLabel: 'Em andamento',
        startDate: '01/09/2026',
        endDate: '05/09/2026',
        teams: 12,
        location: 'Joinville',
        tags: ['Web', 'IA', 'Mobile'],
    },
    {
        id: 8,
        title: 'Hackathon 2º Ano',
        image: '/images/hackifc.png',
        status: 'finalizado',
        statusLabel: 'Finalizado',
        startDate: '10/03/2025',
        endDate: '14/03/2025',
        teams: 8,
        location: 'Joinville',
        tags: ['Backend', 'Dados'],
    },
    {
        id: 9,
        title: 'Hackathon 3º Ano',
        image: '/images/hackifc.png',
        status: 'inscricoes',
        statusLabel: 'Inscrição',
        startDate: '01/12/2026',
        endDate: '05/12/2026',
        teams: 5,
        location: 'Joinville',
        tags: ['Fullstack'],
    },
];

// --- Paginação ---
const currentPage = ref(1);
const itemsPerPage = 8;

const totalPages = computed(() =>
    Math.max(1, Math.ceil(hackathons.length / itemsPerPage))
);

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage);
const endIndex = computed(() =>
    Math.min(startIndex.value + itemsPerPage, hackathons.length)
);

const paginatedHackathons = computed(() =>
    hackathons.slice(startIndex.value, endIndex.value)
);
</script>
