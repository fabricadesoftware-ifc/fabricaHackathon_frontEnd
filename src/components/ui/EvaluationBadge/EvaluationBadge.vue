<template>
  <div v-if="props.score !== undefined" class="bg-[#DCFCE7] border border-[#DCFCE7] gap-1" :class="baseStyle">
    <p :class="textColor">{{ props.status }}</p>
    <p :class="textColor">-</p>
    <p :class="textColor">{{ formattedScore }}</p>
  </div>

  <div v-else class="bg-[#FEF3C7] border border-[#FEF3C7]" :class="baseStyle">
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
    return props.status === 'Avaliado' ? 'text-[#16A34A]' : 'text-[#D97706]'
  })
</script>
