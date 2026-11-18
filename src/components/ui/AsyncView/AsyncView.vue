<script setup lang="ts">
  import type { ApiError } from '@/services/http'
  import ErrorMessage from '../ErrorMessage/ErrorMessage.vue'
  import CardGridSkeleton from '../LoadingSkeleton/CardGridSkeleton.vue'
  import LoadingSkeleton from '../LoadingSkeleton/LoadingSkeleton.vue'

  withDefaults(defineProps<{
    loading: boolean
    error: ApiError | null
    /** Mostra a mensagem de vazio no lugar do conteúdo. */
    empty?: boolean
    emptyMessage?: string
    lines?: number
    /** 'cards' mostra a grade de cartões em esqueleto. */
    skeleton?: 'lines' | 'cards'
    skeletonCount?: number
  }>(), {
    skeleton: 'lines',
    skeletonCount: 4,
    empty: false,
    emptyMessage: 'Nenhum resultado encontrado.',
    lines: 4,
  })

  defineEmits<{ (e: 'retry'): void }>()
</script>

<template>
  <ErrorMessage v-if="error" :message="error.message" @retry="$emit('retry')" />

  <div v-else-if="loading" class="async-skeleton">
    <CardGridSkeleton v-if="skeleton === 'cards'" :count="skeletonCount" />
    <LoadingSkeleton v-else :lines="lines" />
  </div>

  <p v-else-if="empty" class="async-content py-8 text-center text-app-text-muted-neutral">{{ emptyMessage }}</p>
  <div v-else class="async-content min-w-0"><slot /></div>
</template>

<style scoped>
  .async-skeleton { animation: reveal-content 160ms ease-out 120ms both; }
  .async-content { animation: reveal-content 180ms ease-out both; }

  @keyframes reveal-content {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @media (prefers-reduced-motion: reduce) {
    .async-skeleton, .async-content { animation: none; }
  }
</style>
