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
           sm:flex-row sm:items-start sm:justify-between"
  >
    <div class="space-y-1">
      <h2
        class="text-xl font-semibold tracking-tight
               text-slate-900 sm:text-[22px]"
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
      class="inline-flex shrink-0 items-center
             min-h-11 gap-1.5 text-sm font-medium text-blue-600
             transition-colors hover:text-blue-700"
      :to="to"
    >
      {{ linkText }}

      <span
        aria-hidden="true"
        class="mdi mdi-arrow-right text-lg"
      />
    </RouterLink>
  </div>
</template>
