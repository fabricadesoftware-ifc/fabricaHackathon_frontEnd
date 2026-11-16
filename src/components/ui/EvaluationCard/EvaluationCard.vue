<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { useCardReveal } from '@/composables/useCardReveal'
  import { resolveMediaUrl } from '@/utils/media'
  import ProgressBar from '../ProgressBar'

  type Status = 'inscricoes' | 'avaliacao' | 'andamento' | 'finalizado'

  const props = defineProps<{
    image: string
    title: string
    deadline: string
    startDate?: string
    location?: string
    projectCount?: number
    /** Sem os dados do avaliador, a barra de progresso não é exibida. */
    current?: number
    total?: number
    progressLabel?: string
    status: Status
  }>()

  const emits = defineEmits<{
    (e: 'click'): void
  }>()

  const { isRevealed, onPointerEnter, onPointerLeave, onFocusIn, onFocusOut, closeReveal } = useCardReveal()
  const imageFailed = ref(false)
  const imageSource = computed(() => resolveMediaUrl(props.image))
  watch(imageSource, () => {
    imageFailed.value = false
  })
  const dateRange = computed(() => [props.startDate, props.deadline]
    .filter((date, index, dates) => date && dates.indexOf(date) === index)
    .join(' – '))
  const hasProgress = computed(() => props.current !== undefined && props.total !== undefined)

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

<template>
  <button
    class="evaluation-card group/evaluation relative isolate flex aspect-[4/5] min-h-[390px] w-full min-w-0 overflow-hidden rounded-lg border-0 bg-app-cover-fallback text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-focus-ring"
    :class="{ 'is-revealed': isRevealed }"
    type="button"
    @click="emits('click')"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
    @keydown.esc="closeReveal"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
  >
    <img
      v-if="imageSource && !imageFailed"
      alt=""
      class="pointer-events-none absolute inset-0 size-full object-cover"
      loading="lazy"
      :src="imageSource"
      @error="imageFailed = true"
    >

    <span v-else aria-hidden="true" class="mdi mdi-image-outline pointer-events-none absolute inset-x-0 top-1/4 text-center text-4xl text-app-surface-faint-foreground/50" />
    <span aria-hidden="true" class="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(var(--app-edition-shade)/72%)_0%,rgb(var(--app-edition-shade)/38%)_30%,rgb(var(--app-edition-shade)/56%)_55%,rgb(var(--app-edition-shade)/95%)_100%)]" />
    <span aria-hidden="true" class="evaluation-hover-shade pointer-events-none absolute inset-0 bg-[rgb(var(--app-edition-shade)/65%)] opacity-[0] transition-opacity duration-[320ms] ease-[ease] group-[.is-revealed]/evaluation:opacity-100 motion-reduce:transition-none [@media(hover:none)]:opacity-45 [@media(pointer:coarse)]:opacity-45" />

    <div class="relative flex min-h-full w-full min-w-0 flex-1 flex-col p-4 text-app-on-brand">
      <p v-if="dateRange" class="flex items-start gap-2 text-xs font-medium leading-5">
        <span aria-hidden="true" class="mdi mdi-calendar-outline shrink-0 text-base" />
        {{ dateRange }}
      </p>

      <div class="mt-auto min-w-0 pt-4">
        <h2 class="line-clamp-3 break-words text-[clamp(1.375rem,2vw,1.75rem)] font-bold leading-tight tracking-tight" :title="props.title">{{ props.title }}</h2>

        <p v-if="props.location" class="mt-2 flex items-start gap-2 text-sm leading-5 opacity-85">
          <span aria-hidden="true" class="mdi mdi-map-marker-outline shrink-0 text-base" />
          <span class="line-clamp-2 break-words" :title="props.location">{{ props.location }}</span>
        </p>

        <ProgressBar
          v-if="hasProgress"
          class="mt-3 text-inherit [&_span]:text-inherit"
          :current="props.current!"
          heading="Progresso da avaliação"
          :label="props.progressLabel ?? 'projetos avaliados'"
          :total="props.total!"
        />

        <div class="grid grid-rows-[0fr] opacity-[0] transition-[grid-template-rows,opacity] duration-300 group-[.is-revealed]/evaluation:grid-rows-[1fr] group-[.is-revealed]/evaluation:opacity-100 motion-reduce:transition-none [@media(hover:none)]:grid-rows-[1fr] [@media(hover:none)]:opacity-100 [@media(pointer:coarse)]:grid-rows-[1fr] [@media(pointer:coarse)]:opacity-100">
          <div class="min-h-0 overflow-hidden">
            <dl class="grid gap-1 pt-3 text-xs leading-5">
              <div v-if="props.deadline" class="flex flex-wrap justify-between gap-x-3">
                <dt class="opacity-85">Prazo final</dt>
                <dd class="font-medium">{{ props.deadline }}</dd>
              </div>

              <div class="flex flex-wrap justify-between gap-x-3">
                <dt class="opacity-85">Inscrições</dt>
                <dd class="font-medium">{{ props.status === 'inscricoes' ? 'Abertas' : 'Encerradas' }}</dd>
              </div>

              <div v-if="props.projectCount !== undefined" class="flex flex-wrap justify-between gap-x-3">
                <dt class="opacity-85">Projetos cadastrados</dt>
                <dd class="font-medium">{{ props.projectCount }}</dd>
              </div>
            </dl>

            <span class="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-app-surface-plain px-3 py-2 text-sm font-medium text-app-ink-on-control">
              {{ actionLabel }}
              <span aria-hidden="true" class="mdi mdi-arrow-right text-app-brand-text text-base" />
            </span>
          </div>
        </div>
      </div>
    </div>
  </button>
</template>
