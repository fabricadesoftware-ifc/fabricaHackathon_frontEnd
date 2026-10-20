export type TipoUsuario =
  | 'PARTICIPANTE'
  | 'AVALIADOR'
  | 'PROFESSOR'
  | 'ADMIN'

export interface SolicitacaoPerfil {
  id: number
  perfil_solicitado: 'AVALIADOR' | 'PROFESSOR'
  status: 'PENDENTE' | 'APROVADA' | 'RECUSADA'
}

export interface Usuario {
  id: number
  username: string
  first_name: string
  last_name: string
  email: string
  tipoUser: TipoUsuario
  foto_perfil: string | null
  solicitacao_perfil: SolicitacaoPerfil | null
}

export interface TokenPair {
  access: string
  refresh: string
}

export interface LoginResponse extends TokenPair {
  id: number
  username: string
  tipoUser: TipoUsuario
}

export interface RegistroPayload {
  first_name: string
  last_name: string
  username?: string
  email: string
  password: string
  perfil_solicitado?: 'AVALIADOR' | 'PROFESSOR'
}

export interface RegistroResponse {
  id: number
  username: string
  first_name: string
  last_name: string
  email: string
}