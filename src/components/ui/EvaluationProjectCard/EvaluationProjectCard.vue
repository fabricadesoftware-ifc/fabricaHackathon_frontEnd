<template>
  <div class="relative flex w-full min-w-0 flex-col gap-4 rounded-md border border-solid border-[#E5E7EB] bg-white px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-5 sm:py-5">
    <div class="flex justify-end sm:absolute sm:right-4 sm:top-4">
      <EvaluationBadge :score="score" :status="status" />
    </div>

    <div class="flex min-w-0 items-start gap-3 sm:max-w-[70%]">
      <div class="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-white shadow-xl">
        <img :alt="name" class="h-full w-full object-cover" :src="avatar">
      </div>

      <div class="min-w-0 flex-1">
        <h2 class="break-words text-lg font-semibold text-[#111827] sm:text-xl">{{ name }}</h2>
        <p class="mt-1 break-words text-sm text-[#4B5563] sm:text-base">{{ description }}</p>

        <p class="mt-2 flex min-w-0 flex-wrap gap-x-2 text-sm text-[#4B5563]">
          <span>Equipe:</span>
          <span class="text-[#111827]">{{ teamName }}</span>
          <span class="break-all text-[#2563EB]">{{ projectUrl }} <span class="mdi mdi-arrow-top-right"></span></span>
        </p>

        <div class="mt-3 flex items-center gap-2 break-words text-sm font-medium text-[#2563EB]">
          <span class="mdi mdi-trophy-outline shrink-0 text-lg"></span>
          <span>{{ editionName }}</span>
        </div>
      </div>
    </div>

  </div>
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
