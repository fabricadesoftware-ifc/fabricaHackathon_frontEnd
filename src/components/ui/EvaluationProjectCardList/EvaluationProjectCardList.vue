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

  type EvaluationProjectCardListProps
    = PendingProjectProps | EvaluatedProjectProps

  const props = defineProps<EvaluationProjectCardListProps>()

  const emit = defineEmits<{
    click: []
  }>()

  const imageError = ref(false)

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

  function handleClick () {
    emit('click')
  }

  function handleImageError () {
    imageError.value = true
  }
</script>

<template>
  <button
    class="group flex w-full items-center justify-between rounded-2xl border p-4 sm:p-5 text-left transition duration-150 hover:shadow-sm"
    :class="
      props.status === 'avaliado'
        ? 'border-gray-200 bg-[#E8E8E8]'
        : 'border-gray-200 bg-white hover:border-gray-300'
    "
    type="button"
    @click="handleClick"
  >
    <div class="flex min-w-0 items-center gap-3 sm:gap-4 flex-1 mr-2">
      <div
        class="flex size-12 sm:size-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-100 bg-white shadow-[0_3px_8px_rgba(0,0,0,0.12)]"
      >
        <img
          v-if="hasAvatar"
          :alt="`Avatar do projeto ${props.name}`"
          class="size-full object-cover"
          :src="props.avatar!"
          @error="handleImageError"
        >

        <span
          v-else
          class="flex size-full items-center justify-center text-base sm:text-lg font-bold text-blue-600"
        >
          {{ projectInitial }}
        </span>
      </div>

      <div class="min-w-0">
        <p class="truncate text-sm sm:text-base font-semibold text-gray-800">
          {{ props.name }}
        </p>

        <p class="mt-0.5 truncate text-xs sm:text-sm text-gray-500">
          {{ props.teamName }}
        </p>
      </div>
    </div>

    <div class="shrink-0 ml-3 flex items-center">
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
