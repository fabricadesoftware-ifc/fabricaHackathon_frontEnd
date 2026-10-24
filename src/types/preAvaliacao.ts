export interface OpcaoPreAvaliacao {
  valor: string
  rotulo: string
}

export interface Integrante {
  id: number
  nome: string
}

export interface Responsabilidade {
  user: number
  area: string
}

/** `detalhe_pontuacao`: vem vazio ({}) até a primeira gravação. */
export interface DetalhePontuacao {
  total?: string
  respondeu?: boolean
}

/** Resposta de GET/PATCH /me/projetos/{id}/pre-avaliacao/. */
export interface PreAvaliacao {
  projeto: number
  edicao: number
  aberta: boolean
  motivo_fechada: string
  liberada: boolean
  /** Só o criador da equipe responde; os demais integrantes apenas visualizam. */
  pode_editar: boolean
  prazo: string | null
  preenchida: boolean
  integrantes: Integrante[]
  opcoes: {
    organizacao_metodo: OpcaoPreAvaliacao[]
    hospedagem_plataforma: OpcaoPreAvaliacao[]
    banco_plataforma: OpcaoPreAvaliacao[]
  }
  responsabilidades: Responsabilidade[]
  organizacao_metodo: string
  organizacao_link: string
  problema_entendido: string
  problema_explicacao: string
  maior_dificuldade: string
  proximos_passos: string
  arquivo_rfs_rnfs: string | null
  arquitetura_arquivo: string | null
  arquitetura_link: string
  hospedagem_plataforma: string
  hospedagem_link: string
  hospedagem_justificativa: string
  banco_plataforma: string
  banco_justificativa: string
  /** Ex.: "7.50" (somente leitura). */
  nota: string
  detalhe_pontuacao: DetalhePontuacao
  atualizada_em: string | null
}

export const CAMPOS_TEXTO = [
  'organizacao_metodo',
  'organizacao_link',
  'problema_entendido',
  'problema_explicacao',
  'maior_dificuldade',
  'proximos_passos',
  'arquitetura_link',
  'hospedagem_plataforma',
  'hospedagem_link',
  'hospedagem_justificativa',
  'banco_plataforma',
  'banco_justificativa',
] as const

export type CampoTexto = (typeof CAMPOS_TEXTO)[number]

export const CAMPOS_ARQUIVO = ['arquivo_rfs_rnfs', 'arquitetura_arquivo'] as const

export type CampoArquivo = (typeof CAMPOS_ARQUIVO)[number]

/** Dados enviados no PATCH (parcial). Arquivos só entram quando o usuário escolheu um novo. */
export type PreAvaliacaoPayload = Partial<Record<CampoTexto, string>> & {
  responsabilidades?: Responsabilidade[]
} & Partial<Record<CampoArquivo, File>>
