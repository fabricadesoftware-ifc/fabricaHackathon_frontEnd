import type { TipoUsuario } from '@/types/usuario'

export interface NavItem {
  id: string
  label: string
  icon: string
  route: string
  requiresAuth?: boolean
  roles?: TipoUsuario[]
  showOnMobile?: boolean
}

export const navigationItems: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: 'mdi-home',
    route: '/home',
    showOnMobile: true,
  },
  {
    id: 'edicoes',
    label: 'Edições',
    icon: 'mdi-code-tags',
    route: '/edicoes',
    showOnMobile: true,
  },
  {
    id: 'explorar',
    label: 'Explorar',
    icon: 'mdi-magnify',
    route: '/explorar',
    showOnMobile: false,
  },
  {
    id: 'projetos',
    label: 'Meus projetos',
    icon: 'mdi-folder',
    route: '/projetos',
    requiresAuth: true,
    roles: ['PARTICIPANTE', 'PROFESSOR', 'ADMIN'],
    showOnMobile: true,
  },
  {
    id: 'equipes',
    label: 'Minhas equipes',
    icon: 'mdi-account-group',
    route: '/equipes',
    requiresAuth: true,
    roles: ['PARTICIPANTE', 'PROFESSOR', 'ADMIN'],
    showOnMobile: true,
  },
  {
    id: 'inscricao',
    label: 'Inscrição',
    icon: 'mdi-clipboard-text',
    route: '/inscricao',
    requiresAuth: true,
    roles: ['PARTICIPANTE'],
    showOnMobile: true,
  },
  {
    id: 'config',
    label: 'Configurações',
    icon: 'mdi-cog',
    route: '/configuracoes',
    requiresAuth: true,
    showOnMobile: true,
  },
  {
  id: 'avaliacoes',
  label: 'Avaliações',
  icon: 'mdi-clipboard-check',
  route: '/avaliacao',
  requiresAuth: true,
  roles: ['AVALIADOR', 'PROFESSOR', 'ADMIN'],
  showOnMobile: false,
},
  {
    id: 'admin',
    label: 'Administração',
    icon: 'mdi-shield-crown',
    route: '/admin',
    requiresAuth: true,
    roles: ['ADMIN'],
    showOnMobile: false,
  },
  {
    id: 'solicitacoes',
    label: 'Solicitações',
    icon: 'mdi-account-check',
    route: '/admin/solicitacoes',
    requiresAuth: true,
    roles: ['ADMIN'],
    showOnMobile: false,
  },
]
