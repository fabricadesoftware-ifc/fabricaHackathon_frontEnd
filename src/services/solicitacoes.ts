import type { PageParams, Paginated, SolicitacaoPerfilAdmin, StatusSolicitacao } from '@/types'
import { http } from './http'

export function listarSolicitacoesPerfil (params: { status?: StatusSolicitacao } & PageParams = {}) {
  return http.get<Paginated<SolicitacaoPerfilAdmin>>('/solicitacoes-perfil/', params)
}

export function aprovarSolicitacao (id: number) {
  return http.post<SolicitacaoPerfilAdmin>(`/solicitacoes-perfil/${id}/aprovar/`)
}

export function recusarSolicitacao (id: number) {
  return http.post<SolicitacaoPerfilAdmin>(`/solicitacoes-perfil/${id}/recusar/`)
}
