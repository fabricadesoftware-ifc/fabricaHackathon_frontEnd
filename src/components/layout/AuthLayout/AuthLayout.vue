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
      aria-label="Sobre o HackIFC"
      class="auth-panel lg:py-10 lg:px-[clamp(36px,4.2vw,64px)] relative flex flex-col overflow-hidden border-b border-blue-100 bg-[#F3F7FF] py-[1.25rem] lg:min-h-screen lg:border-b-0 lg:border-r px-[24px]"
    >
      <div class="relative z-10 flex items-center gap-3">
        <div aria-hidden="true" class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#2563EB] text-white">
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

      <div class="auth-story [@media(min-width:1024px)_and_(max-height:760px)]:py-4 relative z-10 hidden w-full max-w-[540px] flex-1 flex-col justify-center lg:flex py-[28px]">
        <p class="mb-4 text-xs font-semibold uppercase tracking-[0.17em] text-blue-600">
          {{ mode === 'login' ? 'O seu próximo desafio começa aqui' : 'Da ideia à apresentação' }}
        </p>

        <p v-if="mode === 'login'" class="story-title [@media(min-width:1024px)_and_(max-height:760px)]:text-[34px] font-bold tracking-tight text-slate-800 text-[clamp(34px,_3vw,_44px)] leading-[1.12]">
          24 horas para construir o <span class="text-[#2563EB]">futuro.</span>
        </p>

        <p v-else class="story-title [@media(min-width:1024px)_and_(max-height:760px)]:text-[34px] font-bold tracking-tight text-slate-800 text-[clamp(34px,_3vw,_44px)] leading-[1.12]">
          Transforme ideias em <span class="text-[#2563EB]">projetos reais.</span>
        </p>

        <p v-if="mode === 'login'" class="story-description mt-4 max-w-[460px] text-slate-600 text-[15px] leading-[1.65]">
          Participe de hackathons, forme sua equipe e desenvolva projetos que saem do papel.
        </p>

        <p v-else class="story-description mt-4 max-w-[460px] text-slate-600 text-[15px] leading-[1.65]">
          Participe das edições do HackIFC e desenvolva soluções junto de outras pessoas.
        </p>

        <LoginIllustration v-if="mode === 'login'" class="mt-9" />
        <RegisterIllustration v-else class="mt-9" />
      </div>

      <div class="relative z-10 hidden items-center gap-3 border-t border-blue-100 pt-6 text-sm text-slate-500 lg:flex">
        <span aria-hidden="true" class="h-2 w-2 rounded-full bg-blue-500" />
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
:deep(button:focus-visible),
:deep(input[type="checkbox"]:focus-visible) {
  outline: 2px solid #2563EB;
  outline-offset: 3px;
}
</style>
