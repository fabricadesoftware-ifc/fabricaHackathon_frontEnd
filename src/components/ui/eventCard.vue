<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue'
  import { RouterLink } from 'vue-router'
  import { useCardReveal } from '@/composables/useCardReveal'
  import { resolveMediaUrl } from '@/utils/media'
  import StatusSelect from './statusSelect.vue'

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
  const imageSource = computed(() => resolveMediaUrl(props.image))
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
    class="edition-card relative w-full max-w-[320px] min-w-0 self-start rounded-lg bg-app-project-revealed-surface text-app-on-brand isolate"
    :class="{ 'is-revealed': isRevealed }"
    :style="{ '--edition-rest-offset': `${restOffset}px` }"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
    @keydown.esc="closeReveal"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
  >
    <RouterLink class="edition-link relative flex min-h-full aspect-[9_/_10] overflow-hidden rounded-[inherit] text-inherit no-underline" :to="{ name: 'edicoes', params: { id: props.id } }">
      <div class="edition-cover absolute inset-0 pointer-events-none" :data-cover-state="hasCover ? 'loaded' : imageFailed ? 'error' : 'missing'">
        <img
          v-if="hasCover"
          alt=""
          class="block size-full object-cover"
          height="640"
          loading="lazy"
          :src="imageSource"
          width="480"
          @error="imageFailed = true"
        >

        <div v-else aria-label="Imagem da edição não disponível" class="edition-fallback flex h-full flex-col items-center justify-start gap-[.35rem] p-[4.5rem_1.25rem_0] bg-app-cover-fallback text-app-line-foreground text-[.75rem]" role="img">
          <span aria-hidden="true" class="mdi mdi-image-outline text-[1.75rem]" />
          <span>Imagem não disponível</span>
        </div>
      </div>

      <span aria-hidden="true" class="edition-shade absolute inset-0 pointer-events-none" />
      <StatusSelect class="absolute top-4 left-4 right-4" :label="props.statusLabel" :status="props.status" variant="card" />

      <div class="edition-content relative w-full min-w-0 mt-auto p-[4rem_1.25rem_1.25rem]">
        <h3 class="edition-title m-0 text-[clamp(1.4rem,_1.8vw,_1.75rem)] font-bold leading-[1.12] tracking-[-.025em] [overflow-wrap:anywhere] text-balance" :title="props.title">{{ props.title }}</h3>

        <div ref="information" class="edition-information grid-cols-1 grid-rows-[auto_auto] grid gap-[.75rem_0] mt-[.65rem]">
          <dl ref="metadata" class="edition-metadata grid gap-[.4rem] m-0 text-app-surface-soft-foreground text-[.75rem] leading-[1.45]">
            <div v-if="props.startDate">
              <dt class="sr-only">Data</dt>
              <dd class="flex items-start gap-2 m-0 [overflow-wrap:anywhere]"><span aria-hidden="true" class="mdi mdi-calendar-blank-outline shrink-0 text-app-line-foreground text-[1rem] leading-[1.1]" />{{ props.startDate }}{{ props.startDate === props.endDate || !props.endDate ? '' : ` a ${props.endDate}` }}</dd>
            </div>

            <div v-if="props.location">
              <dt class="sr-only">Local</dt>
              <dd class="flex items-start gap-2 m-0 [overflow-wrap:anywhere]" :title="props.location"><span aria-hidden="true" class="mdi mdi-map-marker-outline shrink-0 text-app-line-foreground text-[1rem] leading-[1.1]" />{{ props.location }}</dd>
            </div>
          </dl>

          <div class="edition-reveal self-start opacity-0 invisible">
            <div v-if="hasTeams || editionModality" class="edition-details [&>span]:inline-flex [&>span]:items-center [&>span]:gap-[.4rem] [&>span]:[overflow-wrap:anywhere] [&_.mdi]:text-[1rem] flex flex-wrap gap-[.4rem_1rem] text-app-surface-soft-foreground text-[.75rem] leading-[1.4]">
              <span v-if="hasTeams"><span aria-hidden="true" class="mdi mdi-account-group-outline" />{{ props.teamsCounter }} {{ props.teamsCounter === 1 ? 'equipe' : 'equipes' }}</span>
              <span v-if="editionModality"><span aria-hidden="true" class="mdi mdi-tag-outline" />{{ editionModality }}</span>
            </div>

            <p v-if="props.manager.trim()" class="edition-manager m-[.5rem_0_0] [overflow-wrap:anywhere] text-app-line-foreground text-[.75rem] leading-[1.4]">Responsável: {{ props.manager }}</p>
          </div>

          <span class="edition-action [grid-area:2/1] opacity-0 invisible flex w-[fit-content] min-h-[36px] items-center justify-center gap-[.65rem] m-0 p-[.4rem_.75rem] rounded-[6px] bg-app-surface-plain text-app-ink-on-control text-[.75rem] font-medium leading-[1.4]">Explorar edição <span aria-hidden="true" class="mdi mdi-arrow-right text-app-brand-text text-[.95rem]" /></span>
        </div>
      </div>
    </RouterLink>
  </article>
</template>

<style scoped>
.edition-shade { background: linear-gradient(180deg, rgb(var(--app-edition-shade) / 14%) 0%, rgb(var(--app-edition-shade) / 0%) 25%, rgb(var(--app-edition-shade) / 56%) 55%, rgb(var(--app-edition-shade) / 95%) 100%); }
.edition-shade::after { position: absolute; inset: 0; background: rgb(var(--app-edition-shade) / 65%); content: ''; opacity: 0; transition: opacity 320ms ease; }
.edition-content { transform: translateY(var(--edition-rest-offset, 0px)); transition: transform 320ms cubic-bezier(.22, 1, .36, 1); }
.edition-reveal { grid-area: 1 / 1; transform: translateY(5px); transition: opacity 160ms ease, transform 240ms ease, visibility 0s 160ms; }
.edition-action { transition: opacity 120ms ease, visibility 0s 120ms; }
.edition-metadata { grid-area: 1 / 1; align-content: start; transition: opacity 120ms ease 160ms, visibility 0s 160ms; }
.is-revealed .edition-shade::after { opacity: 1; }
.is-revealed .edition-content { transform: translateY(0); }
.is-revealed .edition-reveal { transform: translateY(0); }
.is-revealed .edition-metadata { opacity: 0; visibility: hidden; transition-delay: 0s, 120ms; }
.is-revealed .edition-reveal,
.is-revealed .edition-action { opacity: 1; visibility: visible; transition-delay: 120ms; }
.edition-card:has(.edition-link:focus-visible) { outline: 2px solid var(--app-brand-accent); outline-offset: 4px; }
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
