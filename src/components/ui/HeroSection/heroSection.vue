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
  <section aria-labelledby="hero-title" class="home-hero">
    <div class="hero-composition">
      <div class="hero-copy">
        <p class="hero-identification">Plataforma de Hackathons do IFC</p>

        <h1 id="hero-title">
          <span v-for="line in title.split('\n')" :key="line" class="hero-title-line">{{ line }}</span>
          <span class="hero-title-accent">no IFC.</span>
        </h1>

        <p class="hero-description">{{ subtitle }}</p>

        <div class="hero-actions">
          <RouterLink class="hero-primary" to="/edicoes">
            Explorar edições
            <span aria-hidden="true" class="mdi mdi-arrow-right" />
          </RouterLink>

          <RouterLink class="hero-secondary" to="/explorar">
            Conhecer projetos
          </RouterLink>
        </div>
      </div>

      <figure class="hero-visual">
        <svg
          :aria-labelledby="`${visualId}-title ${visualId}-description`"
          class="hero-artwork"
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
            stroke="#2563EB"
            stroke-width="1.25"
          />

          <path
            d="M224 48Q246 10 278 10H402Q420 10 412 28L406 42H294Q270 42 256 67L108 323H64Q44 323 56 301Z"
            fill="#2563EB"
          />

          <path
            d="M418 437H542Q567 437 553 461L515 529Q509 541 492 541H378Q352 541 366 517L402 454Q411 437 418 437Z"
            stroke="#2563EB"
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
              <rect fill="#EFF3F9" height="560" width="760" />

              <text
                class="placeholder-label"
                fill="#64748B"
                text-anchor="middle"
                x="400"
                y="225"
              >Espaço provisório</text>

              <text
                class="placeholder-title"
                fill="#334155"
                text-anchor="middle"
                x="400"
                y="263"
              >IFC Campus Araquari</text>

              <text
                class="placeholder-note"
                fill="#64748B"
                text-anchor="middle"
                x="400"
                y="295"
              >Aguardando fotografia com uso autorizado</text>
            </g>
          </g>

          <path
            d="M284 66H699Q735 66 717 98L494 477Q481 500 452 500H48Q18 500 33 471L231 99Q249 66 284 66Z"
            stroke="white"
            stroke-width="8"
          />

          <!-- Um único elemento complementar, como no mockup. -->
          <path d="M573 365H731Q751 365 741 385L681 495Q669 517 643 517H506Q486 517 496 495L557 385Q567 365 573 365Z" fill="#2563EB" />

          <text class="visual-caption" fill="white" x="573" y="413">
            <tspan x="573">Desenvolva</tspan>
            <tspan dy="27" x="573">Colabore</tspan>
            <tspan dy="27" x="573">Inove</tspan>
          </text>
        </svg>

        <figcaption v-if="photo?.credit" class="hero-photo-credit">
          Foto:
          <a v-if="photo.sourceUrl" :href="photo.sourceUrl" rel="noopener noreferrer" target="_blank">{{ photo.credit }}</a>
          <span v-else>{{ photo.credit }}</span>.
          <a v-if="photo.licenseUrl" :href="photo.licenseUrl" rel="noopener noreferrer" target="_blank">Condições de uso</a>.
        </figcaption>

        <figcaption v-else-if="!photo" class="hero-photo-placeholder">
          Fotografia do IFC Campus Araquari<br>
          <span>Espaço provisório. Aguardando fotografia com uso autorizado.</span>
        </figcaption>
      </figure>
    </div>

    <div class="hero-discovery">
      <div class="discovery-search">
        <label class="sr-only" for="home-search">Buscar edições, projetos ou equipes</label>

        <SearchBar
          id="home-search"
          aria-label="Buscar edições, projetos ou equipes"
          :model-value="modelValue"
          placeholder="Buscar edições, projetos ou equipes…"
          @update:model-value="emit('update:modelValue', $event)"
        />
      </div>

      <nav aria-label="Seções da Home" class="discovery-nav">
        <a href="#inscricoes">Inscrições abertas <span aria-hidden="true" class="mdi mdi-arrow-down" /></a>
        <a href="#projetos">Projetos das edições <span aria-hidden="true" class="mdi mdi-arrow-down" /></a>
      </nav>
    </div>
  </section>
</template>

<style scoped>
.home-hero { width: 100%; min-width: 0; container: hero / inline-size; }
.hero-composition { display: grid; grid-template-columns: 1.04fr 1fr; align-items: center; gap: 2rem; padding-block: 3rem 3.5rem; }
.hero-copy { position: relative; min-width: 0; }
.hero-identification { display: inline-flex; align-items: center; min-height: 34px; padding: .4rem .9rem; border-radius: 999px; background: #eff4ff; color: #1d4ed8; font-size: .8125rem; line-height: 1.4; font-weight: 500; }
h1 { margin-top: 1.6rem; color: #0f172a; font-size: clamp(2.5rem, 4.55cqi, 4.5rem); font-weight: 900; line-height: 1.06; letter-spacing: -.035em; }
.hero-title-line, .hero-title-accent { display: block; }
.hero-title-accent { color: #2563eb; }
.hero-description { max-width: 48ch; margin-top: 1.75rem; color: #475569; font-size: 1rem; line-height: 1.65; text-wrap: pretty; }
.hero-actions { display: flex; flex-wrap: wrap; align-items: center; gap: .75rem; margin-top: 1.75rem; }
.hero-primary, .hero-secondary { display: inline-flex; align-items: center; justify-content: center; gap: .75rem; min-height: 48px; padding: .75rem 1.15rem; border: 1px solid transparent; border-radius: 8px; font-size: .875rem; line-height: 1.5; font-weight: 500; transition: background-color 150ms, border-color 150ms; }
.hero-primary { background: #2563eb; color: #fff; }
.hero-primary:hover { background: #1d4ed8; }
.hero-primary .mdi { font-size: 1.125rem; }
.hero-secondary { border-color: #cbd5e1; background: #fff; color: #0f172a; }
.hero-secondary:hover { background: #f8fafc; border-color: #94a3b8; }
.hero-visual { min-width: 0; width: 100%; margin: 0; }
.hero-artwork { display: block; width: 100%; height: auto; overflow: visible; }
.placeholder-label { font-size: 17px; }
.placeholder-title { font-size: 30px; font-weight: 600; }
.placeholder-note { font-size: 17px; }
.visual-caption { font-size: 25px; font-weight: 500; }
.hero-photo-placeholder { margin-top: .25rem; color: #475569; font-size: .75rem; line-height: 1.5; text-align: center; }
.hero-photo-placeholder span { color: #64748b; }
.hero-photo-credit { margin-top: .5rem; color: #64748b; font-size: .6875rem; line-height: 1.5; text-align: right; }
.hero-photo-credit a { text-decoration: underline; text-underline-offset: 2px; }
.hero-discovery { display: flex; align-items: center; gap: 2rem; padding-block: 1.25rem; border-bottom: 1px solid #e2e8f0; }
.discovery-search { min-width: 0; flex: 1; }
.discovery-nav { display: flex; gap: 1.5rem; }
.discovery-nav a { display: inline-flex; align-items: center; gap: .5rem; min-height: 44px; color: #475569; font-size: .8125rem; font-weight: 500; }
.discovery-nav a:hover { color: #1d4ed8; }
a:focus-visible, button:focus-visible { outline: 2px solid #2563eb; outline-offset: 4px; }
@container hero (max-width: 650px) { .hero-discovery { align-items: stretch; flex-direction: column; gap: .5rem; } }
@container hero (max-width: 850px) {
  .hero-composition { grid-template-columns: 1fr; gap: 1.75rem; padding-block: 1.75rem 2rem; }
  h1 { font-size: clamp(2.25rem, 7cqi, 3.75rem); }
  .hero-description { max-width: 48ch; }
  .hero-visual { max-width: 600px; justify-self: center; }
}
@container hero (max-width: 420px) {
  .hero-composition { gap: 1.5rem; padding-block: 1.25rem 1.5rem; }
  .hero-identification { padding-inline: .75rem; font-size: .75rem; }
  h1 { margin-top: 1.25rem; font-size: clamp(1.875rem, 9cqi, 2.5rem); }
  .hero-description { margin-top: 1.25rem; font-size: .9375rem; }
  .hero-actions { margin-top: 1.25rem; }
  .hero-primary, .hero-secondary { flex: 1 1 auto; padding-inline: .9rem; font-size: .8125rem; }
}
@container hero (max-width: 600px) {
  .discovery-nav { gap: 1.25rem; flex-wrap: wrap; }
  .discovery-nav a { font-size: .75rem; }
}
</style>
