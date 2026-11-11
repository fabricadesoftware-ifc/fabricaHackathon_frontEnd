<script setup lang="ts">
  import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="w-full min-w-0 flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
    <span class="text-6xl font-bold text-app-link">404</span>
    <h1 class="text-2xl font-semibold text-app-text-strong-neutral">Página não encontrada</h1>
    <p class="max-w-md text-app-text-secondary-neutral">O endereço que você tentou abrir não existe ou foi movido.</p>

    <RouterLink
      class="rounded-lg bg-app-action px-5 py-2.5 text-sm font-medium text-app-on-brand hover:bg-app-action-hover"
      to="/home"
    >
      Voltar para a Home
    </RouterLink>
  </section>
</template>
