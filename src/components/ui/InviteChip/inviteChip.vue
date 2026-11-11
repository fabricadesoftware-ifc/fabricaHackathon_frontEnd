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
  <div class="inline-flex items-center gap-3 max-w-full bg-gray-50 border border-gray-200 rounded-full pl-4 pr-3 py-2">
    <span class="text-sm text-gray-900 truncate">
      {{ props.email }}
    </span>

    <span class="text-xs text-blue-600 lowercase shrink-0">
      {{ props.status }}
    </span>

    <button
      aria-label="Remover participante"
      class="shrink-0 flex items-center text-gray-500 hover:text-gray-900 transition-colors"
      type="button"
      @click="emits('remove')"
    >
      <span class="mdi mdi-close text-base" />
    </button>
  </div>
</template>
