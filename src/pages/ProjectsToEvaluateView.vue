<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import CardGrid from '@/components/layout/CardGrid/CardGrid.vue'
  import AppButton from '@/components/ui/AppButton/AppButton.vue'
  import { AsyncView } from '@/components/ui/AsyncView'
  import EvaluationProjectCardList from '@/components/ui/EvaluationProjectCardList/EvaluationProjectCardList.vue'
  import FilterChipGroup from '@/components/ui/FilterChipGroup/FilterChipGroup.vue'
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

  // Projeto pendente abre o formulário; avaliado também, enquanto a avaliação estiver aberta (ajuste de notas).
  function handleProjectClick (projectId: number) {
    if (!aberta.value) {
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
  <div class="mx-auto w-full px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
    <header class="mb-5 sm:mb-6">
      <h1 class="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
        {{ isAvaliador ? 'Projetos para avaliar' : 'Projetos da edição' }}
      </h1>

      <p v-if="isAvaliador" class="mt-1 text-sm text-gray-500">
        {{ evaluatedCount }} de {{ totalCount }} projetos avaliados
      </p>

      <p v-else class="mt-1 text-sm text-gray-500">
        Visão somente leitura.
      </p>
    </header>

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
        <p v-if="equipesSomenteLeitura.length === 0" class="py-8 text-center text-gray-500">
          Não há equipes cadastradas nesta edição.
        </p>

        <CardGrid v-else :items="equipesSomenteLeitura" />
      </template>

      <!-- Avaliador -->
      <template v-else>
        <div class="mb-5 sm:mb-6">
          <FilterChipGroup v-model="selectedFilter" :options="filterOptions" />
        </div>

        <p v-if="filteredProjects.length === 0" class="py-8 text-center text-gray-500">
          {{ totalCount === 0 ? 'Não há projetos nesta edição.' : 'Nenhum projeto neste filtro.' }}
        </p>

        <div v-else class="flex flex-col gap-3 sm:gap-4">
          <template v-for="item in filteredProjects" :key="item.projeto.id">
            <EvaluationProjectCardList
              v-if="item.concluido"
              :editable="aberta"
              :name="item.projeto.nome_projeto"
              :score="mediaDasNotas(item)"
              status="avaliado"
              :team-name="item.projeto.equipe"
              @click="handleProjectClick(item.projeto.id)"
            />

            <EvaluationProjectCardList
              v-else
              :class="aberta ? 'cursor-pointer' : 'opacity-70'"
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
        icon="←"
        icon-position="left"
        label="Voltar para edições"
        variant="secondary"
        @click="router.push('/avaliacao')"
      />
    </footer>
  </div>
</template>
