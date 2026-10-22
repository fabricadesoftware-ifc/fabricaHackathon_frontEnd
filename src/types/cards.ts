import type { EdicaoStatusApi } from './edicao'
import type { Equipe, EquipeProjeto } from './equipe'
import type { Projeto } from './projeto'
import type { ProjectCardItem } from '@/components/layout/CardGrid'

function statusDoProjeto (status?: EdicaoStatusApi): Pick<ProjectCardItem, 'status' | 'statusLabel'> {
  return status === 'FINALIZADO'
    ? { status: 'finalizado', statusLabel: 'Concluído' }
    : { status: 'ativo', statusLabel: 'Em andamento' }
}

/** Projeto da API (GET /projetos/) -> card. `edicao` traz nome e status da edição, se conhecidos. */
export function projetoParaCard (
  p: Projeto,
  edicao?: { nome: string, status: EdicaoStatusApi },
): ProjectCardItem {
  return {
    id: p.id,
    logo: p.logo_projeto ?? '',
    ...statusDoProjeto(edicao?.status),
    description: p.descricao_projeto,
    title: p.nome_projeto,
    team: p.nome_equipe,
    event: edicao?.nome ?? '',
    deployUrl: p.link_deploy_projeto,
  }
}

/** Equipe do detalhe da edição -> card (equipes sem projeto aparecem só com o nome). */
export function equipeParaCard (
  e: Equipe,
  edicao: { nome: string, status: EdicaoStatusApi },
): ProjectCardItem {
  const projeto: EquipeProjeto | null = e.projeto
  return {
    id: projeto?.id ?? `equipe-${e.id}`,
    logo: projeto?.logo_projeto ?? '',
    ...statusDoProjeto(edicao.status),
    description: projeto?.descricao_projeto ?? '',
    title: projeto?.nome_projeto ?? e.nome_equipe,
    team: e.nome_equipe,
    event: edicao.nome,
    deployUrl: projeto?.link_deploy_projeto ?? null,
  }
}
