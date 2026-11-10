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
  const logoSource = computed(() => {
    const source = props.logo?.trim() ?? ''
    if (!source || /^(https?:|data:|blob:|\/\/)/i.test(source) || source.startsWith('/images/')) return source

    const apiUrl = (window as unknown as { __APP_CONFIG__?: { API_URL?: string } }).__APP_CONFIG__?.API_URL
      || import.meta.env.VITE_API_URL

    try {
      return new URL(source, apiUrl).href
    } catch {
      return source
    }
  })
  const hasLogo = computed(() => Boolean(logoSource.value) && !logoFailed.value)
  watch(logoSource, () => {
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
    class="project-card"
    :class="{ 'is-revealed': isRevealed, 'has-more': hasMore, 'has-management': props.preAvaliacaoTo || props.editavel }"
    tabindex="0"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
    @keydown.esc="closeReveal"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
  >
    <span v-if="props.statusLabel" class="project-status" :data-status="props.status">{{ props.statusLabel }}</span>

    <div class="project-heading">
      <div class="project-mark" :class="{ 'project-mark--logo': hasLogo }">
        <img
          v-if="hasLogo"
          :alt="'Logo de ' + props.title"
          class="project-logo"
          height="56"
          loading="lazy"
          :src="logoSource"
          width="56"
          @error="logoFailed = true"
        >

        <span v-else aria-hidden="true" class="project-monogram">{{ initials.charAt(0) }}<span>{{ initials.slice(1) }}</span></span>
      </div>

      <div class="project-heading-copy">
        <h3 class="project-title" :title="props.title">{{ props.title }}</h3>

        <span v-if="props.notaFinal !== null && props.notaFinal !== undefined" class="project-grade">
          <span aria-hidden="true" class="mdi mdi-star-outline" />Nota final: {{ props.notaFinal }}
        </span>
      </div>
    </div>

    <p
      v-if="props.description"
      :id="descriptionId"
      ref="summary"
      class="project-description"
      :tabindex="hasMore ? 0 : undefined"
    >{{ props.description }}</p>

    <div class="project-footer">
      <dl class="project-context">
        <div v-if="props.team">
          <dt><span aria-hidden="true" class="mdi mdi-account-group-outline" /><span class="sr-only">Equipe</span></dt>
          <dd :title="props.team">{{ props.team }}</dd>
        </div>

        <div v-if="props.event">
          <dt><span aria-hidden="true" class="mdi mdi-layers-outline" /><span class="sr-only">Edição</span></dt>
          <dd :title="props.event">{{ props.event }}</dd>
        </div>
      </dl>

      <div v-if="hasActions" class="project-actions">
        <a
          v-if="deploy"
          class="project-deploy"
          :href="deploy"
          rel="noopener noreferrer"
          target="_blank"
        >
          Acessar sistema <span aria-hidden="true" class="mdi mdi-open-in-new" />
        </a>

        <div v-if="props.preAvaliacaoTo || props.editavel" class="project-management">
          <RouterLink v-if="props.preAvaliacaoTo" :to="props.preAvaliacaoTo">
            <span aria-hidden="true" class="mdi mdi-clipboard-text-outline" />Pré-avaliação
          </RouterLink>

          <button v-if="props.editavel" type="button" @click="emit('edit')">
            <span aria-hidden="true" class="mdi mdi-pencil-outline" />Editar
          </button>
        </div>
      </div>

      <button
        v-if="hasReveal"
        :aria-controls="props.description ? descriptionId : undefined"
        :aria-expanded="isRevealed"
        :aria-label="(isRevealed ? 'Ocultar' : 'Mostrar') + ' informações e ações de ' + props.title"
        class="project-reveal"
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
.project-card {
  position: relative;
  display: flex;
  width: 100%;
  max-width: 320px;
  min-width: 0;
  min-height: 384px;
  aspect-ratio: 5 / 6;
  flex-direction: column;
  align-self: start;
  overflow: hidden;
  padding: 1.25rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  color: #0f172a;
  transition: background-color 300ms ease-out, border-color 300ms ease-out;
}
.project-card.has-management { min-height: 430px; }
.project-card:focus-visible { outline: 2px solid #2563eb; outline-offset: 2px; }
.project-status {
  position: absolute;
  top: .85rem;
  right: .9rem;
  display: inline-flex;
  max-width: calc(100% - 1.8rem);
  align-items: center;
  gap: .45rem;
  padding: .25rem .5rem;
  border-radius: 999px;
  background: transparent;
  color: #334155;
  font-size: .6875rem;
  font-weight: 500;
  line-height: 1.4;
  white-space: nowrap;
  transition: background-color 300ms ease-out, color 300ms ease-out;
}
.project-status::before { width: 7px; height: 7px; flex-shrink: 0; border-radius: 50%; background: #2563eb; content: ''; }
.project-status[data-status="finalizado"]::before { background: #94a3b8; }
.project-heading {
  display: flex;
  min-width: 0;
  flex-shrink: 0;
  align-items: center;
  gap: .8rem;
  margin-top: 2.85rem;
}
.project-mark {
  display: grid;
  width: 56px;
  height: 56px;
  flex: 0 0 56px;
  place-items: center;
  border: 1px solid #172331;
  border-radius: 10px;
  background: #172331;
  transition: background-color 300ms ease-out, border-color 300ms ease-out;
}
.project-mark--logo { padding: .3rem; border-color: #e2e8f0; background: #fff; }
.project-logo { display: block; width: 44px; height: 44px; object-fit: contain; }
.project-monogram { color: #fff; font-size: 1.45rem; font-weight: 700; letter-spacing: -.05em; }
.project-monogram span { color: #2563eb; }
.project-heading-copy { min-width: 0; }
.project-title {
  display: -webkit-box;
  overflow: hidden;
  margin: 0;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  color: #0f172a;
  font-size: 1.375rem;
  font-weight: 700;
  line-height: 1.18;
  letter-spacing: -.025em;
  overflow-wrap: anywhere;
  text-wrap: pretty;
  transition: color 300ms ease-out;
}
.project-grade { display: inline-flex; align-items: center; gap: .3rem; margin-top: .3rem; color: #475569; font-size: .6875rem; line-height: 1.4; transition: color 300ms ease-out; }
.project-description {
  min-height: 0;
  max-height: 3.15em;
  overflow: hidden;
  margin: 1.25rem 0 0;
  color: #475569;
  font-size: .875rem;
  line-height: 1.55;
  overflow-wrap: anywhere;
  white-space: pre-line;
  scrollbar-width: thin;
  scrollbar-color: #94a3b8 transparent;
  transition: color 300ms ease-out, max-height 300ms ease-out;
}
.project-description:focus-visible { outline: 2px solid #2563eb; outline-offset: 2px; }
.project-footer { display: flex; min-height: 0; flex-shrink: 0; flex-direction: column; margin-top: auto; padding-top: .65rem; }
.project-context { display: grid; gap: .5rem; margin: 0; }
.project-context > div { display: flex; min-width: 0; align-items: center; gap: .65rem; }
.project-context dt { display: inline-flex; width: 1.15rem; flex: 0 0 1.15rem; align-items: center; color: #334155; transition: color 300ms ease-out; }
.project-context dt .mdi { font-size: 1.15rem; line-height: 1; }
.project-context dd { min-width: 0; overflow: hidden; margin: 0; color: #0f172a; font-size: .8125rem; line-height: 1.45; text-overflow: ellipsis; white-space: nowrap; transition: color 300ms ease-out; }
.project-actions {
  display: flex;
  max-height: 0;
  flex-direction: column;
  align-items: flex-start;
  gap: .45rem;
  overflow: hidden;
  margin-top: 0;
  opacity: 0;
  transform: translateY(8px);
  visibility: hidden;
  transition: max-height 300ms ease-out, margin-top 300ms ease-out, opacity 250ms ease-out, transform 300ms ease-out, visibility 0s 300ms;
}
.project-actions a, .project-actions button { display: inline-flex; min-height: 36px; align-items: center; gap: .45rem; border-radius: 6px; font-size: .75rem; font-weight: 500; line-height: 1.4; text-decoration: none; }
.project-deploy { padding: .45rem .7rem; background: #fff; color: #0f172a; transition: background-color 200ms ease-out; }
.project-deploy .mdi { color: #0f172a; font-size: .875rem; }
.project-deploy:hover { background: #f1f5f9; }
.project-management { display: flex; flex-wrap: wrap; align-items: center; gap: .1rem .8rem; }
.project-management a, .project-management button { color: #e2e8f0; cursor: pointer; }
.project-management a:hover, .project-management button:hover { color: #fff; }
.project-actions a:focus-visible, .project-actions button:focus-visible, .project-reveal:focus-visible { outline: 2px solid #93c5fd; outline-offset: 2px; }
.project-reveal { display: none; }
.is-revealed.project-card { border-color: #172331; background: #172331; }
.is-revealed .project-status { background: #334155; color: #f8fafc; }
.is-revealed .project-mark { border-color: #334155; background: #334155; }
.is-revealed .project-mark--logo { border-color: #64748b; background: #fff; }
.is-revealed .project-title { color: #fff; }
.is-revealed .project-grade, .is-revealed .project-description, .is-revealed .project-context dd { color: #f1f5f9; }
.is-revealed .project-context dt { color: #e2e8f0; }
.is-revealed .project-actions { max-height: 130px; margin-top: 1rem; opacity: 1; transform: translateY(0); visibility: visible; transition-delay: 0s; }
.has-more.is-revealed .project-description { flex: 1; max-height: 100%; overflow: auto; }
.project-card ::selection { background: #dbeafe; color: #172554; }
@media (max-width: 400px) {
  .project-card { min-height: 380px; padding: 1rem; }
  .project-card.has-management { min-height: 430px; }
  .project-heading { margin-top: 2.9rem; }
  .project-title { font-size: 1.25rem; }
}
@media (hover: none), (pointer: coarse) {
  .project-reveal { display: inline-flex; min-height: 36px; align-items: center; align-self: flex-end; gap: .25rem; margin-top: .4rem; padding: .2rem 0; color: #475569; font-size: .75rem; cursor: pointer; }
  .project-reveal .mdi { font-size: 1rem; transition: transform 300ms ease-out; }
  .is-revealed .project-reveal { color: #e2e8f0; }
  .is-revealed .project-reveal .mdi { transform: rotate(180deg); }
  .project-actions a, .project-actions button { min-height: 44px; }
}
@media (prefers-reduced-motion: reduce) {
  .project-card, .project-status, .project-mark, .project-title, .project-grade, .project-description, .project-context dt, .project-context dd, .project-actions, .project-deploy, .project-reveal .mdi { transition: none; }
}
</style>
