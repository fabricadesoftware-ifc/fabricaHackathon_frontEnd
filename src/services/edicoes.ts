import type { Edicao, EdicaoDetalhe, EdicaoFiltros, PageParams } from '@/types'
import { STATUS_FRONT_PARA_API } from '@/types'
import { http } from './http'
import { listar, listarTodos } from './pagination'

function paraQuery ({ status, ...resto }: EdicaoFiltros) {
  return { ...resto, status: status && STATUS_FRONT_PARA_API[status] }
}

export function listarEdicoes (filtros: EdicaoFiltros & PageParams = {}) {
  const { page, page_size, ...f } = filtros
  return listar<Edicao>('/edicoes/', { ...paraQuery(f), page, page_size })
}

export function listarTodasEdicoes (filtros: EdicaoFiltros = {}) {
  return listarTodos<Edicao>('/edicoes/', paraQuery(filtros))
}

export const obterEdicao = (id: number | string) => http.get<EdicaoDetalhe>(`/edicoes/${id}/`)
