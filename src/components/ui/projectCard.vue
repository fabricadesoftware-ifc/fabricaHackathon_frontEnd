<script setup lang="ts">
  import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, useTemplateRef, watch } from 'vue'
  import { RouterLink } from 'vue-router'
  import { useCardReveal } from '@/composables/useCardReveal'
  import { resolveMediaUrl } from '@/utils/media'
  import ProjectLogoFallback from './ProjectLogoFallback.vue'
  import StatusProject from './statusProject.vue'

  type Status = 'finalizado' | 'ativo'

  const props = withDefaults(defineProps<{
    title: string
    description: string
    team: string
    event: string
    logo: string
    status: Status
    statusLabel: string
    cover?: string | null
    deployUrl?: string | null
    editavel?: boolean
    preAvaliacaoTo?: string
    notaFinal?: string | null
  }>(), {
    cover: null,
    deployUrl: null,
    editavel: false,
    preAvaliacaoTo: undefined,
    notaFinal: null,
  })

  const emit = defineEmits<{ (e: 'edit'): void }>()
  const logoFailed = ref(false)
  const logoSource = computed(() => resolveMediaUrl(props.logo))
  const hasLogo = computed(() => Boolean(logoSource.value) && !logoFailed.value)
  watch(logoSource, () => {
    logoFailed.value = false
  })
  const deploy = computed(() => {
    try {
      const url = new URL(props.deployUrl?.trim() ?? '')
      return ['http:', 'https:'].includes(url.protocol) ? url.href : null
    } catch {
      return null
    }
  })

  const summary = useTemplateRef<HTMLElement>('summary')
  const hasMore = ref(false)
  let observer: ResizeObserver | undefined
  let measureFrame: number | undefined

  function measureDescription () {
    if (!summary.value) {
      hasMore.value = false
      return
    }
    const lineHeight = Number.parseFloat(getComputedStyle(summary.value).lineHeight)
    hasMore.value = summary.value.scrollHeight > lineHeight * 2 + 2
  }
  function scheduleMeasurement () {
    if (measureFrame !== undefined) cancelAnimationFrame(measureFrame)
    measureFrame = requestAnimationFrame(() => {
      measureFrame = undefined
      measureDescription()
    })
  }
  onMounted(() => {
    observer = new ResizeObserver(scheduleMeasurement)
    if (summary.value) observer.observe(summary.value)
    scheduleMeasurement()
  })
  watch(() => props.description, async () => {
    await nextTick()
    scheduleMeasurement()
  })
  onBeforeUnmount(() => {
    observer?.disconnect()
    if (measureFrame !== undefined) cancelAnimationFrame(measureFrame)
  })

  const descriptionId = useId()
  const { isRevealed, onPointerEnter, onPointerLeave, onFocusIn, onFocusOut, toggleReveal, closeReveal } = useCardReveal()
  const hasActions = computed(() => Boolean(deploy.value || props.preAvaliacaoTo || props.editavel))
  const hasReveal = computed(() => hasActions.value || hasMore.value)
  watch(isRevealed, revealed => {
    if (!revealed && summary.value) summary.value.scrollTop = 0
  })
</script>

<template>
  <article
    class="project-card [@media(max-width:400px)]:min-h-[356px] [@media(max-width:400px)]:p-[1rem] relative flex w-full max-w-[320px] min-w-0 min-h-[360px] aspect-[8_/_9] flex-col self-start overflow-hidden p-[1.25rem] border-[1px] border-app-line rounded-lg bg-app-surface-plain text-app-ink-strong"
    :class="{ 'is-revealed': isRevealed, 'has-more': hasMore, 'has-management': props.preAvaliacaoTo || props.editavel }"
    tabindex="0"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
    @keydown.esc="closeReveal"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
  >
    <StatusProject
      v-if="props.statusLabel"
      class="project-status absolute top-[.85rem] right-[.9rem] max-w-[calc(100%-1.8rem)]"
      :label="props.statusLabel"
      :status="props.status"
      variant="card"
    />

    <div class="project-heading [@media(max-width:400px)]:mt-[2.9rem] flex min-w-0 shrink-0 items-center gap-[.8rem] mt-[2.85rem]">
      <div class="project-mark grid place-items-center border-[1px] border-app-project-logo-surface rounded-[10px] bg-app-project-logo-surface" :class="hasLogo ? 'project-mark--logo flex-[0_0_56px] size-14' : 'flex-[0_0_50px] size-[50px]'">
        <img
          v-if="hasLogo"
          :alt="'Logo de ' + props.title"
          class="project-logo block w-[44px] h-[44px] object-contain"
          height="56"
          loading="lazy"
          :src="logoSource"
          width="56"
          @error="logoFailed = true"
        >

        <ProjectLogoFallback v-else :revealed="isRevealed" />
      </div>

      <div class="project-heading-copy min-w-0">
        <h3 class="project-title [@media(max-width:400px)]:text-[1.125rem] line-clamp-2 overflow-hidden m-0 text-app-ink-strong text-[1.25rem] font-bold leading-[1.18] tracking-[-.025em] [overflow-wrap:anywhere] text-pretty" :title="props.title">{{ props.title }}</h3>

        <span v-if="props.notaFinal !== null && props.notaFinal !== undefined" class="project-grade inline-flex items-center gap-[.3rem] mt-[.3rem] text-app-ink-secondary text-[.6875rem] leading-[1.4]">
          <span aria-hidden="true" class="mdi mdi-star-outline" />Nota final: {{ props.notaFinal }}
        </span>
      </div>
    </div>

    <p
      v-if="props.description"
      :id="descriptionId"
      ref="summary"
      class="project-description min-h-0 max-h-[3.15em] overflow-hidden m-[1.25rem_0_0] text-app-ink-secondary text-[.875rem] leading-[1.55] [overflow-wrap:anywhere] whitespace-pre-line"
      :tabindex="hasMore ? 0 : undefined"
    >{{ props.description }}</p>

    <div class="project-footer flex min-h-0 shrink-0 flex-col mt-auto pt-[.65rem]">
      <dl class="project-context grid gap-2 m-0">

        <div v-if="props.team" class="flex min-w-0 items-center gap-[.65rem]">
          <dt class="inline-flex w-[1.15rem] flex-[0_0_1.15rem] items-center text-app-ink-heading"><span aria-hidden="true" class="mdi mdi-account-group-outline text-[1.15rem] leading-none" /><span class="sr-only">Equipe</span></dt>
          <dd class="min-w-0 overflow-hidden m-0 text-app-ink-strong text-[.8125rem] leading-[1.45] text-ellipsis whitespace-nowrap" :title="props.team">{{ props.team }}</dd>
        </div>

        <div v-if="props.event" class="flex min-w-0 items-center gap-[.65rem]">
          <dt class="inline-flex w-[1.15rem] flex-[0_0_1.15rem] items-center text-app-ink-heading"><span aria-hidden="true" class="mdi mdi-layers-outline text-[1.15rem] leading-none" /><span class="sr-only">Edição</span></dt>
          <dd class="min-w-0 overflow-hidden m-0 text-app-ink-strong text-[.8125rem] leading-[1.45] text-ellipsis whitespace-nowrap" :title="props.event">{{ props.event }}</dd>
        </div>
      </dl>

      <div v-if="hasActions" class="project-actions flex max-h-0 flex-col items-start gap-[.45rem] overflow-hidden mt-0 opacity-0 invisible">
        <a
          v-if="deploy"
          class="project-deploy inline-flex min-h-9 items-center gap-[.45rem] rounded-[6px] text-xs font-medium leading-[1.4] no-underline focus-visible:outline-app-focus-soft hover:bg-app-surface-soft p-[.45rem_.7rem] bg-app-surface-plain text-app-ink-strong"
          :href="deploy"
          rel="noopener noreferrer"
          target="_blank"
        >
          Acessar sistema <span aria-hidden="true" class="mdi mdi-open-in-new text-app-ink-strong text-[.875rem]" />
        </a>

        <div v-if="props.preAvaliacaoTo || props.editavel" class="project-management flex flex-wrap items-center gap-[.1rem_.8rem]">
          <RouterLink v-if="props.preAvaliacaoTo" class="inline-flex min-h-9 items-center gap-[.45rem] rounded-[6px] text-xs font-medium leading-[1.4] no-underline focus-visible:outline-app-focus-soft cursor-pointer text-app-line-foreground hover:text-app-on-brand" :to="props.preAvaliacaoTo">
            <span aria-hidden="true" class="mdi mdi-clipboard-text-outline" />Pré-avaliação
          </RouterLink>

          <button v-if="props.editavel" class="inline-flex min-h-9 items-center gap-[.45rem] rounded-[6px] text-xs font-medium leading-[1.4] no-underline focus-visible:outline-app-focus-soft cursor-pointer text-app-line-foreground hover:text-app-on-brand" type="button" @click="emit('edit')">
            <span aria-hidden="true" class="mdi mdi-pencil-outline" />Editar
          </button>
        </div>
      </div>

      <button
        v-if="hasReveal"
        :aria-controls="props.description ? descriptionId : undefined"
        :aria-expanded="isRevealed"
        :aria-label="(isRevealed ? 'Ocultar' : 'Mostrar') + ' informações e ações de ' + props.title"
        class="project-reveal focus-visible:outline-app-focus-soft hidden"
        type="button"
        @click="toggleReveal"
      >
        {{ isRevealed ? 'Ocultar' : 'Ver mais' }}
        <span aria-hidden="true" class="mdi mdi-chevron-down" />
      </button>
    </div>
  </article>
</template>

<style scoped>
/* Vuetify's unlayered button reset overrides utility fonts and colors. */
.project-management button { font-size: .75rem; font-weight: 500; line-height: 1.4; color: var(--app-line-foreground); }
.project-management button:hover { color: var(--app-on-inverse); }

.project-card {
  transition: background-color 300ms ease-out, border-color 300ms ease-out;
}
.project-card.has-management { min-height: 406px; }
.project-status { transition: background-color 300ms ease-out, color 300ms ease-out; }
.project-mark {
  transition: background-color 300ms ease-out, border-color 300ms ease-out;
}
.project-mark--logo { padding: .3rem; border-color: var(--app-line); background: var(--app-logo-plate); }
.project-title {
  transition: color 300ms ease-out;
}
.project-grade { transition: color 300ms ease-out; }
.project-description {
  scrollbar-width: thin;
  scrollbar-color: var(--app-ink-subtle) transparent;
  transition: color 300ms ease-out, max-height 300ms ease-out;
}
.project-context dt, .project-context dd { transition: color 300ms ease-out; }
.project-actions {
  transform: translateY(8px);
  transition: max-height 300ms ease-out, margin-top 300ms ease-out, opacity 250ms ease-out, transform 300ms ease-out, visibility 0s 300ms;
}
.project-deploy { transition: background-color 200ms ease-out; }
.is-revealed.project-card { border-color: var(--app-project-revealed-surface); background: var(--app-project-revealed-surface); }
.is-revealed .project-status { background: var(--app-ink-heading-surface); color: var(--app-surface-faint-foreground); }
.is-revealed .project-mark { border-color: var(--app-ink-heading); background: var(--app-project-revealed-surface); }
.is-revealed .project-mark--logo { border-color: var(--app-ink-muted); background: var(--app-logo-plate); }
.is-revealed .project-title { color: var(--app-on-inverse); }
.is-revealed .project-grade, .is-revealed .project-description, .is-revealed .project-context dd { color: var(--app-surface-soft-foreground); }
.is-revealed .project-context dt { color: var(--app-line-foreground); }
.is-revealed .project-actions { max-height: 130px; margin-top: 1rem; opacity: 1; transform: translateY(0); visibility: visible; transition-delay: 0s; }
.has-more.is-revealed .project-description { flex: 1; max-height: 100%; overflow: auto; }
.project-card ::selection { background: var(--app-selection-blue); color: var(--app-selection-ink-deep); }
@media (hover: none), (pointer: coarse) {
  .project-reveal { display: inline-flex; min-height: 36px; align-items: center; align-self: flex-end; gap: .25rem; margin-top: .4rem; padding: .2rem 0; color: var(--app-ink-secondary); font-size: .75rem; cursor: pointer; }
  .project-reveal .mdi { font-size: 1rem; transition: transform 300ms ease-out; }
  .is-revealed .project-reveal { color: var(--app-line-foreground); }
  .is-revealed .project-reveal .mdi { transform: rotate(180deg); }
  .project-actions a, .project-actions button { min-height: 44px; }
}
@media (prefers-reduced-motion: reduce) {
  .project-card, .project-status, .project-mark, .project-title, .project-grade, .project-description, .project-context dt, .project-context dd, .project-actions, .project-deploy, .project-reveal .mdi { transition: none; }
}
</style>
