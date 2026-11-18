<script setup lang="ts">
  import { computed } from 'vue'
  import { selectedTheme, toggleTheme } from '../../theme/state'

  const props = withDefaults(defineProps<{ minimal?: boolean }>(), { minimal: false })
  const isDark = computed(() => selectedTheme.value === 'dark')
  const label = computed(() => `Tema ${isDark.value ? 'escuro' : 'claro'} ativo. Ativar tema ${isDark.value ? 'claro' : 'escuro'}`)
</script>

<template>
  <button
    :aria-label="label"
    :aria-pressed="isDark"
    class="inline-flex shrink-0 items-center justify-center rounded-lg transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-focus-ring motion-reduce:transition-none"
    :class="props.minimal
      ? 'size-10 text-app-text-secondary-neutral hover:bg-app-surface-muted-neutral hover:text-app-text-strong-neutral'
      : 'aspect-square w-8 border-[1px] border-app-brand-border-200 bg-app-canvas text-app-text-strong hover:border-app-brand-border-400 hover:bg-app-surface-muted'"
    data-theme-control
    :title="label"
    type="button"
    @click="toggleTheme"
  >
    <svg
      aria-hidden="true"
      class="size-5"
      fill="none"
      focusable="false"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.5"
      viewBox="0 0 24 24"
    >
      <path v-if="isDark" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />

      <g v-else>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
      </g>
    </svg>
  </button>
</template>
