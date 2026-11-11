<script setup lang="ts">
  import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="w-full min-w-0 flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
    <span class="text-6xl font-bold text-blue-600">404</span>
    <h1 class="text-2xl font-semibold text-gray-900">Página não encontrada</h1>
    <p class="max-w-md text-gray-600">O endereço que você tentou abrir não existe ou foi movido.</p>

    <RouterLink
      class="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
      to="/home"
    >
      Voltar para a Home
    </RouterLink>
  </section>
</template>
