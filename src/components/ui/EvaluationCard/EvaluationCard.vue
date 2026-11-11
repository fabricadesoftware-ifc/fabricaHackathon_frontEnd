<template>
  <button
    class="edition-card group flex h-full w-full min-w-0 cursor-pointer flex-col rounded-lg border border-app-border-default bg-app-surface p-4 text-left transition-colors hover:border-app-brand-border-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-focus"
    type="button"
    @click="emits('click')"
  >
    <div class="edition-details grid min-w-0 grid-cols-[80px_minmax(0,1fr)] items-stretch gap-3 pb-4">
      <div class="relative min-h-20 overflow-hidden rounded-lg bg-app-surface-muted">
        <img alt="" class="absolute inset-0 size-full object-cover" :src="props.image">
      </div>

      <div class="min-w-0">
        <h2 class="break-words text-sm font-semibold leading-5 text-app-text-body-strong">{{ props.title }}</h2>

        <StatusSelect
          class="edition-status mt-1"
          :data-status="props.status"
          :label="label"
          :status="props.status"
          variant="evaluation"
        />

        <p class="mt-1 flex items-start gap-1.5 text-xs leading-4 text-app-text-muted">
          <span aria-hidden="true" class="mdi mdi-calendar-outline shrink-0 text-sm" />
          <span>Prazo final: {{ props.deadline }}</span>
        </p>
      </div>
    </div>

    <div class="mt-auto w-full border-t border-app-border-soft pt-4">
      <ProgressBar
        v-if="props.total !== undefined"
        :current="props.current ?? 0"
        heading="Progresso da avaliação"
        :label="props.progressLabel ?? 'projetos avaliados'"
        :total="props.total"
      />

      <span class="flex items-center justify-end gap-2 text-sm font-medium text-app-link" :class="{ 'mt-4': props.total !== undefined }">
        {{ actionLabel }}
        <span aria-hidden="true" class="mdi mdi-arrow-right text-base transition-transform group-hover:translate-x-0.5" />
      </span>
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
  const actionLabel = computed(() => {
    if (props.total === undefined || props.total === 0 || props.status !== 'avaliacao') {
      return 'Ver projetos'
    }
    if ((props.current ?? 0) >= props.total) {
      return 'Revisar avaliações'
    }
    return (props.current ?? 0) > 0 ? 'Continuar avaliação' : 'Iniciar avaliação'
  })
</script>

<style scoped>
@media (prefers-reduced-motion: reduce) {
  .edition-card,
  .edition-card :deep(*) {
    transition: none;
  }
}
</style>
