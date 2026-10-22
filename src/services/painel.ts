import { http } from './http'

export type StatusApi = 'INSCRICAO' | 'EM_ANDAMENTO' | 'AVALIACAO' | 'FINALIZADO'

export interface PainelEdicaoBase {
  id: number
  nome: string
  ano: number
  descricao: string
  status: StatusApi
  status_label: string
  data_inicio: string
  data_fim: string
  local: string
  responsavel: string
  tipo_edicao: number
  tipo_edicao_nome: string
  minimo_participantes: number
  maximo_participantes: number
  maximo_equipes: number
  pre_avaliacao_liberada: boolean
  prazo_pre_avaliacao: string | null
}

export interface Contagens {
  equipes: number
  maximo_equipes: number
  participantes: number
  avaliadores: number
  criterios: number
  temas: number
  pre_avaliacoes_preenchidas: number
}

export interface PainelEdicaoLista extends PainelEdicaoBase { contagens: Contagens }

export interface AvaliadorProgresso {
  vinculo_id: number
  user_id: number
  nome: string
  email: string
  notas_lancadas: number
  notas_esperadas: number
}

export interface PainelEdicaoResumo extends PainelEdicaoLista {
  criterios: { id: number, nome: string }[]
  temas: { id: number, descricao_tema: string }[]
  avaliadores: AvaliadorProgresso[]
}

export interface PainelEquipe {
  id: number
  nome_equipe: string
  tema: string | null
  criador: string | null
  membros: { id: number, nome: string, email: string }[]
  projeto: {
    id: number
    nome_projeto: string
    descricao_projeto: string
    link_deploy_projeto: string | null
    logo_projeto: string | null
  }
  pre_avaliacao: { preenchida: boolean, nota: string | null }
  nota_final: string | null
}

export interface PainelAvaliador {
  user_id: number
  nome: string
  email: string
  vinculado: boolean
  notas_lancadas: number
}

export interface PainelResultados {
  edicao: { id: number, nome: string, status: StatusApi }
  criterios: { id: number, nome: string }[]
  avaliadores: { user_id: number, nome: string }[]
  resultados: {
    projeto_id: number
    projeto: string
    equipe: string
    por_criterio: { criterio_id: number, criterio: string, media: string | null }[]
    por_avaliador: { user_id: number, nome: string, avaliados: number, de: number, media: string | null }[]
    completo: boolean
    nota_pre_avaliacao: string | null
    nota_final: string | null
    posicao: number | null
  }[]
}

export const ORDEM_STATUS: StatusApi[] = ['INSCRICAO', 'EM_ANDAMENTO', 'AVALIACAO', 'FINALIZADO']
export const ROTULO_STATUS: Record<StatusApi, string> = {
  INSCRICAO: 'Inscrições abertas',
  EM_ANDAMENTO: 'Em andamento',
  AVALIACAO: 'Em avaliação',
  FINALIZADO: 'Finalizada',
}

const base = '/painel/edicoes/'

export const painelListarEdicoes = () => http.get<PainelEdicaoLista[]>(base)
export const painelEdicao = (id: number | string) => http.get<PainelEdicaoResumo>(`${base}${id}/`)
export const painelEquipes = (id: number | string) => http.get<PainelEquipe[]>(`${base}${id}/equipes/`)
export const painelResultados = (id: number | string) => http.get<PainelResultados>(`${base}${id}/resultados/`)
export const painelAvaliadores = (id: number | string) => http.get<PainelAvaliador[]>(`${base}${id}/avaliadores/`)
export function painelVincular (id: number | string, user: number) {
  return http.post(`${base}${id}/avaliadores/`, { user })
}
export function painelDesvincular (id: number | string, user: number) {
  return http.delete(`${base}${id}/avaliadores/${user}/`)
}

export function atualizarEdicao (id: number | string, dados: Record<string, unknown>) {
  return http.patch(`/edicoes/${id}/`, dados)
}
export const criarEdicao = (dados: Record<string, unknown>) => http.post<{ id: number }>('/edicoes/', dados)
export const listarTiposEdicao = () => http.get<{ results?: { id: number, nome: string }[] } | { id: number, nome: string }[]>('/tipos-edicao/')

export const criarCriterio = (edicao: number, nome: string) => http.post('/criterios/', { edicao, nome })
export const removerCriterio = (id: number) => http.delete(`/criterios/${id}/`)
export const criarTema = (edicao: number, descricao_tema: string) => http.post('/temas/', { edicao, descricao_tema })
export const removerTema = (id: number) => http.delete(`/temas/${id}/`)
