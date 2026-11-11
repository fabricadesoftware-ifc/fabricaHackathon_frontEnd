<script setup lang="ts">
  const props = defineProps<{
    email: string
    status: string
  }>()
  const emits = defineEmits<{
    remove: []
  }>()
</script>

<template>
  <div class="inline-flex items-center gap-3 max-w-full bg-app-surface-subtle-neutral border border-app-border-default-neutral rounded-full pl-4 pr-3 py-2">
    <span class="text-sm text-app-text-strong-neutral truncate">
      {{ props.email }}
    </span>

    <span class="text-xs text-app-link lowercase shrink-0">
      {{ props.status }}
    </span>

    <button
      aria-label="Remover participante"
      class="shrink-0 flex items-center text-app-text-muted-neutral hover:text-app-text-strong-neutral transition-colors"
      type="button"
      @click="emits('remove')"
    >
      <span class="mdi mdi-close text-base" />
    </button>
  </div>
</template>
