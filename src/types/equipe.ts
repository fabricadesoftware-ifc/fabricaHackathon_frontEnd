export interface EquipeProjeto {
  id: number
  nome_projeto: string
  descricao_projeto: string
  link_deploy_projeto: string | null
  /** Ex.: "9.40"; null até a edição ser FINALIZADO. */
  nota_final: string | null
  logo_projeto?: string | null
}

export interface Equipe {
  id: number
  nome_equipe: string
  edicao: number
  tema: string | number | null
  projeto: EquipeProjeto | null
}
