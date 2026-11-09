<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue'
  import { RouterLink } from 'vue-router'
  import { useCardReveal } from '@/composables/useCardReveal'

  type Status = 'inscricoes' | 'avaliacao' | 'andamento' | 'finalizado'

  const props = withDefaults(defineProps<{
    id: number
    title: string
    image: string
    status: Status
    statusLabel: string
    startDate: string
    endDate: string
    teamsCounter: number
    location: string
    tags: string[]
    description?: string
    modality?: string
    manager?: string
  }>(), { description: '', manager: '' })

  const information = useTemplateRef<HTMLElement>('information')
  const metadata = useTemplateRef<HTMLElement>('metadata')
  const restOffset = ref(0)
  let resizeObserver: ResizeObserver | undefined

  onMounted(() => {
    const measure = () => {
      restOffset.value = Math.max(0, (information.value?.offsetHeight ?? 0) - (metadata.value?.offsetHeight ?? 0))
    }
    resizeObserver = new ResizeObserver(measure)
    if (information.value) resizeObserver.observe(information.value)
    if (metadata.value) resizeObserver.observe(metadata.value)
    measure()
  })
  onBeforeUnmount(() => resizeObserver?.disconnect())

  const imageFailed = ref(false)
  const imageSource = computed(() => {
    const source = props.image?.trim() ?? ''
    if (!source || /^(https?:|data:|blob:|\/\/)/i.test(source) || source.startsWith('/images/')) return source
    const apiUrl = (window as unknown as { __APP_CONFIG__?: { API_URL?: string } }).__APP_CONFIG__?.API_URL
      || import.meta.env.VITE_API_URL
    try {
      return new URL(source, apiUrl).href
    } catch {
      return source
    }
  })
  const hasCover = computed(() => Boolean(imageSource.value) && !imageFailed.value)
  const hasTeams = computed(() => Number.isFinite(props.teamsCounter) && props.teamsCounter >= 0)
  const editionModality = computed(() => props.modality?.trim() || props.tags.find(tag => tag && !/^\d{4}$/.test(tag)) || '')
  watch(imageSource, () => {
    imageFailed.value = false
  })

  const { isRevealed, onPointerEnter, onPointerLeave, onFocusIn, onFocusOut, closeReveal } = useCardReveal()
</script>

<template>
  <article
    class="edition-card"
    :class="{ 'is-revealed': isRevealed }"
    :style="{ '--edition-rest-offset': `${restOffset}px` }"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
    @keydown.esc="closeReveal"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
  >
    <RouterLink class="edition-link" :to="{ name: 'edicoes', params: { id: props.id } }">
      <div class="edition-cover" :data-cover-state="hasCover ? 'loaded' : imageFailed ? 'error' : 'missing'">
        <img
          v-if="hasCover"
          alt=""
          height="640"
          loading="lazy"
          :src="imageSource"
          width="480"
          @error="imageFailed = true"
        >

        <div v-else aria-label="Imagem da edição não disponível" class="edition-fallback" role="img">
          <span aria-hidden="true" class="mdi mdi-image-outline" />
          <span>Imagem não disponível</span>
        </div>
      </div>

      <span aria-hidden="true" class="edition-shade" />
      <span class="edition-status" :data-status="props.status">{{ props.statusLabel }}</span>

      <div class="edition-content">
        <h3 class="edition-title" :title="props.title">{{ props.title }}</h3>

        <div ref="information" class="edition-information">
          <dl ref="metadata" class="edition-metadata">
            <div v-if="props.startDate">
              <dt class="sr-only">Data</dt>
              <dd><span aria-hidden="true" class="mdi mdi-calendar-blank-outline" />{{ props.startDate }}{{ props.startDate === props.endDate || !props.endDate ? '' : ` a ${props.endDate}` }}</dd>
            </div>

            <div v-if="props.location">
              <dt class="sr-only">Local</dt>
              <dd :title="props.location"><span aria-hidden="true" class="mdi mdi-map-marker-outline" />{{ props.location }}</dd>
            </div>
          </dl>

          <div class="edition-reveal">
            <div v-if="hasTeams || editionModality" class="edition-details">
              <span v-if="hasTeams"><span aria-hidden="true" class="mdi mdi-account-group-outline" />{{ props.teamsCounter }} {{ props.teamsCounter === 1 ? 'equipe' : 'equipes' }}</span>
              <span v-if="editionModality"><span aria-hidden="true" class="mdi mdi-tag-outline" />{{ editionModality }}</span>
            </div>

            <p v-if="props.manager.trim()" class="edition-manager">Responsável: {{ props.manager }}</p>
          </div>

          <span class="edition-action">Explorar edição <span aria-hidden="true" class="mdi mdi-arrow-right" /></span>
        </div>
      </div>
    </RouterLink>
  </article>
</template>

<style scoped>
.edition-card {
  position: relative;
  width: 100%;
  max-width: 320px;
  min-width: 0;
  align-self: start;
  border-radius: 8px;
  background: #172331;
  color: #fff;
  isolation: isolate;
}
.edition-link { position: relative; display: flex; min-height: 100%; aspect-ratio: 9 / 10; overflow: hidden; border-radius: inherit; color: inherit; text-decoration: none; }
.edition-cover, .edition-shade { position: absolute; inset: 0; pointer-events: none; }
.edition-cover img { display: block; width: 100%; height: 100%; object-fit: cover; }
.edition-fallback { display: flex; height: 100%; flex-direction: column; align-items: center; justify-content: flex-start; gap: .35rem; padding: 4.5rem 1.25rem 0; background: #273747; color: #e2e8f0; font-size: .75rem; }
.edition-fallback .mdi { font-size: 1.75rem; }
.edition-shade { background: linear-gradient(180deg, rgb(5 12 20 / 14%) 0%, rgb(5 12 20 / 0%) 25%, rgb(5 12 20 / 56%) 55%, rgb(5 12 20 / 95%) 100%); }
.edition-shade::after { position: absolute; inset: 0; background: rgb(5 12 20 / 65%); content: ''; opacity: 0; transition: opacity 320ms ease; }
.edition-status { position: absolute; top: 1rem; left: 1rem; right: 1rem; width: fit-content; display: inline-flex; align-items: center; gap: .45rem; padding: .4rem .65rem; border-radius: 5px; background: #fff; color: #172331; font-size: .6875rem; font-weight: 700; line-height: 1.4; }
.edition-status::before { width: 6px; height: 6px; flex-shrink: 0; border-radius: 50%; background: #64748b; content: ''; }
.edition-status[data-status="inscricoes"]::before { background: #15803d; }
.edition-status[data-status="andamento"]::before { background: #2563eb; }
.edition-status[data-status="avaliacao"]::before { background: #7c3aed; }
.edition-content { position: relative; width: 100%; min-width: 0; margin-top: auto; padding: 4rem 1.25rem 1.25rem; transform: translateY(var(--edition-rest-offset, 0px)); transition: transform 320ms cubic-bezier(.22, 1, .36, 1); }
.edition-title { margin: 0; font-size: clamp(1.4rem, 1.8vw, 1.75rem); font-weight: 700; line-height: 1.12; letter-spacing: -.025em; overflow-wrap: anywhere; text-wrap: balance; }
.edition-information { display: grid; grid-template-columns: minmax(0, 1fr); grid-template-rows: auto auto; gap: .75rem 0; margin-top: .65rem; }
.edition-reveal { grid-area: 1 / 1; align-self: start; transform: translateY(5px); opacity: 0; visibility: hidden; transition: opacity 160ms ease, transform 240ms ease, visibility 0s 160ms; }
.edition-details { display: flex; flex-wrap: wrap; gap: .4rem 1rem; color: #f1f5f9; font-size: .75rem; line-height: 1.4; }
.edition-details > span { display: inline-flex; align-items: center; gap: .4rem; overflow-wrap: anywhere; }
.edition-details .mdi { font-size: 1rem; }
.edition-manager { margin: .5rem 0 0; overflow-wrap: anywhere; color: #e2e8f0; font-size: .75rem; line-height: 1.4; }
.edition-action { grid-area: 2 / 1; opacity: 0; visibility: hidden; transition: opacity 120ms ease, visibility 0s 120ms; display: flex; width: fit-content; min-height: 36px; align-items: center; justify-content: center; gap: .65rem; margin: 0; padding: .4rem .75rem; border-radius: 6px; background: #fff; color: #172331; font-size: .75rem; font-weight: 500; line-height: 1.4; }
.edition-action .mdi { color: #2563eb; font-size: .95rem; }
.edition-metadata { grid-area: 1 / 1; align-content: start; display: grid; gap: .4rem; margin: 0; transition: opacity 120ms ease 160ms, visibility 0s 160ms; color: #f1f5f9; font-size: .75rem; line-height: 1.45; }
.edition-metadata dd { display: flex; align-items: start; gap: .5rem; margin: 0; overflow-wrap: anywhere; }
.edition-metadata .mdi { flex-shrink: 0; color: #e2e8f0; font-size: 1rem; line-height: 1.1; }
.is-revealed .edition-shade::after { opacity: 1; }
.is-revealed .edition-content { transform: translateY(0); }
.is-revealed .edition-reveal { transform: translateY(0); }
.is-revealed .edition-metadata { opacity: 0; visibility: hidden; transition-delay: 0s, 120ms; }
.is-revealed .edition-reveal,
.is-revealed .edition-action { opacity: 1; visibility: visible; transition-delay: 120ms; }
.edition-card:has(.edition-link:focus-visible) { outline: 2px solid #2563eb; outline-offset: 4px; }
.edition-link:focus-visible { outline: none; }
@media (hover: none), (pointer: coarse) {
  .edition-content { transform: none; }
  .edition-information { display: block; }
  .edition-reveal { display: none; }
  .edition-card .edition-metadata { opacity: 1; visibility: visible; }
  .edition-action { margin-top: .75rem; opacity: 1; visibility: visible; transition: none; }
  .edition-shade::after { opacity: .45; }
}
@media (prefers-reduced-motion: reduce) {
  .edition-content, .edition-metadata, .edition-reveal, .edition-action, .edition-shade::after { transition: none; }
}
</style>
