<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 text-center">
    <span class="text-6xl font-bold text-blue-600">404</span>
    <h1 class="text-2xl font-semibold text-gray-900">Página não encontrada</h1>
    <p class="text-gray-600">O endereço que você tentou abrir não existe ou foi movido.</p>
    <RouterLink
      class="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
      to="/home"
    >
      Voltar para a Home
    </RouterLink>
  </section>
</template>
