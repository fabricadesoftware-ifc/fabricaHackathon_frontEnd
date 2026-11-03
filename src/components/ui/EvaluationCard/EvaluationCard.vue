<template>
  <button
    class="group w-full cursor-pointer rounded-lg border border-slate-200 bg-white p-4 text-left transition-colors hover:border-blue-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 flex flex-col gap-4"
    type="button"
    @click="emits('click')"
  >
    <div class="flex gap-3">
      <img :alt="props.title" class="w-20 h-20 rounded-lg object-cover shrink-0" :src="props.image">

      <div class="flex flex-col justify-between items-start gap-2 w-full min-w-0">
        <div>
          <h2 class="break-words font-semibold text-slate-700 text-base">{{ props.title }}</h2>
          <p class="text-slate-500 text-sm">Prazo final: {{ props.deadline }}</p>
        </div>

        <StatusSelect
          :label="label"
          :status="props.status"
        />
      </div>
    </div>

    <div class="flex flex-col gap-1">
      <ProgressBar
        v-if="props.total !== undefined"
        :current="props.current ?? 0"
        :label="props.progressLabel ?? ''"
        :total="props.total"
      />

      <div class="flex justify-end">
        <span class="text-xl text-blue-500 group-hover:text-blue-600 mdi mdi-arrow-right" />
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  import ProgressBar from '../ProgressBar'
  import StatusSelect from '../statusSelect.vue'

  type Status = 'inscricoes' | 'avaliacao' | 'andamento' | 'finalizado'

  const props = defineProps<{
    image: string
    title: string
    deadline: string
    /** Sem `total`, a barra de progresso some (visão do professor). */
    current?: number
    total?: number
    progressLabel?: string
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
