<script setup lang="ts">
  defineProps<{
    revealed?: boolean
  }>()
</script>

<template>
  <svg aria-hidden="true" class="size-[38px]" focusable="false" viewBox="0 0 48 48">
    <path
      class="fill-app-brand-accent"
      d="M5 28.5 21.5 19a5 5 0 0 1 5 0L43 28.5a2.9 2.9 0 0 1 0 5L26.5 43a5 5 0 0 1-5 0L5 33.5a2.9 2.9 0 0 1 0-5Z"
    />

    <path
      :class="revealed ? 'fill-app-on-brand' : 'fill-app-project-logo-ink'"
      d="M5 12.5 21.5 3a5 5 0 0 1 5 0L43 12.5a2.9 2.9 0 0 1 0 5L26.5 27a5 5 0 0 1-5 0L5 17.5a2.9 2.9 0 0 1 0-5Z"
    />
  </svg>
</template>
