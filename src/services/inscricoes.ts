import { http } from '@/services/http'

// Tipos de status das edições
export type StatusEdicao =
  | 'INSCRICAO'
  | 'EM_ANDAMENTO'
  | 'AVALIACAO'
  | 'FINALIZADO'

// Dados enviados para cadastrar uma inscrição
export interface CriarInscricaoPayload {
  edicao: number
  nome_equipe: string
  tema: number
  projeto: {
    nome_projeto: string
    descricao_projeto: string
    link_deploy_projeto?: string
  }
  membros: string[]
}

// Projeto vinculado ao participante
export interface MeuProjeto {
  id: number
  nome_projeto: string
  descricao_projeto: string
  link_deploy_projeto: string | null
  logo_projeto: string | null
  edicao: number
  edicao_status: StatusEdicao
  equipe: {
    id: number
    nome_equipe: string
  }
  nota_final: string | null
}

// Integrante de uma equipe
export interface MembroEquipe {
  id: number
  username: string
  first_name: string
  last_name: string
  email: string
}

// Equipe vinculada ao participante
export interface MinhaEquipe {
  id: number
  nome_equipe: string
  edicao: number
  edicao_status: StatusEdicao
  tema_id: number | null
  tema: string | null
  criador: number | null
  sou_criador: boolean
  membros: MembroEquipe[]
  projeto: MeuProjeto | null
}

// Resposta da inscrição criada
export type InscricaoCriada = MinhaEquipe

// Cadastra uma equipe, projeto e integrantes
export function criarInscricao(payload: CriarInscricaoPayload) {
  return http.post<InscricaoCriada>('/inscricoes/', payload)
}

// Lista as equipes vinculadas ao usuário autenticado
export function listarMinhasEquipes() {
  return http.get<MinhaEquipe[]>('/me/equipes/')
}

// Lista os projetos vinculados ao usuário autenticado
export function listarMeusProjetos() {
  return http.get<MeuProjeto[]>('/me/projetos/')
}

// Dados que podem ser alterados em uma inscrição
export interface EditarInscricaoPayload {
  nome_equipe?: string
  tema?: number
  projeto?: {
    nome_projeto?: string
    descricao_projeto?: string
    link_deploy_projeto?: string
  }
}

// Atualiza uma inscrição existente
export function editarInscricao(
  equipeId: number,
  payload: EditarInscricaoPayload,
) {
  return http.patch<MinhaEquipe>(
    `/inscricoes/${equipeId}/`,
    payload,
  )
}

// Adiciona um integrante pelo e-mail (somente o criador, com a edição em INSCRICAO)
export function adicionarMembro(equipeId: number, email: string) {
  return http.post<MinhaEquipe>(`/inscricoes/${equipeId}/membros/`, {
    membros: [email],
  })
}

// Remove um integrante da equipe (somente o criador)
export function removerMembro(equipeId: number, usuarioId: number) {
  return http.delete<MinhaEquipe>(`/inscricoes/${equipeId}/membros/${usuarioId}/`)
}

// Exclui a inscrição inteira (somente o criador)
export function excluirInscricao(equipeId: number) {
  return http.delete<void>(`/inscricoes/${equipeId}/`)
}

// O próprio integrante sai da equipe
export function sairDaEquipe(equipeId: number) {
  return http.post<void>(`/inscricoes/${equipeId}/sair/`, {})
}

// Envia ou troca a logo do projeto (somente o criador, com a edição em INSCRICAO)
export function enviarLogoProjeto(equipeId: number, arquivo: File) {
  const dados = new FormData()
  dados.append('logo_projeto', arquivo)
  return http.post<MinhaEquipe>(`/inscricoes/${equipeId}/logo/`, dados)
}

// Remove a logo do projeto
export function removerLogoProjeto(equipeId: number) {
  return http.delete<MinhaEquipe>(`/inscricoes/${equipeId}/logo/`)
}
