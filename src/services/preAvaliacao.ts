import type { PreAvaliacao, PreAvaliacaoPayload } from '@/types'
import { http } from './http'

const caminho = (projetoId: number | string) => `/me/projetos/${projetoId}/pre-avaliacao/`

export function obterPreAvaliacao (projetoId: number | string) {
  return http.get<PreAvaliacao>(caminho(projetoId))
}

/**
 * Salva parcialmente. Com arquivo novo usa multipart (e `responsabilidades` vai como string JSON);
 * sem arquivo, JSON puro.
 */
export function salvarPreAvaliacao (projetoId: number | string, dados: PreAvaliacaoPayload) {
  const temArquivo = Object.values(dados).some(valor => valor instanceof File)
  if (!temArquivo) {
    return http.patch<PreAvaliacao>(caminho(projetoId), dados)
  }

  const form = new FormData()
  for (const [campo, valor] of Object.entries(dados)) {
    if (valor === undefined) {
      continue
    }
    if (valor instanceof File) {
      form.append(campo, valor)
    } else if (campo === 'responsabilidades') {
      form.append(campo, JSON.stringify(valor))
    } else {
      form.append(campo, String(valor))
    }
  }
  return http.patch<PreAvaliacao>(caminho(projetoId), form)
}
