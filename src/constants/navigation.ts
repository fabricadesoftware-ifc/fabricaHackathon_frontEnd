export interface NavItem {
  id: string
  label: string
  icon: string
  route: string
  requiresAuth?: boolean
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
    showOnMobile: true,
  },
  {
    id: 'equipes',
    label: 'Minhas equipes',
    icon: 'mdi-account-group',
    route: '/equipes',
    requiresAuth: true,
    showOnMobile: true,
  },
  {
    id: 'inscricao',
    label: 'Inscrição',
    icon: 'mdi-clipboard-text',
    route: '/inscricao',
    requiresAuth: true,
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
]