<script setup lang="ts">
  import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, useTemplateRef, watch } from 'vue'
  import { RouterLink } from 'vue-router'
  import { useCardReveal } from '@/composables/useCardReveal'

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
  const hasLogo = computed(() => Boolean(props.logo?.trim()) && !logoFailed.value)
  watch(() => props.logo, () => {
    logoFailed.value = false
  })
  const initials = computed(() => props.title.trim().split(/\s+/).slice(0, 2).map(word => word.charAt(0)).join('').toLocaleUpperCase('pt-BR') || 'P')
  const deploy = computed(() => {
    try {
      const url = new URL(props.deployUrl?.trim() ?? '')
      return ['http:', 'https:'].includes(url.protocol) ? url.href : null
    } catch {
      return null
    }
  })

  const info = useTemplateRef<HTMLElement>('info')
  const summary = useTemplateRef<HTMLElement>('summary')
  const context = useTemplateRef<HTMLElement>('context')
  const previewLines = ref(3)
  const hasMore = ref(false)
  let observer: ResizeObserver | undefined

  function measureDescription () {
    if (!info.value || !summary.value) {
      hasMore.value = false
      return
    }
    const lineHeight = Number.parseFloat(getComputedStyle(summary.value).lineHeight)
    const available = info.value.clientHeight - (context.value?.offsetHeight ?? 0) - 12
    previewLines.value = Math.max(1, Math.min(3, Math.floor(available / lineHeight)))
    hasMore.value = summary.value.scrollHeight > previewLines.value * lineHeight + 2
  }
  onMounted(() => {
    observer = new ResizeObserver(measureDescription)
    for (const element of [info.value, summary.value, context.value]) {
      if (element) observer.observe(element)
    }
    measureDescription()
  })
  watch(() => props.description, async () => {
    await nextTick()
    measureDescription()
  })
  onBeforeUnmount(() => observer?.disconnect())

  const descriptionId = useId()
  const { isRevealed, onPointerEnter, onPointerLeave, onFocusIn, onFocusOut, toggleReveal, closeReveal } = useCardReveal()
  watch(isRevealed, revealed => {
    if (!revealed && summary.value) summary.value.scrollTop = 0
  })
</script>

<template>
  <article
    class="project-card"
    :class="{ 'is-revealed': isRevealed, 'has-more': hasMore, 'without-logo': !hasLogo }"
    :style="{ '--project-preview-lines': previewLines }"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
    @keydown.esc="closeReveal"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
  >
    <div class="project-heading">
      <img
        v-if="hasLogo"
        :alt="`Logo de ${props.title}`"
        class="project-logo"
        height="64"
        loading="lazy"
        :src="props.logo"
        width="96"
        @error="logoFailed = true"
      >

      <span v-else aria-hidden="true" class="project-monogram">{{ initials }}</span>

      <div class="project-state">
        <span v-if="props.statusLabel" class="project-status" :data-status="props.status">{{ props.statusLabel }}</span>

        <span v-if="props.notaFinal !== null && props.notaFinal !== undefined" class="project-grade">
          <span aria-hidden="true" class="mdi mdi-star-outline" />Nota final: {{ props.notaFinal }}
        </span>
      </div>
    </div>

    <h3 class="project-title" :title="props.title">{{ props.title }}</h3>

    <div ref="info" class="project-information">
      <p
        v-if="props.description"
        :id="descriptionId"
        ref="summary"
        class="project-description"
        :tabindex="hasMore ? 0 : undefined"
      >{{ props.description }}</p>

      <dl ref="context" class="project-context">
        <div v-if="props.team">
          <dt><span aria-hidden="true" class="mdi mdi-account-group-outline" /><span class="sr-only">Equipe</span></dt>
          <dd>{{ props.team }}</dd>
        </div>

        <div v-if="props.event">
          <dt><span aria-hidden="true" class="mdi mdi-layers-outline" /><span class="sr-only">Edição</span></dt>
          <dd>{{ props.event }}</dd>
        </div>

      </dl>
    </div>

    <div v-if="deploy || hasMore || props.preAvaliacaoTo || props.editavel" class="project-actions">
      <a
        v-if="deploy"
        class="project-deploy"
        :href="deploy"
        rel="noopener noreferrer"
        target="_blank"
      >
        Acessar sistema <span aria-hidden="true" class="mdi mdi-open-in-new" />
      </a>

      <button
        v-if="hasMore"
        :aria-controls="descriptionId"
        :aria-expanded="isRevealed"
        :aria-label="`${isRevealed ? 'Recolher' : 'Ler'} descrição de ${props.title}`"
        class="project-disclosure"
        type="button"
        @click="toggleReveal"
      >
        {{ isRevealed ? 'Recolher' : 'Ler mais' }}
        <span aria-hidden="true" class="mdi mdi-chevron-down" />
      </button>

      <div v-if="props.preAvaliacaoTo || props.editavel" class="project-management">
        <RouterLink v-if="props.preAvaliacaoTo" :to="props.preAvaliacaoTo">
          <span aria-hidden="true" class="mdi mdi-clipboard-text-outline" />Pré-avaliação
        </RouterLink>

        <button v-if="props.editavel" type="button" @click="emit('edit')">
          <span aria-hidden="true" class="mdi mdi-pencil-outline" />Editar
        </button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.project-card {
  position: relative;
  isolation: isolate;
  display: flex;
  width: 100%;
  max-width: 320px;
  min-width: 0;
  min-height: 0;
  aspect-ratio: 4 / 5;
  flex-direction: column;
  align-self: start;
  padding: 1.25rem;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  color: #0f172a;
}
.project-card::before {
  position: absolute;
  z-index: -1;
  inset: 5.5rem 0 0;
  background: #111e2e;
  content: '';
  transform: translateY(101%);
  transition: transform 280ms cubic-bezier(.22, 1, .36, 1);
  pointer-events: none;
}
.project-heading { display: flex; min-height: 64px; flex-shrink: 0; align-items: start; justify-content: space-between; gap: 1rem; margin-bottom: 1rem; }
.project-logo { display: block; width: auto; max-width: 112px; height: 64px; object-fit: contain; object-position: left center; }
.project-monogram { display: flex; min-width: 44px; height: 56px; align-items: center; color: #2563eb; font-size: 1.75rem; font-weight: 500; letter-spacing: -.04em; }
.project-state { display: grid; justify-items: end; gap: .4rem; }
.project-grade { display: inline-flex; align-items: center; gap: .3rem; color: #475569; font-size: .6875rem; line-height: 1.4; }
.project-status { display: inline-flex; max-width: 140px; align-items: center; gap: .35rem; padding-top: .25rem; color: #475569; font-size: .6875rem; line-height: 1.4; }
.project-status::before { width: 5px; height: 5px; flex-shrink: 0; border-radius: 50%; background: #2563eb; content: ''; }
.project-status[data-status="finalizado"]::before { background: #64748b; }
.project-title { margin: 0; color: #0f172a; font-size: 1.375rem; font-weight: 700; line-height: 1.15; letter-spacing: -.025em; overflow-wrap: anywhere; text-wrap: pretty; transition: color 180ms ease; }
.without-logo .project-title { font-size: 1.625rem; }
.project-information { position: relative; min-height: 0; flex: 1; margin-top: .7rem; }
.project-description { position: absolute; inset: 0 0 auto; display: block; max-height: calc(var(--project-preview-lines, 3) * 1.55em); overflow: hidden; margin: 0; color: #475569; font-size: .875rem; line-height: 1.55; overflow-wrap: anywhere; white-space: pre-line; scrollbar-width: thin; scrollbar-color: #94a3b8 transparent; transition: max-height 180ms cubic-bezier(.22, 1, .36, 1), color 180ms ease; }
.project-context { position: absolute; inset: auto 0 0; display: grid; gap: .45rem; margin: 0; transition: opacity 120ms ease 180ms, visibility 0s 180ms; }
.project-context > div { display: grid; grid-template-columns: 18px minmax(0, 1fr); gap: .5rem; align-items: start; }
.project-context dt { color: #64748b; font-size: 1rem; line-height: 1.25; transition: color 180ms ease; }
.project-context dd { margin: 0; color: #334155; font-size: .75rem; line-height: 1.45; overflow-wrap: anywhere; transition: color 180ms ease; }
.project-actions { display: flex; flex-shrink: 0; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: .25rem .5rem; margin-top: .85rem; padding-top: .65rem; border-top: 1px solid #e2e8f0; transition: border-color 200ms ease; }
.project-actions a, .project-actions button { display: inline-flex; min-height: 36px; align-items: center; gap: .4rem; border-radius: 5px; font-size: .75rem; font-weight: 500; line-height: 1.4; text-decoration: none; }
.project-deploy { padding: .45rem .65rem; background: #eff6ff; color: #1d4ed8; }
.project-deploy:hover { background: #dbeafe; }
.project-deploy .mdi { font-size: .875rem; }
.project-disclosure { padding: .45rem .2rem; color: #475569; cursor: pointer; }
.project-disclosure .mdi { font-size: 1rem; transition: transform 240ms ease; }
.project-management { display: flex; width: 100%; flex-wrap: wrap; gap: .25rem 1rem; }
.project-management a, .project-management button { color: #475569; cursor: pointer; }
.project-actions a:focus-visible, .project-actions button:focus-visible, .project-description:focus-visible { outline: 2px solid #2563eb; outline-offset: 3px; }
.project-actions a:hover, .project-actions button:hover { color: #1d4ed8; }
.is-revealed.project-card::before { transform: translateY(0); }
.is-revealed .project-title { color: #fff; transition-delay: 100ms; }
.is-revealed .project-description { color: #e2e8f0; }
.is-revealed .project-context dd { color: #e2e8f0; }
.is-revealed .project-context dt { color: #cbd5e1; }
.is-revealed .project-actions { border-color: #3b4a5d; }
.is-revealed .project-deploy { background: #fff; color: #172331; }
.is-revealed .project-deploy .mdi { color: #2563eb; }
.is-revealed .project-disclosure,
.is-revealed .project-management a,
.is-revealed .project-management button { color: #e2e8f0; }
.is-revealed .project-deploy:hover { background: #dbeafe; }
.is-revealed .project-disclosure:hover,
.is-revealed .project-management a:hover,
.is-revealed .project-management button:hover { color: #bfdbfe; }
.has-more.is-revealed .project-context { opacity: 0; visibility: hidden; transition-delay: 0s, 120ms; }
.has-more.is-revealed .project-description { max-height: 100%; overflow: auto; transition-delay: 120ms; }
.is-revealed .project-disclosure .mdi { transform: rotate(180deg); }
.project-card ::selection { background: #dbeafe; color: #172554; }
@media (max-width: 400px) {
  .project-card { padding: 1rem; }
  .project-card::before { top: 4.75rem; }
  .project-heading { min-height: 56px; margin-bottom: .75rem; }
  .project-logo { max-width: 96px; height: 56px; }
  .project-monogram { height: 48px; }
  .without-logo .project-title { font-size: 1.375rem; }
}
@media (hover: none), (pointer: coarse) {
  .project-actions a, .project-actions button { min-height: 44px; }
}
@media (prefers-reduced-motion: reduce) {
  .project-card::before, .project-title, .project-description, .project-context, .project-context dt, .project-context dd, .project-actions, .project-disclosure .mdi { transition: none; }
}
</style>
