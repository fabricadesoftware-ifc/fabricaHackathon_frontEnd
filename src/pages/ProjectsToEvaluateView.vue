<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import CardGrid from '@/components/layout/CardGrid/CardGrid.vue'
  import AppButton from '@/components/ui/AppButton/AppButton.vue'
  import { AsyncView } from '@/components/ui/AsyncView'
  import EvaluationProjectCardList from '@/components/ui/EvaluationProjectCardList/EvaluationProjectCardList.vue'
  import FilterChipGroup from '@/components/ui/FilterChipGroup/FilterChipGroup.vue'
  import ProgressBar from '@/components/ui/ProgressBar/ProgressBar.vue'
  import { useAsync } from '@/composables/useAsync'
  import { listarMinhasAvaliacoes, obterEdicao } from '@/services'
  import { useAuthStore } from '@/stores/auth'
  import { equipeParaCard } from '@/types'
  import { mediaDasNotas } from '@/utils/avaliacao'

  type FilterType = 'todos' | 'avaliados' | 'pendentes'

  const route = useRoute()
  const router = useRouter()
  const auth = useAuthStore()

  const editionId = computed(() => Number(route.params.editionId))
  const isAvaliador = computed(() => auth.userRole === 'AVALIADOR')
  const selectedFilter = ref<FilterType>('todos')

  // Avaliador: seus projetos e progresso. Professor/admin: detalhe público da edição (somente leitura).
  const { data, loading, error, run } = useAsync(async () => {
    if (!Number.isInteger(editionId.value) || editionId.value <= 0) {
      throw new Error('Edição inválida.')
    }
    if (isAvaliador.value) {
      const todas = await listarMinhasAvaliacoes()
      return { avaliacoes: todas.filter(a => a.edicao === editionId.value), edicao: null }
    }
    return { avaliacoes: [], edicao: await obterEdicao(editionId.value) }
  })

  const projects = computed(() => data.value?.avaliacoes ?? [])
  const aberta = computed(() => projects.value[0]?.avaliacao_aberta ?? false)

  const totalCount = computed(() => projects.value.length)
  const evaluatedCount = computed(() => projects.value.filter(p => p.concluido).length)
  const pendingCount = computed(() => totalCount.value - evaluatedCount.value)

  const filterOptions = computed(() => [
    { label: `Todos (${totalCount.value})`, value: 'todos' },
    { label: `Avaliados (${evaluatedCount.value})`, value: 'avaliados' },
    { label: `Pendentes (${pendingCount.value})`, value: 'pendentes' },
  ])

  const filteredProjects = computed(() => {
    if (selectedFilter.value === 'avaliados') {
      return projects.value.filter(p => p.concluido)
    }
    if (selectedFilter.value === 'pendentes') {
      return projects.value.filter(p => !p.concluido)
    }
    return projects.value
  })

  // Visão do professor/admin: equipes da edição, sem ações.
  const equipesSomenteLeitura = computed(() => {
    const e = data.value?.edicao
    return e ? e.equipes.map(eq => equipeParaCard(eq, { nome: e.nome, status: e.status })) : []
  })

  // Só projetos pendentes podem abrir o formulário, enquanto a avaliação estiver aberta.
  function handleProjectClick (projectId: number) {
    const project = projects.value.find(item => item.projeto.id === projectId)
    if (!aberta.value || !project || project.concluido) {
      return
    }
    router.push(`/avaliacao/${editionId.value}/projeto/${projectId}`)
  }

  watch(editionId, () => {
    selectedFilter.value = 'todos'
    run()
  })
</script>

<template>
  <div class="evaluation-flow w-full min-w-0">
    <nav aria-label="Navegação de avaliações" class="mb-5">
      <RouterLink class="evaluation-back" to="/avaliacao"><span aria-hidden="true" class="mdi mdi-arrow-left" /> Edições para avaliação</RouterLink>
    </nav>

    <header class="mb-5">
      <h1 class="text-xl font-semibold tracking-tight text-slate-700 sm:text-2xl">
        {{ isAvaliador ? 'Projetos para avaliar' : 'Projetos da edição' }}
      </h1>

      <p v-if="isAvaliador" class="mt-1 text-sm text-slate-500">
        Acompanhe o progresso e avalie os projetos pendentes da edição.
      </p>

      <p v-else class="mt-1 text-sm text-slate-500">
        Visão somente leitura.
      </p>
    </header>

    <ProgressBar
      v-if="isAvaliador && !loading && !error && totalCount > 0"
      class="mb-6"
      :current="evaluatedCount"
      heading="Projetos avaliados"
      label="projetos avaliados"
      :total="totalCount"
    />

    <p
      v-if="isAvaliador && !loading && !error && totalCount > 0 && !aberta"
      class="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
      role="status"
    >
      A avaliação desta edição não está aberta. Você só pode lançar ou alterar notas enquanto a edição estiver em "Avaliação".
    </p>

    <AsyncView :error="error" :loading="loading" @retry="run">
      <!-- Professor / admin -->
      <template v-if="!isAvaliador">
        <p v-if="equipesSomenteLeitura.length === 0" class="py-8 text-center text-slate-500">
          Não há equipes cadastradas nesta edição.
        </p>

        <CardGrid v-else :items="equipesSomenteLeitura" />
      </template>

      <!-- Avaliador -->
      <template v-else>
        <div class="evaluation-filters mb-5 border-b border-slate-200 pb-3">
          <FilterChipGroup v-model="selectedFilter" :options="filterOptions" />
        </div>

        <p v-if="filteredProjects.length === 0" class="py-8 text-center text-slate-500">
          {{ totalCount === 0 ? 'Não há projetos nesta edição.' : 'Nenhum projeto neste filtro.' }}
        </p>

        <div v-else class="overflow-hidden rounded-lg border border-slate-200 bg-white divide-y divide-slate-200">
          <template v-for="item in filteredProjects" :key="item.projeto.id">
            <EvaluationProjectCardList
              v-if="item.concluido"
              :name="item.projeto.nome_projeto"
              :score="mediaDasNotas(item)"
              status="avaliado"
              :team-name="item.projeto.equipe"
            />

            <EvaluationProjectCardList
              v-else
              :editable="aberta"
              :name="item.projeto.nome_projeto"
              status="pendente"
              :team-name="item.projeto.equipe"
              @click="handleProjectClick(item.projeto.id)"
            />
          </template>
        </div>
      </template>
    </AsyncView>

    <footer class="mt-6 flex items-center justify-start sm:mt-8">
      <AppButton
        label="Voltar para edições"
        variant="secondary"
        @click="router.push('/avaliacao')"
      />
    </footer>
  </div>
</template>

<style scoped src="./evaluation-flow.css"></style>
