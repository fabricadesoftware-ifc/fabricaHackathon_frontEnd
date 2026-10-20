import type { Equipe } from './equipe'
import { formatarData } from '@/utils/format'

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
  id?: number
  nome: string
  tipo?: string
  logo_apoiador?: string | null
}

export interface Criterio {
  id: number
  nome: string
}

export interface Tema {
  id: number
  descricao_tema: string
}

/** Detalhe da edição (GET /edicoes/{id}/). */
export interface EdicaoDetalhe extends Edicao {
  descricao: string
  minimo_participantes: number
  maximo_participantes: number
  maximo_equipes: number
  apoiadores: Apoiador[]
  criterios: Criterio[]
  temas: Tema[]
  equipes: Equipe[]
}

/** Mapeia a edição da API para o formato usado pelos componentes (eventCard). */
export function edicaoParaCard (e: Edicao) {
  return {
    id: e.id,
    title: e.nome,
    tags: [e.tipo_edicao, String(e.ano)].filter(Boolean),
    manager: e.responsavel,
    image: e.imagem_capa ?? '/images/fabricaHackathonThumb.png',
    status: mapearStatus(e.status),
    statusLabel: e.status_label,
    startDate: formatarData(e.data_inicio),
    endDate: formatarData(e.data_fim),
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
