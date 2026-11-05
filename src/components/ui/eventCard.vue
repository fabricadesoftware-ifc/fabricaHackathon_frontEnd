<script setup lang="ts">
  import { computed, ref, useId, watch } from 'vue'
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
    manager?: string
  }>(), { description: '', manager: '' })

  const imageFailed = ref(false)
  const imageSource = computed(() => props.image?.trim() ?? '')
  const hasCover = computed(() => Boolean(imageSource.value) && !imageFailed.value)
  const hasAdditionalInfo = computed(() => Boolean(props.description.trim() || props.manager.trim()))
  watch(() => props.image, () => {
    imageFailed.value = false
  })

  const revealId = useId()
  const { isRevealed, onPointerEnter, onPointerLeave, onFocusIn, onFocusOut, toggleReveal, closeReveal } = useCardReveal()
</script>

<template>
  <article
    class="discovery-card edition-card"
    :class="{ 'is-revealed': hasAdditionalInfo && isRevealed }"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
    @keydown.esc="closeReveal"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
  >
    <RouterLink class="card-link" :to="{ name: 'edicoes', params: { id: props.id } }">
      <div class="card-media" :data-cover-state="hasCover ? 'loaded' : imageFailed ? 'error' : 'missing'">
        <img
          v-if="hasCover"
          :alt="`Capa de ${props.title}`"
          height="576"
          loading="lazy"
          :src="imageSource"
          width="1024"
          @error="imageFailed = true"
        >

        <div v-else aria-label="Imagem da edição não disponível" class="card-cover-fallback" role="img">
          <span aria-hidden="true" class="mdi mdi-image-outline" />
          <span>Imagem não disponível</span>
        </div>

        <span class="card-status" :data-status="props.status">{{ props.statusLabel }}</span>

        <div
          v-if="hasAdditionalInfo"
          :id="revealId"
          :aria-hidden="!isRevealed"
          class="card-reveal"
          :inert="!isRevealed"
        >
          <div class="card-reveal-content">
            <p v-if="props.description" class="card-reveal-description">{{ props.description }}</p>

            <p v-if="props.manager" class="edition-organizer" :title="props.manager">
              <span>Responsável</span> {{ props.manager }}
            </p>
          </div>
        </div>
      </div>

      <div class="card-content">
        <p v-if="props.tags.length > 0" class="card-type">{{ props.tags.join(' / ') }}</p>
        <h3 class="card-title" :title="props.title">{{ props.title }}</h3>

        <dl class="card-metadata">
          <div>
            <span aria-hidden="true" class="mdi mdi-calendar-blank-outline" />

            <div class="card-metadata-text">
              <dt class="sr-only">Data</dt>
              <dd>{{ props.startDate }}{{ props.startDate === props.endDate ? '' : ` a ${props.endDate}` }}</dd>
            </div>
          </div>

          <div v-if="props.location">
            <span aria-hidden="true" class="mdi mdi-map-marker-outline" />

            <div class="card-metadata-text">
              <dt class="sr-only">Local</dt>
              <dd class="card-meta-value">{{ props.location }}</dd>
            </div>
          </div>
        </dl>

        <div class="card-footer">
          <span>{{ props.teamsCounter }} {{ props.teamsCounter === 1 ? 'equipe' : 'equipes' }}</span>
          <span class="card-action">Ver edição <span aria-hidden="true" class="mdi mdi-arrow-right" /></span>
        </div>
      </div>
    </RouterLink>

    <button
      v-if="hasAdditionalInfo"
      :aria-controls="revealId"
      :aria-expanded="isRevealed"
      :aria-label="`Informações sobre ${props.title}`"
      class="card-info-toggle"
      type="button"
      @click="toggleReveal"
    >
      <span aria-hidden="true" class="mdi mdi-information-outline" />
    </button>
  </article>
</template>

<style src="./discovery-card.css"></style>

<style scoped>
/* Ajustes locais: os cards de projeto mantêm o estilo compartilhado atual. */
.edition-card { max-width: 320px; min-height: unset; align-self: start; }
.edition-card .card-link, .edition-card .card-content { flex: none; }
.edition-card .card-media { aspect-ratio: 2 / 1; }
.edition-card .card-content { padding: 1rem; }
.edition-card .card-type { margin-bottom: .4rem; }
.edition-card .card-title { display: block; overflow: visible; -webkit-line-clamp: unset; font-size: 1.1875rem; line-height: 1.3; }
.edition-card .card-metadata { gap: .45rem; margin: .8rem 0; }
.edition-card .card-meta-value { display: block; overflow: visible; -webkit-line-clamp: unset; }
.edition-card .card-footer { margin-top: 0; padding-top: .55rem; }
.edition-card .card-status { top: .75rem; left: .75rem; max-width: calc(100% - 24px); }
.edition-card:has(.card-info-toggle) .card-status { max-width: calc(100% - 76px); }
.edition-card .card-info-toggle { width: 44px; height: 44px; top: .25rem; right: .25rem; border-color: transparent; background: #fff; color: #334155; }
.edition-card .card-info-toggle:hover,
.edition-card .card-info-toggle[aria-expanded="true"] { background: #eff6ff; color: #1d4ed8; }
.edition-card .card-reveal { justify-content: flex-end; gap: 0; overflow: hidden; padding: 3.35rem 1rem 1rem; background: rgb(15 23 42 / 78%); transition: opacity 180ms ease; }
.edition-card .card-reveal-content { flex-shrink: 1; min-height: 0; margin-top: 0; transform: none; transition: none; }
.edition-card .card-reveal-description { display: -webkit-box; overflow: hidden; -webkit-line-clamp: 3; -webkit-box-orient: vertical; font-size: .8125rem; line-height: 1.45; }
.edition-organizer { margin: .55rem 0 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: .75rem; line-height: 1.5; color: #fff; }
.edition-organizer:first-child { margin-top: 0; }
.edition-organizer span { margin-right: .3rem; color: #e2e8f0; }
.edition-card .card-cover-fallback { flex-direction: column; gap: .5rem; padding: 3rem 1rem 1rem; background: #f1f5f9; color: #475569; font-size: .75rem; }
.card-cover-fallback .mdi { display: grid; width: 36px; height: 36px; place-items: center; border: 1px solid #cbd5e1; border-radius: 8px; color: #64748b; font-size: 1.25rem; }
@media (max-width: 400px) {
  .edition-card .card-reveal { padding-bottom: .75rem; }
  .edition-card .card-reveal-description { -webkit-line-clamp: 2; }
}
@media (prefers-reduced-motion: reduce) {
  .edition-card .card-reveal { transition: none; }
}
</style>
