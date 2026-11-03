<template>
  <header class="border-b border-slate-200 pb-6">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div class="min-w-0 flex-1">
        <h1 class="break-words text-2xl font-semibold leading-tight text-slate-700">{{ name }}</h1>
        <p class="mt-2 text-sm text-slate-600">Equipe <span class="font-medium text-slate-700">{{ teamName }}</span></p>
      </div>

      <EvaluationBadge v-if="status === 'Avaliado'" :score="score" status="Avaliado" />
      <EvaluationBadge v-else status="Pendente" />
    </div>

    <p class="mt-4 max-w-3xl whitespace-pre-line break-words text-sm leading-6 text-slate-600">{{ description }}</p>

    <div class="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
      <span class="inline-flex items-center gap-2"><span aria-hidden="true" class="mdi mdi-calendar-outline" />{{ editionName }}</span>
      <span v-if="projectUrl" class="inline-flex min-w-0 items-center gap-2 break-all text-blue-600"><span aria-hidden="true" class="mdi mdi-open-in-new" />{{ projectUrl }}</span>
    </div>
  </header>
</template>

<script setup lang="ts">
  import EvaluationBadge from '../EvaluationBadge'

  type Status = 'Pendente' | 'Avaliado'

  defineProps<{
    avatar: string
    name: string
    description: string
    teamName: string
    editionName: string
    projectUrl: string
    status: Status
    score: number
  }>()
</script>
