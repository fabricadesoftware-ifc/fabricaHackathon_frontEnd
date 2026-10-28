<script setup lang="ts">
import LoginIllustration from './LoginIllustration.vue'
import RegisterIllustration from './RegisterIllustration.vue'

defineProps<{
  mode: 'login' | 'register'
}>()
</script>

<template>
  <div class="grid min-h-screen grid-rows-[auto_1fr] bg-white lg:grid-cols-[minmax(0,46%)_minmax(0,54%)] lg:grid-rows-none">
    <section
      class="auth-panel relative flex flex-col overflow-hidden border-b border-blue-100 bg-[#F3F7FF] py-5 lg:min-h-screen lg:border-b-0 lg:border-r"
      aria-label="Sobre o HackIFC"
    >
      <div class="relative z-10 flex items-center gap-3">
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#2563EB] text-white" aria-hidden="true">
          <span class="text-xl font-bold leading-none">H</span>
        </div>
        <div class="min-w-0">
          <div class="text-base font-bold tracking-tight text-slate-800">
            HackIFC <span class="text-[#2563EB]">// 24H</span>
          </div>
          <div class="text-[11px] font-medium uppercase tracking-[0.15em] text-slate-500">
            Plataforma de hackathons
          </div>
        </div>
      </div>

      <div class="auth-story relative z-10 hidden w-full max-w-[540px] flex-1 flex-col justify-center lg:flex">
        <p class="mb-4 text-xs font-semibold uppercase tracking-[0.17em] text-blue-600">
          {{ mode === 'login' ? 'O seu próximo desafio começa aqui' : 'Da ideia à apresentação' }}
        </p>
        <p v-if="mode === 'login'" class="story-title font-bold tracking-tight text-slate-800">
          24 horas para construir o <span class="text-[#2563EB]">futuro.</span>
        </p>
        <p v-else class="story-title font-bold tracking-tight text-slate-800">
          Transforme ideias em <span class="text-[#2563EB]">projetos reais.</span>
        </p>
        <p v-if="mode === 'login'" class="story-description mt-4 max-w-[460px] text-slate-600">
          Participe de hackathons, forme sua equipe e desenvolva projetos que saem do papel.
        </p>
        <p v-else class="story-description mt-4 max-w-[460px] text-slate-600">
          Participe das edições do HackIFC e desenvolva soluções junto de outras pessoas.
        </p>
        <LoginIllustration v-if="mode === 'login'" class="mt-9" />
        <RegisterIllustration v-else class="mt-9" />
      </div>

      <div class="relative z-10 hidden items-center gap-3 border-t border-blue-100 pt-6 text-sm text-slate-500 lg:flex">
        <span class="h-2 w-2 rounded-full bg-blue-500" aria-hidden="true" />
        Edições · Equipes · Projetos
      </div>
    </section>

    <div class="flex min-w-0 items-center justify-center px-5 py-10 sm:px-10 sm:py-14 lg:px-12 lg:py-12">
      <div :class="mode === 'register' ? 'w-full max-w-[520px]' : 'w-full max-w-[440px]'">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-panel {
  padding-inline: 24px;
}

.auth-story {
  padding-block: 28px;
}

.story-title {
  font-size: clamp(34px, 3vw, 44px);
  line-height: 1.12;
}

.story-description {
  font-size: 15px;
  line-height: 1.65;
}

@media (min-width: 1024px) {
  .auth-panel {
    padding: 40px clamp(36px, 4.2vw, 64px);
  }
}

@media (min-width: 1024px) and (max-height: 760px) {
  .auth-story {
    padding-block: 16px;
  }

  .story-title {
    font-size: 34px;
  }
}

:deep(button:focus-visible),
:deep(input[type="checkbox"]:focus-visible) {
  outline: 2px solid #2563EB;
  outline-offset: 3px;
}
</style>
