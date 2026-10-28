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
           rounded-md px-2 py-3
           transition-colors duration-150
           hover:bg-white/60
           focus-visible:outline-2
           focus-visible:outline-blue-500"
  >
    <!-- Ícone -->
    <span
      class="flex h-9 w-9 shrink-0
             items-center justify-center
             rounded-md bg-white
             text-blue-600"
    >
      <span
        :class="['mdi', icon]"
        class="text-lg"
        aria-hidden="true"
      />
    </span>

    <!-- Textos -->
    <span class="min-w-0 flex-1">
      <span
        class="block text-sm font-semibold
               text-slate-800
               transition-colors
               group-hover:text-blue-700"
      >
        {{ title }}
      </span>

      <span
        class="mt-0.5 block text-xs
               leading-4 text-slate-500"
      >
        {{ description }}
      </span>
    </span>

    <!-- Indicador -->
    <span
      class="mdi mdi-chevron-right
             shrink-0 text-lg text-slate-400
             transition-all duration-150
             group-hover:translate-x-0.5
             group-hover:text-blue-600"
      aria-hidden="true"
    />
  </RouterLink>
</template>