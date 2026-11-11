<template>
  <header class="min-w-0 rounded-lg border border-app-border-default bg-app-surface p-5 sm:p-6">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div class="min-w-0 flex-1">
        <h1 class="break-words text-xl font-semibold leading-snug sm:text-2xl text-app-text-body-strong">{{ name }}</h1>
        <p class="mt-2 text-sm text-app-text-secondary">Equipe: <span class="font-medium text-app-text-body-strong">{{ teamName }}</span></p>
      </div>

      <EvaluationBadge v-if="status === 'Avaliado'" :score="score" status="Avaliado" />
      <EvaluationBadge v-else status="Pendente" />
    </div>

    <p class="mt-4 max-w-3xl whitespace-pre-line break-words text-sm leading-6 text-app-text-secondary">{{ description }}</p>

    <div class="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-app-border-soft pt-4 text-sm text-app-text-muted">
      <span class="inline-flex items-center gap-2"><span aria-hidden="true" class="mdi mdi-calendar-outline" />{{ editionName }}</span>
      <span v-if="projectUrl" class="inline-flex min-w-0 items-center gap-2 break-all text-app-link"><span aria-hidden="true" class="mdi mdi-open-in-new" />{{ projectUrl }}</span>
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
