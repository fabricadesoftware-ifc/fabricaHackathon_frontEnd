<template>
  <div v-if="props.score" class="bg-[#DCFCE7] gap-0.75 border-[#DCFCE7]" :class="baseStyle">
    <p :class="textColor">{{ props.status }}</p>
    <p :class="textColor">{{ '-' }}</p>
    <p :class="textColor">{{ props.score }}</p>
  </div>

  <div v-else class="bg-[#FEF3C7] border-[#E5E7EB]" :class="baseStyle">
    <p :class="textColor" style=" paint-order: stroke fill">{{ props.status }}</p>
  </div>
</template>
<script setup lang="ts">
  import { computed } from 'vue'

  const baseStyle = 'w-33 justify-center py-px rounded-lg flex '
  type EvaluationBadge
    = | {
      status: 'Pendente'
      score?: string
    } | {
      status: 'Avaliado'
      score: string
    }
  const props = defineProps<EvaluationBadge>()

  const textColor = computed(() => {
    return props.status == 'Avaliado' ? 'text-[#16A34A]' : 'text-[#D97706]'
  })
</script>
