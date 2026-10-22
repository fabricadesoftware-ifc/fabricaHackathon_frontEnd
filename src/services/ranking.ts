import type { RankingItem } from '@/types'
import { http } from './http'

/** Lista simples (sem paginação). Antes de FINALIZADO a API responde 403 (ver `ApiError.isRankingIndisponivel`). */
export function listarRanking (edicaoId: number | string) {
  return http.get<RankingItem[]>(`/edicoes/${edicaoId}/ranking/`)
}
