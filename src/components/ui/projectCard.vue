<script setup lang="ts">
  import { computed, ref, useId, watch } from 'vue'
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
  const coverFailed = ref(false)
  const logoFailed = ref(false)
  watch(() => props.cover, () => {
    coverFailed.value = false
  })
  watch(() => props.logo, () => {
    logoFailed.value = false
  })
  const hasLogo = computed(() => Boolean(props.logo) && !logoFailed.value)
  const hasCover = computed(() => Boolean(props.cover) && !coverFailed.value)
  const initials = computed(() => props.title.trim().split(/\s+/).slice(0, 2).map(word => word.charAt(0)).join('').toLocaleUpperCase('pt-BR') || 'P')
  const revealId = useId()
  const { isRevealed, onPointerEnter, onPointerLeave, onFocusIn, onFocusOut, toggleReveal, closeReveal } = useCardReveal()
</script>

<template>
  <article
    class="discovery-card project-card"
    :class="{ 'is-revealed': isRevealed }"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
    @keydown.esc="closeReveal"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
  >
    <div class="card-media" :class="{ 'card-media--logo': hasLogo, 'card-media--identity': !hasLogo && !hasCover }">
      <img
        v-if="hasLogo"
        :alt="`Logo de ${props.title}`"
        height="576"
        loading="lazy"
        :src="props.logo"
        width="1024"
        @error="logoFailed = true"
      >

      <img
        v-else-if="hasCover"
        :alt="props.event ? `Imagem da edição ${props.event}` : `Capa de ${props.title}`"
        height="576"
        loading="lazy"
        :src="props.cover ?? undefined"
        width="1024"
        @error="coverFailed = true"
      >

      <template v-else>
        <span aria-hidden="true" class="card-monogram">{{ initials }}</span>
        <span v-if="props.team" class="card-media-team">{{ props.team }}</span>
      </template>

      <span class="card-status" :data-status="props.status">{{ props.statusLabel }}</span>

      <div :id="revealId" :aria-hidden="!isRevealed" class="card-reveal" :inert="!isRevealed">
        <div class="card-reveal-content">
          <p class="card-reveal-description">{{ props.description || props.title }}</p>

          <dl class="card-reveal-meta">
            <div v-if="props.team">
              <dt>Equipe</dt>
              <dd>{{ props.team }}</dd>
            </div>

            <div v-if="props.event">
              <dt>Edição</dt>
              <dd>{{ props.event }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>

    <button
      :aria-controls="revealId"
      :aria-expanded="isRevealed"
      :aria-label="`${isRevealed ? 'Ocultar' : 'Mostrar'} informações de ${props.title}`"
      class="card-info-toggle"
      type="button"
      @click="toggleReveal"
    >
      <span aria-hidden="true" :class="isRevealed ? 'mdi mdi-close' : 'mdi mdi-information-outline'" />
    </button>

    <div class="card-content">
      <h3 class="card-title" :title="props.title">{{ props.title }}</h3>
      <p v-if="props.description" class="card-description">{{ props.description }}</p>

      <dl class="card-metadata card-metadata--project">
        <div v-if="props.team">
          <span aria-hidden="true" class="mdi mdi-account-group-outline" />

          <div class="card-metadata-text">
            <dt>Equipe</dt>
            <dd class="card-meta-value">{{ props.team }}</dd>
          </div>
        </div>

        <div v-if="props.event">
          <span aria-hidden="true" class="mdi mdi-trophy-outline" />

          <div class="card-metadata-text">
            <dt>Edição</dt>
            <dd class="card-meta-value">{{ props.event }}</dd>
          </div>
        </div>

        <div v-if="props.notaFinal !== null && props.notaFinal !== undefined">
          <span aria-hidden="true" class="mdi mdi-star-outline" />

          <div class="card-metadata-text">
            <dt>Nota final</dt>
            <dd>{{ props.notaFinal }}</dd>
          </div>
        </div>
      </dl>

      <div v-if="props.deployUrl || props.preAvaliacaoTo || props.editavel" class="card-actions">
        <a
          v-if="props.deployUrl"
          class="card-action-primary"
          :href="props.deployUrl"
          rel="noopener noreferrer"
          target="_blank"
        >
          Acessar sistema
          <span aria-hidden="true" class="mdi mdi-open-in-new" />
        </a>

        <RouterLink v-if="props.preAvaliacaoTo" :to="props.preAvaliacaoTo">
          <span aria-hidden="true" class="mdi mdi-clipboard-text-outline" />
          Pré-avaliação
        </RouterLink>

        <button v-if="props.editavel" type="button" @click="emit('edit')">
          <span aria-hidden="true" class="mdi mdi-pencil-outline" />
          Editar
        </button>
      </div>
    </div>
  </article>
</template>

<style src="./discovery-card.css"></style>
