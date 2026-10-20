<script setup lang="ts">
  import type { ApiError } from '@/services/http'
  import ErrorMessage from '../ErrorMessage/ErrorMessage.vue'
  import LoadingSkeleton from '../LoadingSkeleton/LoadingSkeleton.vue'

  withDefaults(defineProps<{
    loading: boolean
    error: ApiError | null
    /** Mostra a mensagem de vazio no lugar do conteúdo. */
    empty?: boolean
    emptyMessage?: string
    lines?: number
  }>(), {
    empty: false,
    emptyMessage: 'Nenhum resultado encontrado.',
    lines: 4,
  })

  defineEmits<{ (e: 'retry'): void }>()
</script>

<template>
  <ErrorMessage v-if="error" :message="error.message" @retry="$emit('retry')" />
  <LoadingSkeleton v-else-if="loading" :lines="lines" />
  <p v-else-if="empty" class="py-8 text-center text-gray-500">{{ emptyMessage }}</p>
  <slot v-else />
</template>
