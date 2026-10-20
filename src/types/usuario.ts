export interface Usuario {
  id: number
  email: string
  nome?: string
}

export interface TokenPair {
  access: string
  refresh: string
}
