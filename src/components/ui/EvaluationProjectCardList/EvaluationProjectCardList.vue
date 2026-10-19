<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import EvaluationBadge from '@/components/ui/EvaluationBadge'

interface BaseProjectProps {
  avatar?: string | null
  name: string
  teamName: string
}

interface PendingProjectProps extends BaseProjectProps {
  status: 'pendente'
  score?: undefined
}

interface EvaluatedProjectProps extends BaseProjectProps {
  status: 'avaliado'
  score: number
}

type EvaluationProjectCardListProps =
  | PendingProjectProps
  | EvaluatedProjectProps

const props = defineProps<EvaluationProjectCardListProps>()

const emit = defineEmits<{
  click: []
}>()

const imageError = ref(false)

const isEvaluated = computed(() => props.status === 'avaliado')

watch(
  () => props.avatar,
  () => {
    imageError.value = false
  },
)

const hasAvatar = computed(() => {
  return Boolean(props.avatar) && !imageError.value
})

const projectInitial = computed(() => {
  return props.name.trim().charAt(0).toUpperCase()
})

function handleClick() {
  if (isEvaluated.value) return

  emit('click')
}

function handleImageError() {
  imageError.value = true
}
</script>

<template>
  <button
    type="button"
    :disabled="isEvaluated"
    class="flex w-full items-center justify-between rounded-2xl border p-4 text-left transition-all duration-150 sm:p-5"
    :class="
      isEvaluated
        ? 'cursor-not-allowed border-gray-200 bg-gray-100 opacity-55'
        : 'cursor-pointer border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
    "
    @click="handleClick"
  >
    <!-- Informações do projeto -->
    <div class="mr-2 flex min-w-0 flex-1 items-center gap-3 sm:gap-4">

      <!-- Avatar -->
      <div
        class="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-100 bg-white shadow-sm sm:size-14"
      >
        <img
          v-if="hasAvatar"
          :alt="`Avatar do projeto ${props.name}`"
          class="size-full object-cover"
          :src="props.avatar!"
          @error="handleImageError"
        />

        <span
          v-else
          class="flex size-full items-center justify-center text-base font-bold text-blue-600 sm:text-lg"
        >
          {{ projectInitial }}
        </span>
      </div>

      <!-- Nome e equipe -->
      <div class="min-w-0">
        <p
          class="truncate text-sm font-semibold sm:text-base"
          :class="isEvaluated ? 'text-gray-500' : 'text-gray-800'"
        >
          {{ props.name }}
        </p>

        <p
          class="mt-0.5 truncate text-xs sm:text-sm"
          :class="isEvaluated ? 'text-gray-400' : 'text-gray-500'"
        >
          {{ props.teamName }}
        </p>
      </div>
    </div>

    <!-- Status -->
    <div class="ml-3 flex shrink-0 items-center">
      <EvaluationBadge
        v-if="props.status === 'avaliado'"
        :score="props.score"
        status="Avaliado"
      />

      <EvaluationBadge
        v-else
        status="Pendente"
      />
    </div>
  </button>
</template>