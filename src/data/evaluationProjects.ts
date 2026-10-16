export interface EvaluationProject {
  id: number
  editionId: number
  name: string
  teamName: string
  avatar?: string | null
  status: 'pendente' | 'avaliado'
  score?: number
}

export const mockEvaluationProjects: EvaluationProject[] = [
  {
    id: 1,
    editionId: 1,
    name: 'Hackathon App',
    teamName: 'Equipe Alpha',
    avatar: '/images/logo.png',
    status: 'avaliado',
    score: 9.5,
  },
  {
    id: 2,
    editionId: 1,
    name: 'EcoRoute Delivery',
    teamName: 'Equipe Beta',
    avatar: '/images/logo1.png',
    status: 'avaliado',
    score: 8.8,
  },
  {
    id: 3,
    editionId: 1,
    name: 'EducaIA Platform',
    teamName: 'Equipe Gamma',
    avatar: '/images/logo2.png',
    status: 'avaliado',
    score: 9.0,
  },
  {
    id: 4,
    editionId: 1,
    name: 'SmartAgritech',
    teamName: 'Equipe Delta',
    avatar: '/images/logo3.png',
    status: 'avaliado',
    score: 7.5,
  },
  {
    id: 5,
    editionId: 1,
    name: 'SaúdeConectada',
    teamName: 'Equipe Epsilon',
    avatar: '/images/logo4.png',
    status: 'avaliado',
    score: 8.2,
  },
  {
    id: 6,
    editionId: 1,
    name: 'FinanceFlow Dashboard',
    teamName: 'Equipe Zeta',
    avatar: '/images/logo5.png',
    status: 'avaliado',
    score: 9.1,
  },
  {
    id: 7,
    editionId: 1,
    name: 'ReciclaMais IoT',
    teamName: 'Equipe Eta',
    avatar: '/images/logo6.png',
    status: 'pendente',
  },
  {
    id: 8,
    editionId: 1,
    name: 'BioTrack Tracker',
    teamName: 'Equipe Theta',
    avatar: '/images/logo7.png',
    status: 'pendente',
  },
  {
    id: 9,
    editionId: 1,
    name: 'SafeHome Security',
    teamName: 'Equipe Iota',
    avatar: '/images/logo8.png',
    status: 'pendente',
  },
  {
    id: 10,
    editionId: 1,
    name: 'UrbanMobility Hub',
    teamName: 'Equipe Kappa',
    avatar: null,
    status: 'pendente',
  },
  {
    id: 11,
    editionId: 1,
    name: 'NeuroLearn Assistant',
    teamName: 'Equipe Lambda',
    avatar: '/images/logo9.png',
    status: 'pendente',
  },
  {
    id: 12,
    editionId: 1,
    name: 'AquaGuard Monitor',
    teamName: 'Equipe Mu',
    avatar: null,
    status: 'pendente',
  },
]

/**
 * Busca os projetos para avaliação de uma edição específica.
 * Simula uma chamada assíncrona à API com delay.
 */
export async function getProjectsByEdition (editionId: number): Promise<EvaluationProject[]> {
  await new Promise(resolve => setTimeout(resolve, 350))

  const editionProjects = mockEvaluationProjects.filter(p => p.editionId === editionId)
  if (editionProjects.length > 0) {
    return editionProjects
  }

  // Fallback para outras edições demonstrarem dados na visualização
  return mockEvaluationProjects.map(p => ({
    ...p,
    editionId,
  }))
}
