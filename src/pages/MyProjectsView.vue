<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import AppPagination from '@/components/layout/AppPagination/AppPagination.vue'
import { AsyncView } from '@/components/ui/AsyncView'
import PageHeader from '@/components/ui/PageHeader/PageHeader.vue'
import ProjectCard from '@/components/ui/projectCard.vue'
import ResultsBar from '@/components/ui/ResultsBar/ResultsBar.vue'
import SearchFilterBar from '@/components/ui/SearchFilterBar'
import EditProjectModal from '@/components/layout/EditProjectModal/EditProjectModal.vue'
import { useAsync } from '@/composables/useAsync'
import {
  listarMeusProjetos,
  listarMinhasEquipes,
  editarInscricao,
  enviarLogoProjeto,
  removerLogoProjeto,
} from '@/services/inscricoes'
import { ApiError } from '@/services/http'
import { listarTodasEdicoes, obterEdicao } from '@/services/edicoes'
const PAGE_SIZE = 8

const search = ref('')
const edicaoId = ref('')
const currentPage = ref(1)
// Controle do modal de edição
const modalEditarAberto = ref(false)
const projetoSelecionadoId = ref<number | null>(null)
  const salvandoEdicao = ref(false)
const erroEdicao = ref('')

// Projeto que está sendo editado
const projetoSelecionado = computed(() =>
  projetos.value?.find(
    projeto => projeto.id === projetoSelecionadoId.value,
  ) ?? null,
)
// Busca as edições para montar o filtro e exibir seus nomes
const { data: edicoes } = useAsync(() => listarTodasEdicoes())

const opcoesEdicao = computed(() =>
  (edicoes.value ?? []).map(edicao => ({
    label: edicao.nome,
    value: String(edicao.id),
  })),
)
// Busca as equipes vinculadas ao usuário autenticado.
const {
  data: equipes,
  run: recarregarEquipes,
} = useAsync(() => listarMinhasEquipes())

// Identifica as equipes criadas pelo usuário.
const equipesCriadas = computed(() =>
  new Set(
    (equipes.value ?? [])
      .filter(equipe => equipe.sou_criador)
      .map(equipe => equipe.id),
  ),
)
const edicaoPorId = computed(
  () => new Map((edicoes.value ?? []).map(edicao => [edicao.id, edicao])),
)

// Busca somente os projetos vinculados ao usuário autenticado
const {
  data: projetos,
  loading,
  error,
  run,
} = useAsync(() => listarMeusProjetos())

// Aplica os filtros localmente, pois /me/projetos/ retorna uma lista
const projetosFiltrados = computed(() => {
  const termo = search.value.trim().toLowerCase()

  return (projetos.value ?? []).filter(projeto => {
    const correspondeEdicao =
      !edicaoId.value ||
      projeto.edicao === Number(edicaoId.value)

    const correspondeBusca =
      !termo ||
      projeto.nome_projeto.toLowerCase().includes(termo) ||
      projeto.descricao_projeto.toLowerCase().includes(termo) ||
      projeto.equipe.nome_equipe.toLowerCase().includes(termo) ||
      (edicaoPorId.value.get(projeto.edicao)?.nome.toLowerCase().includes(termo) ?? false)

    return correspondeEdicao && correspondeBusca
  })
})

// Paginação
const total = computed(() => projetosFiltrados.value.length)

const totalPages = computed(() =>
  Math.max(1, Math.ceil(total.value / PAGE_SIZE)),
)

const startIndex = computed(() =>
  (currentPage.value - 1) * PAGE_SIZE,
)

const projetosPaginados = computed(() =>
  projetosFiltrados.value.slice(
    startIndex.value,
    startIndex.value + PAGE_SIZE,
  ),
)

const endIndex = computed(() =>
  startIndex.value + projetosPaginados.value.length,
)

// Converte os projetos para o formato dos cards
const itens = computed(() =>
  projetosPaginados.value.map(projeto => {
    const edicao = edicaoPorId.value.get(projeto.edicao)

    const finalizado = projeto.edicao_status === 'FINALIZADO'

    return {
      id: projeto.id,
      logo: projeto.logo_projeto ?? '',
      title: projeto.nome_projeto,
      description: projeto.descricao_projeto,
      team: projeto.equipe.nome_equipe,
      event: edicao?.nome ?? `Edição ${projeto.edicao}`,
      status: finalizado ? 'finalizado' as const : 'ativo' as const,
      statusLabel: finalizado ? 'Concluído' : 'Em andamento',
      deployUrl: projeto.link_deploy_projeto,
      editavel:
        (projeto.edicao_status === 'INSCRICAO' || projeto.edicao_status === 'EM_ANDAMENTO') &&
        equipesCriadas.value.has(projeto.equipe.id),
      notaFinal: finalizado ? projeto.nota_final : null,
      preAvaliacaoTo:
        projeto.edicao_status === 'INSCRICAO'
          ? undefined
          : `/projetos/${projeto.id}/pre-avaliacao`,
    }
  }),
)

// Volta para a primeira página ao alterar os filtros
watch([search, edicaoId], () => {
  currentPage.value = 1
})

// Ajusta a página caso a quantidade de projetos diminua
watch(totalPages, value => {
  if (currentPage.value > value) {
    currentPage.value = value
  }
})

// Temas da edição do projeto em edição (para escolher o tema depois da inscrição).
const temasEdicao = ref<{ id: number, descricao_tema: string }[]>([])
const temaAtual = computed(() =>
  equipes.value?.find(e => e.id === projetoSelecionado.value?.equipe.id)?.tema_id ?? null,
)

function abrirEdicao(projetoId: number) {
  const projeto = projetos.value?.find(
    p => p.id === projetoId,
  )

  if (!projeto) return

  const podeEditar =
    (projeto.edicao_status === 'INSCRICAO' || projeto.edicao_status === 'EM_ANDAMENTO') &&
    equipesCriadas.value.has(projeto.equipe.id)

  if (!podeEditar) return

  projetoSelecionadoId.value = projetoId
  erroEdicao.value = ''
  temasEdicao.value = []
  modalEditarAberto.value = true
  obterEdicao(projeto.edicao)
    .then(e => { temasEdicao.value = e.temas })
    .catch(() => { /* sem lista de temas, o campo some */ })
}
interface DadosEdicao {
  nome_equipe: string
  nome_projeto: string
  descricao_projeto: string
  tema: number | null
  logo: File | null
  removerLogo: boolean
}

async function salvarEdicao(dados: DadosEdicao) {
  const projeto = projetoSelecionado.value

  if (!projeto || salvandoEdicao.value) return

  const equipe = equipes.value?.find(
    equipe => equipe.id === projeto.equipe.id,
  )

  if (
    !equipe?.sou_criador ||
    !['INSCRICAO', 'EM_ANDAMENTO'].includes(equipe.edicao_status)
  ) {
    erroEdicao.value = 'Você não tem permissão para editar este projeto.'
    return
  }

  salvandoEdicao.value = true
  erroEdicao.value = ''

  try {
    await editarInscricao(equipe.id, {
      // O nome da equipe só pode mudar enquanto as inscrições estão abertas.
      ...(equipe.edicao_status === 'INSCRICAO' && { nome_equipe: dados.nome_equipe }),
      ...(dados.tema !== null && dados.tema !== temaAtual.value && { tema: dados.tema }),

      projeto: {
        nome_projeto: dados.nome_projeto,
        descricao_projeto: dados.descricao_projeto,
      },
    })

    // A logo tem endpoint próprio.
    if (dados.logo) {
      await enviarLogoProjeto(equipe.id, dados.logo)
    } else if (dados.removerLogo && projeto.logo_projeto) {
      await removerLogoProjeto(equipe.id)
    }

    // Fecha o modal após salvar com sucesso.
    modalEditarAberto.value = false
    projetoSelecionadoId.value = null

    // Atualiza os projetos e as equipes.
    await Promise.all([
      run(),
      recarregarEquipes(),
    ])
  } catch (error) {
    if (error instanceof ApiError) {
      const mensagens = Object.values(error.fields).flat()

      erroEdicao.value = mensagens.length
        ? mensagens.join(' ')
        : error.message
    } else {
      erroEdicao.value = 'Não foi possível salvar as alterações.'
    }
  } finally {
    salvandoEdicao.value = false
  }
}
</script>

<template>
  <PageHeader subtitle="Acompanhe os projetos das suas equipes" title="Meus projetos" />

  <div class="w-full min-w-0">
    <SearchFilterBar v-model:search="search" v-model:tipo="edicaoId" :options-tipo="opcoesEdicao"
      appearance="toolbar" tipo-label="Edição" placeholder="Buscar meus projetos ou equipes" />

    <AsyncView
      skeleton="cards" :empty="!loading && !error && itens.length === 0"
      :empty-message="search || edicaoId ? 'Nenhum dos seus projetos corresponde aos critérios informados.' : 'Nenhum projeto encontrado.'"
      :error="error" :loading="loading" @retry="run">
      <ResultsBar :end="endIndex" label="projeto(s)" :start="total ? startIndex + 1 : 0" :total="total" />

      <div class="mt-4 grid grid-cols-[repeat(auto-fill,minmax(min(100%,280px),1fr))] gap-5">
        <ProjectCard v-for="projeto in itens" :key="projeto.id" v-bind="projeto" class="w-full max-w-[360px]" @edit="abrirEdicao(projeto.id)" />
      </div>

      <AppPagination v-if="totalPages > 1" v-model="currentPage" :length="totalPages" />
    </AsyncView>
  </div>
  <EditProjectModal
  v-if="projetoSelecionado"
  v-model="modalEditarAberto"
  :team-name="projetoSelecionado.equipe.nome_equipe"
  :project-name="projetoSelecionado.nome_projeto"
  :description="projetoSelecionado.descricao_projeto"
  :team-name-locked="projetoSelecionado.edicao_status !== 'INSCRICAO'"
  :logo-url="projetoSelecionado.logo_projeto"
  :tema-id="temaAtual"
  :temas="temasEdicao"
  :loading="salvandoEdicao"
  :error="erroEdicao"
  @save="salvarEdicao"
/>
</template>
