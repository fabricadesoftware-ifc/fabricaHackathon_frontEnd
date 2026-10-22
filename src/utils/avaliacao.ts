import type { MinhaAvaliacao } from '@/types'

/** Média das notas já lançadas (0 se nenhuma). */
export function mediaDasNotas (a: MinhaAvaliacao): number {
  const notas = a.criterios_avaliados.map(c => Number(c.nota))
  return notas.length > 0 ? notas.reduce((soma, n) => soma + n, 0) / notas.length : 0
}

export interface EdicaoAvaliacao {
  id: number
  nome: string
  status: MinhaAvaliacao['edicao_status']
  aberta: boolean
  avaliados: number
  total: number
}

/** Agrupa os itens de /me/avaliacoes/ por edição, com o progresso do avaliador. */
export function agruparPorEdicao (itens: MinhaAvaliacao[]): EdicaoAvaliacao[] {
  const mapa = new Map<number, EdicaoAvaliacao>()
  for (const item of itens) {
    const atual = mapa.get(item.edicao) ?? {
      id: item.edicao,
      nome: item.edicao_nome,
      status: item.edicao_status,
      aberta: item.avaliacao_aberta,
      avaliados: 0,
      total: 0,
    }
    atual.total += 1
    if (item.concluido) {
      atual.avaliados += 1
    }
    mapa.set(item.edicao, atual)
  }
  return [...mapa.values()]
}
