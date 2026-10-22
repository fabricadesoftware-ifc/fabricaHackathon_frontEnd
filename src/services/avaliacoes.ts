import type { MinhaAvaliacao, Nota, NotaCriterio } from '@/types'
import { http } from './http'

/** Projetos das edições do avaliador logado (lista sem paginação; `403` para outros perfis). */
export const listarMinhasAvaliacoes = () => http.get<MinhaAvaliacao[]>('/me/avaliacoes/')

/** Lança várias notas de um projeto de uma vez (atômico). Só critérios ainda não avaliados. */
export function lancarNotasLote (projeto: number, notas: NotaCriterio[]) {
  return http.post<Nota[]>('/notas/lote/', { projeto, notas })
}

/** Altera uma nota já lançada (só com a edição em AVALIACAO). */
export function atualizarNota (notaId: number, nota: number | string, comentario_nota?: string) {
  return http.patch<Nota>(`/notas/${notaId}/`, {
    nota,
    ...(comentario_nota !== undefined && { comentario_nota }),
  })
}
