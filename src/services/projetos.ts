import type { PageParams, Paginated, Projeto } from '@/types'
import { http } from './http'
import { listar, listarTodos } from './pagination'

export type RecursoFiltros = {
  edicao?: number
  search?: string
  ordering?: string
}

export function listarProjetos (params: RecursoFiltros & PageParams = {}) {
  return listar<Projeto>('/projetos/', params)
}

export function listarTodosProjetos (params: RecursoFiltros = {}) {
  return listarTodos<Projeto>('/projetos/', params)
}

export const obterProjeto = (id: number | string) => http.get<Projeto>(`/projetos/${id}/`)

/** Uma página de projetos com o total (`count`), para paginação no servidor. */
export function listarProjetosPaginado (params: RecursoFiltros & PageParams = {}) {
  return http.get<Paginated<Projeto>>('/projetos/', params)
}
