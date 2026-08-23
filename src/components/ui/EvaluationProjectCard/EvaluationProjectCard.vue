<template>
  <div class="flex justify-between items-start px-5 py-5 w-full bg-white border-1 rounded-md border-solid border-[#E5E7EB]">
    <div class="max-w-[70%] flex flex-col gap-4">
        <div class="w-12 shadow-xl h-12 bg-white rounded-full border border-gray-200 overflow-hidden flex items-center justify-center">
          <img :alt="name" class="" :src="avatar">
        </div>

      <div>
        <h2 class="font-semibold text-[20px] text-[#111827]">{{ name }}</h2>
      <p class="text-[16px] text-[#4B5563]">{{ description }}</p>

      <p class="font-[16px] text-[#4B5563] flex gap-2">
        Equipe: <span class="flex gap-2"><span class="text-[#111827]">{{ teamName }}</span> <span class="text-[#2563EB] font-[14px]">{{ projectUrl }} <span class="mdi mdi-arrow-top-right"></span></span></span>
      </p>
      </div>

      <div class="flex items-center gap-2 text-[14px] text-[#2563EB] font-medium">
        <span class="mdi mdi-trophy-outline text-lg"></span>
        <span>{{ editionName }}</span>
      </div>
    </div>

    <EvaluationBadge
      :score="score"
      :status="status"
    />
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
