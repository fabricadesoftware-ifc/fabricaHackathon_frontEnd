<template>
    <PageHeader title="Meus Projetos" subtitle="Acompanhe os projetos das edições" />
    <div>
        <SearchFilterBar />
        <ResultsBar :total="projects.length" :start="startIndex + 1" :end="endIndex" />

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-4">
            <projectCard v-for="p in paginatedProjects" :key="p.id" v-bind="p" />
        </div>

        <AppPagination v-model="currentPage" :length="totalPages" />
    </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import PageHeader from '@/components/ui/PageHeader/PageHeader.vue';
  import ResultsBar from '@/components/ui/ResultsBar/ResultsBar.vue';
  import SearchFilterBar from '@/components/ui/SearchFilterBar';
  import projectCard from '@/components/ui/projectCard.vue'; // ajusta pro caminho real
  import AppPagination from '@/components/layout/AppPagination/AppPagination.vue';

type Status = 'finalizado' | 'ativo';

interface Project {
    id: number;
    logo: string;
    status: Status;
    statusLabel: string;
    title: string;
    description: string;
    team: string;
    event: string;
}

const projects: Project[] = [
    {
        id: 1,
        logo: '/images/logo1.png',
        status: 'ativo',
        statusLabel: 'Ativo',
        title: 'App de Gestão de Tarefas',
        description: 'Plataforma web para organização de times em sprints.',
        team: 'Equipe Alpha',
        event: 'Hackathon Fábrica 2026',
    },
    {
        id: 2,
        logo: '/images/logo2.png',
        status: 'finalizado',
        statusLabel: 'Finalizado',
        title: 'Sistema de Reconhecimento Facial',
        description: 'Solução de segurança usando IA para controle de acesso.',
        team: 'Equipe Beta',
        event: 'Hackathon 2º Ano 2025',
    },
    {
        id: 3,
        logo: '/images/logo3.png',
        status: 'ativo',
        statusLabel: 'Ativo',
        title: 'Dashboard Financeiro',
        description: 'Visualização de indicadores para pequenas empresas.',
        team: 'Equipe Gamma',
        event: 'Hackathon 3º Ano 2026',
    },
    {
        id: 4,
        logo: '/images/logo4.png',
        status: 'finalizado',
        statusLabel: 'Finalizado',
        title: 'Chatbot de Atendimento',
        description: 'Automação de suporte via IA generativa.',
        team: 'Equipe Delta',
        event: 'Hackathon Fábrica 2025',
    },
    {
        id: 5,
        logo: '/images/logo5.png',
        status: 'ativo',
        statusLabel: 'Ativo',
        title: 'App de Delivery Sustentável',
        description: 'Otimização de rotas com foco em redução de emissões.',
        team: 'Equipe Epsilon',
        event: 'Hackathon 2º Ano 2026',
    },
    {
        id: 6,
        logo: '/images/logo6.png',
        status: 'finalizado',
        statusLabel: 'Finalizado',
        title: 'Plataforma de Ensino Adaptativo',
        description: 'Personalização de conteúdo educacional via IA.',
        team: 'Equipe Zeta',
        event: 'Hackathon 3º Ano 2025',
    },
    {
        id: 7,
        logo: '/images/logo7.png',
        status: 'ativo',
        statusLabel: 'Ativo',
        title: 'Marketplace de Serviços Locais',
        description: 'Conexão entre prestadores e clientes da região.',
        team: 'Equipe Eta',
        event: 'Hackathon Fábrica 2026',
    },
    {
        id: 8,
        logo: '/images/logo8.png',
        status: 'finalizado',
        statusLabel: 'Finalizado',
        title: 'Sistema de Monitoramento IoT',
        description: 'Sensores integrados para controle industrial.',
        team: 'Equipe Theta',
        event: 'Hackathon 2º Ano 2025',
    },
    {
        id: 9,
        logo: '/images/logo9.png',
        status: 'ativo',
        statusLabel: 'Ativo',
        title: 'App de Saúde Mental',
        description: 'Acompanhamento de bem-estar com IA e gamificação.',
        team: 'Equipe Iota',
        event: 'Hackathon 3º Ano 2026',
    },
];

// --- Paginação ---
const currentPage = ref(1);
const itemsPerPage = 8;

const totalPages = computed(() =>
    Math.max(1, Math.ceil(projects.length / itemsPerPage))
);

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage);
const endIndex = computed(() =>
    Math.min(startIndex.value + itemsPerPage, projects.length)
);

const paginatedProjects = computed(() =>
    projects.slice(startIndex.value, endIndex.value)
);
</script>