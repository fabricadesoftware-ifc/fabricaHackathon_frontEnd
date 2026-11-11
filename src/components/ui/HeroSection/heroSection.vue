<script setup lang="ts">
  import { useId } from 'vue'
  import SearchBar from '../SearchBar/searchBar.vue'

  interface HeroPhoto {
    src: string
    alt: string
    credit?: string
    sourceUrl?: string
    licenseUrl?: string
  }

  withDefaults(defineProps<{
    title: string
    subtitle: string
    modelValue: string
    photo?: HeroPhoto | null
  }>(), {
    photo: null,
  })

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
  }>()

  const visualId = useId()
</script>

<template>
  <section aria-labelledby="hero-title" class="home-hero @container/hero w-full min-w-0">
    <div class="hero-composition grid-cols-[1.04fr_1fr] [@container_hero_(max-width:850px)]:grid-cols-1 [@container_hero_(420px<width<=850px)]:gap-7 [@container_hero_(420px<width<=850px)]:py-[1.75rem_2rem] [@container_hero_(max-width:420px)]:gap-6 [@container_hero_(max-width:420px)]:py-[1.25rem_1.5rem] grid items-center gap-8 py-[3rem_3.5rem]">
      <div class="hero-copy relative min-w-0">
        <p class="hero-identification [@container_hero_(max-width:420px)]:px-3 [@container_hero_(max-width:420px)]:text-[.75rem] inline-flex items-center min-h-[34px] p-[.4rem_.9rem] rounded-[999px] bg-app-hero-label text-app-brand-hover text-[.8125rem] leading-[1.4] font-medium">Plataforma de Hackathons do IFC</p>

        <h1 id="hero-title" class="mt-[1.6rem] text-app-ink-strong text-[clamp(2.5rem,4.55cqi,4.5rem)] font-black leading-[1.06] tracking-[-.035em] [@container_hero_(420px<width<=850px)]:text-[clamp(2.25rem,7cqi,3.75rem)] [@container_hero_(max-width:420px)]:mt-5 [@container_hero_(max-width:420px)]:text-[clamp(1.875rem,9cqi,2.5rem)]">
          <span v-for="line in title.split('\n')" :key="line" class="hero-title-line block">{{ line }}</span>
          <span class="hero-title-accent block text-app-brand-text">no IFC.</span>
        </h1>

        <p class="hero-description [@container_hero_(max-width:420px)]:mt-5 [@container_hero_(max-width:420px)]:text-[.9375rem] max-w-[48ch] mt-[1.75rem] text-app-ink-secondary text-base leading-[1.65] text-pretty">{{ subtitle }}</p>

        <div class="hero-actions [@container_hero_(max-width:420px)]:mt-5 flex flex-wrap items-center gap-3 mt-[1.75rem]">
          <RouterLink class="hero-primary inline-flex items-center justify-center gap-3 min-h-12 px-[1.15rem] py-3 border-[1px] border-transparent rounded-lg text-[.875rem] leading-[1.5] font-medium transition-[background-color,border-color] duration-150 [@container_hero_(max-width:420px)]:flex-auto [@container_hero_(max-width:420px)]:px-[.9rem] [@container_hero_(max-width:420px)]:text-[.8125rem] [&:hover]:bg-app-brand-hover-surface [&_.mdi]:text-[1.125rem] bg-app-brand-action text-app-on-brand" to="/edicoes">
            Explorar edições
            <span aria-hidden="true" class="mdi mdi-arrow-right" />
          </RouterLink>

          <RouterLink class="hero-secondary inline-flex items-center justify-center gap-3 min-h-12 px-[1.15rem] py-3 border-[1px] rounded-lg text-[.875rem] leading-[1.5] font-medium transition-[background-color,border-color] duration-150 [@container_hero_(max-width:420px)]:flex-auto [@container_hero_(max-width:420px)]:px-[.9rem] [@container_hero_(max-width:420px)]:text-[.8125rem] [&:hover]:bg-app-surface-faint [&:hover]:border-app-ink-subtle border-app-line-strong bg-app-surface-plain text-app-ink-strong" to="/explorar">
            Conhecer projetos
          </RouterLink>
        </div>
      </div>

      <figure class="hero-visual [@container_hero_(max-width:850px)]:max-w-[600px] [@container_hero_(max-width:850px)]:justify-self-center min-w-0 w-full m-0">
        <svg
          :aria-labelledby="`${visualId}-title ${visualId}-description`"
          class="hero-artwork block w-full h-auto overflow-visible"
          fill="none"
          role="img"
          viewBox="0 0 760 560"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title :id="`${visualId}-title`">{{ photo ? photo.alt : 'Espaço provisório para fotografia do IFC Campus Araquari' }}</title>

          <desc :id="`${visualId}-description`">
            {{ photo ? 'Fotografia em recorte diagonal, integrada às formas azuis do HackIFC.' : 'A fotografia será incluída após a verificação da licença ou autorização de uso. A composição geométrica segue a referência aprovada.' }}
          </desc>

          <defs>
            <clipPath :id="`${visualId}-photo`">
              <path d="M284 66H699Q735 66 717 98L494 477Q481 500 452 500H48Q18 500 33 471L231 99Q249 66 284 66Z" />
            </clipPath>
          </defs>

          <!-- Contornos e faixa traseira pertencem à composição aprovada. -->
          <path
            d="M570 35Q581 14 602 14H721Q756 14 742 44L682 154Q675 171 656 171H561Q530 171 545 144Z"
            stroke="var(--app-brand-accent)"
            stroke-width="1.25"
          />

          <path
            d="M224 48Q246 10 278 10H402Q420 10 412 28L406 42H294Q270 42 256 67L108 323H64Q44 323 56 301Z"
            fill="var(--app-brand-action)"
          />

          <path
            d="M418 437H542Q567 437 553 461L515 529Q509 541 492 541H378Q352 541 366 517L402 454Q411 437 418 437Z"
            stroke="var(--app-brand-accent)"
            stroke-width="1.25"
          />

          <g :clip-path="`url(#${visualId}-photo)`">
            <image
              v-if="photo"
              height="470"
              :href="photo.src"
              preserveAspectRatio="xMidYMid slice"
              width="760"
              x="0"
              y="50"
            />
            <!-- Não substituir por uma foto sem procedência e uso verificados. -->
            <g v-else>
              <rect fill="var(--app-hero-photo-placeholder)" height="560" width="760" />

              <text
                class="placeholder-label text-[17px]"
                fill="var(--app-ink-muted)"
                text-anchor="middle"
                x="400"
                y="225"
              >Espaço provisório</text>

              <text
                class="placeholder-title text-[30px] font-semibold"
                fill="var(--app-ink-heading)"
                text-anchor="middle"
                x="400"
                y="263"
              >IFC Campus Araquari</text>

              <text
                class="placeholder-note text-[17px]"
                fill="var(--app-ink-muted)"
                text-anchor="middle"
                x="400"
                y="295"
              >Aguardando fotografia com uso autorizado</text>
            </g>
          </g>

          <path
            d="M284 66H699Q735 66 717 98L494 477Q481 500 452 500H48Q18 500 33 471L231 99Q249 66 284 66Z"
            stroke="var(--app-art-white)"
            stroke-width="8"
          />

          <!-- Um único elemento complementar, como no mockup. -->
          <path d="M573 365H731Q751 365 741 385L681 495Q669 517 643 517H506Q486 517 496 495L557 385Q567 365 573 365Z" fill="var(--app-brand-action)" />

          <text class="visual-caption text-[25px] font-medium" fill="var(--app-art-white)" x="573" y="413">
            <tspan x="573">Desenvolva</tspan>
            <tspan dy="27" x="573">Colabore</tspan>
            <tspan dy="27" x="573">Inove</tspan>
          </text>
        </svg>

        <figcaption v-if="photo?.credit" class="hero-photo-credit [&_a]:underline [&_a]:underline-offset-2 mt-2 text-app-ink-muted text-[.6875rem] leading-[1.5] text-right">
          Foto:
          <a v-if="photo.sourceUrl" :href="photo.sourceUrl" rel="noopener noreferrer" target="_blank">{{ photo.credit }}</a>
          <span v-else>{{ photo.credit }}</span>.
          <a v-if="photo.licenseUrl" :href="photo.licenseUrl" rel="noopener noreferrer" target="_blank">Condições de uso</a>.
        </figcaption>

        <figcaption v-else-if="!photo" class="hero-photo-placeholder [&_span]:text-app-ink-muted mt-1 text-app-ink-secondary text-xs leading-[1.5] text-center">
          Fotografia do IFC Campus Araquari<br>
          <span>Espaço provisório. Aguardando fotografia com uso autorizado.</span>
        </figcaption>
      </figure>
    </div>

    <div class="hero-discovery border-b-[1px] border-app-line [@container_hero_(max-width:650px)]:items-stretch [@container_hero_(max-width:650px)]:flex-col [@container_hero_(max-width:650px)]:gap-2 flex items-center gap-8 py-5">
      <div class="discovery-search flex-1 min-w-0">
        <label class="sr-only" for="home-search">Buscar edições, projetos ou equipes</label>

        <SearchBar
          id="home-search"
          aria-label="Buscar edições, projetos ou equipes"
          :model-value="modelValue"
          placeholder="Buscar edições, projetos ou equipes…"
          @update:model-value="emit('update:modelValue', $event)"
        />
      </div>

      <nav aria-label="Seções da Home" class="discovery-nav [@container_hero_(max-width:600px)]:gap-5 [@container_hero_(max-width:600px)]:flex-wrap flex gap-6">
        <a class="inline-flex items-center gap-2 min-h-11 text-app-ink-secondary text-[.8125rem] font-medium [&:hover]:text-app-brand-hover [@container_hero_(max-width:600px)]:text-[.75rem]" href="#inscricoes">Inscrições abertas <span aria-hidden="true" class="mdi mdi-arrow-down" /></a>
        <a class="inline-flex items-center gap-2 min-h-11 text-app-ink-secondary text-[.8125rem] font-medium [&:hover]:text-app-brand-hover [@container_hero_(max-width:600px)]:text-[.75rem]" href="#projetos">Projetos das edições <span aria-hidden="true" class="mdi mdi-arrow-down" /></a>
      </nav>
    </div>
  </section>
</template>

<style scoped>
/* Preserve focus outlines above the existing global focus reset. */
a:focus-visible, button:focus-visible { outline: 2px solid var(--app-brand-accent); outline-offset: 4px; }
</style>
