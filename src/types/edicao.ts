import type { Equipe } from './equipe'

/** Status como o back-end envia. */
export type EdicaoStatusApi = 'INSCRICAO' | 'EM_ANDAMENTO' | 'AVALIACAO' | 'FINALIZADO'

/** Status como o front usa. */
export type EdicaoStatus = 'inscricoes' | 'andamento' | 'avaliacao' | 'finalizado'

export const STATUS_API_PARA_FRONT: Record<EdicaoStatusApi, EdicaoStatus> = {
  INSCRICAO: 'inscricoes',
  EM_ANDAMENTO: 'andamento',
  AVALIACAO: 'avaliacao',
  FINALIZADO: 'finalizado',
}

export const STATUS_FRONT_PARA_API: Record<EdicaoStatus, EdicaoStatusApi> = {
  inscricoes: 'INSCRICAO',
  andamento: 'EM_ANDAMENTO',
  avaliacao: 'AVALIACAO',
  finalizado: 'FINALIZADO',
}

export function mapearStatus (status: EdicaoStatusApi): EdicaoStatus {
  return STATUS_API_PARA_FRONT[status]
}

/** Item da lista de edições (GET /edicoes/). */
export interface Edicao {
  id: number
  nome: string
  ano: number
  status: EdicaoStatusApi
  status_label: string
  data_inicio: string
  data_fim: string
  local: string
  responsavel: string
  tipo_edicao: string
  total_equipes: number
  imagem_capa?: string | null
}

export interface Apoiador {
  nome?: string
  logo_apoiador: string | null
}

/** Detalhe da edição (GET /edicoes/{id}/). */
export interface EdicaoDetalhe extends Edicao {
  descricao: string
  minimo_participantes: number
  maximo_participantes: number
  maximo_equipes: number
  apoiadores: Apoiador[]
  criterios: unknown[]
  temas: unknown[]
  equipes: Equipe[]
}

/** Mapeia a edição da API para o formato usado pelos componentes (eventCard). */
export function edicaoParaCard (e: Edicao) {
  return {
    id: e.id,
    title: e.nome,
    manager: e.responsavel,
    image: e.imagem_capa ?? '',
    status: mapearStatus(e.status),
    statusLabel: e.status_label,
    startDate: e.data_inicio,
    endDate: e.data_fim,
    teamsCounter: e.total_equipes,
    location: e.local,
  }
}

export interface EdicaoFiltros {
  status?: EdicaoStatus
  ano?: number
  tipo_edicao?: string
  search?: string
  ordering?: string
}
