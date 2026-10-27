<script setup lang="ts">
import { RouterLink } from 'vue-router'

withDefaults(defineProps<{
  title: string
  subtitle?: string
  to?: string
  linkText?: string
}>(), {
  subtitle: '',
  to: undefined,
  linkText: 'Ver todos',
})
</script>

<template>
  <div
    class="mb-5 flex flex-col gap-3
           sm:flex-row sm:items-end sm:justify-between"
  >
    <div class="space-y-1">
      <h2
        class="text-xl font-bold tracking-tight
               text-slate-900 sm:text-2xl"
      >
        {{ title }}
      </h2>

      <p
        v-if="subtitle"
        class="text-sm leading-5 text-slate-500"
      >
        {{ subtitle }}
      </p>
    </div>

    <RouterLink
      v-if="to"
      :to="to"
      class="inline-flex shrink-0 items-center
             gap-1.5 text-sm font-medium text-blue-600
             transition-colors hover:text-blue-700"
    >
      {{ linkText }}

      <span
        class="mdi mdi-arrow-right text-lg"
        aria-hidden="true"
      />
    </RouterLink>
  </div>
</template>