<template>
  <div v-if="props.score !== undefined" class="bg-app-score-success border border-app-score-success gap-1" :class="baseStyle">
    <p :class="textColor">{{ props.status }}</p>
    <p :class="textColor">-</p>
    <p :class="textColor"><slot name="score">{{ formattedScore }}</slot></p>
  </div>

  <div v-else class="bg-app-score-pending border border-app-score-pending" :class="baseStyle">
    <p :class="textColor">{{ props.status }}</p>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  const baseStyle = 'w-fit items-center justify-center px-3.5 py-1 rounded-lg flex text-xs sm:text-sm font-medium'

  type EvaluationBadge
    = | {
      status: 'Pendente'
      score?: number
    } | {
      status: 'Avaliado'
      score: number
    }

  const props = defineProps<EvaluationBadge>()

  const formattedScore = computed(() => {
    if (props.score !== undefined) {
      return String(props.score).replace('.', ',')
    }
    return ''
  })

  const textColor = computed(() => {
    return props.status === 'Avaliado' ? 'text-app-score-positive' : 'text-app-score-warning'
  })
</script>
