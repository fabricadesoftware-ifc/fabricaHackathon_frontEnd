<template>
  <div
    class="group hover:-translate-y-0.5 transition-all duration-300 w-full cursor-pointer p-3 flex flex-col gap-4 rounded-lg border border-gray-200 hover:border-gray-300"
    @click="emits('click')"
  >
    <div class="flex gap-3">
      <img :alt="props.title" class="w-28 h-28 rounded-lg object-cover shrink-0" :src="props.image">

      <div class="flex flex-col justify-between items-start gap-2 pt-2 w-full lg:flex-row lg:items-start">
        <div>
          <h4 class="text-gray-900 text-base">{{ props.title }}</h4>
          <p class="text-gray-600 text-sm">prazo final {{ props.deadline }}</p>
        </div>

        <StatusSelect
          :label="label"
          :status="props.status"
        />
      </div>
    </div>

    <div class="flex flex-col gap-1">
      <ProgressBar
        :current="props.current"
        :label="props.progressLabel"
        :total="props.total"
      />

      <div class="flex justify-end">
        <span class="text-xl text-blue-500 group-hover:text-blue-600 mdi mdi-arrow-right" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  import ProgressBar from '../ProgressBar'
  import StatusSelect from '../StatusSelect.vue'

  type Status = 'inscricoes' | 'avaliacao' | 'andamento' | 'finalizado'

  const props = defineProps<{
    image: string
    title: string
    deadline: string
    current: number
    total: number
    progressLabel: string
    status: Status
  }>()

  const emits = defineEmits<{
    (e: 'click'): void
  }>()

  const STATUS_LABELS: Record<Status, string> = {
    inscricoes: 'Inscrições',
    avaliacao: 'Avaliação',
    andamento: 'Andamento',
    finalizado: 'Finalizado',
  }

  const label = computed(() => STATUS_LABELS[props.status])
</script>