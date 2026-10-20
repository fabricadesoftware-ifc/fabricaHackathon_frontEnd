export interface Projeto {
  id: number
  nome_projeto: string
  descricao_projeto: string
  link_deploy_projeto: string | null
  edicao: number
  nome_equipe: string
  /** Ex.: "9.40"; null até a edição ser FINALIZADO. */
  nota_final: string | null
  logo_projeto?: string | null
}
