import type { PageParams, Paginated } from '@/types'
import { http } from './http'

const MAX_PAGE_SIZE = 100

type Query = Record<string, string | number | boolean | null | undefined>

/** Busca uma página e devolve só `results`. */
export async function listar<T> (path: string, params: Query & PageParams = {}): Promise<T[]> {
  const page = await http.get<Paginated<T>>(path, params)
  return page.results
}

/** Percorre todas as páginas (seguindo `next`) e devolve todos os itens. */
export async function listarTodos<T> (path: string, params: Query = {}): Promise<T[]> {
  const items: T[] = []
  let page = await http.get<Paginated<T>>(path, { ...params, page_size: MAX_PAGE_SIZE })
  items.push(...page.results)
  while (page.next) {
    page = await http.get<Paginated<T>>(page.next)
    items.push(...page.results)
  }
  return items
}
