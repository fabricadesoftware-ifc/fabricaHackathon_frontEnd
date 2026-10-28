<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{
  title: string
  description: string
  icon: string
  to: string
}>()
</script>

<template>
  <RouterLink
    :to="to"
    class="group flex min-w-0 items-center gap-3
           rounded-lg border border-blue-100
           bg-white/90 px-4 py-3.5
           transition-all duration-200
           hover:-translate-y-0.5
           hover:border-blue-200
           hover:bg-white
           hover:shadow-sm
           focus-visible:outline-2
           focus-visible:outline-offset-2
           focus-visible:outline-blue-500"
  >
    <!-- Ícone -->
    <div
      class="flex h-10 w-10 shrink-0
             items-center justify-center
             rounded-lg bg-blue-50
             text-blue-600
             transition-colors
             group-hover:bg-blue-100"
    >
      <span
        :class="['mdi', icon]"
        class="text-xl"
        aria-hidden="true"
      />
    </div>

    <!-- Informações -->
    <div class="min-w-0">
      <h3
        class="text-sm font-semibold
               text-slate-900"
      >
        {{ title }}
      </h3>

      <p
        class="mt-0.5 text-xs
               leading-4 text-slate-500"
      >
        {{ description }}
      </p>
    </div>
  </RouterLink>
</template>