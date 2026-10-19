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

export const projects: Project[] = [
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
