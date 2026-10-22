import type { EdicaoStatusApi } from './edicao'

export interface CriterioAvaliado {
  criterio_id: number
  criterio: string
  nota_id: number
  /** Ex.: "8.50" */
  nota: string
}

export interface CriterioPendente {
  criterio_id: number
  criterio: string
}

/** Um item de GET /me/avaliacoes/ (um por projeto das edições do avaliador). */
export interface MinhaAvaliacao {
  edicao: number
  edicao_nome: string
  edicao_status: EdicaoStatusApi
  /** true somente com a edição em AVALIACAO. */
  avaliacao_aberta: boolean
  avaliador_id: number
  projeto: {
    id: number
    nome_projeto: string
    descricao_projeto: string
    link_deploy_projeto: string | null
    equipe: string
  }
  total_criterios: number
  criterios_avaliados: CriterioAvaliado[]
  criterios_pendentes: CriterioPendente[]
  concluido: boolean
}

export interface NotaCriterio {
  criterio: number
  nota: number | string
  comentario_nota?: string
}

export interface Nota {
  id: number
  nota: string
  comentario_nota: string | null
  projeto: number
  criterio: number
  avaliador: number
}

export type PerfilSolicitado = 'AVALIADOR' | 'PROFESSOR'
export type StatusSolicitacao = 'PENDENTE' | 'APROVADA' | 'RECUSADA'

export interface SolicitacaoPerfilAdmin {
  id: number
  usuario: number
  usuario_email: string
  usuario_nome: string
  perfil_solicitado: PerfilSolicitado
  status: StatusSolicitacao
  criada_em: string
  decidida_em: string | null
  decidida_por: number | null
  decidida_por_email: string | null
}
