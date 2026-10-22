import type { RecursoFiltros } from './projetos'
import type { Equipe, PageParams } from '@/types'
import { http } from './http'
import { listar, listarTodos } from './pagination'

export function listarEquipes (params: RecursoFiltros & PageParams = {}) {
  return listar<Equipe>('/equipes/', params)
}

export function listarTodasEquipes (params: RecursoFiltros = {}) {
  return listarTodos<Equipe>('/equipes/', params)
}

export const obterEquipe = (id: number | string) => http.get<Equipe>(`/equipes/${id}/`)
