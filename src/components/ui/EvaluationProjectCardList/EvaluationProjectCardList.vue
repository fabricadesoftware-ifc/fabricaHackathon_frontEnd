<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import EvaluationBadge from '@/components/ui/EvaluationBadge'

  interface BaseProjectProps {
    avatar?: string | null
    name: string
    teamName: string
    /** Projeto já avaliado continua clicável (ex.: avaliação ainda aberta, para ajustar notas). */
    editable?: boolean
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
    = | PendingProjectProps
      | EvaluatedProjectProps

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

  const isLocked = computed(() => !props.editable)

  function handleClick () {
    if (isLocked.value) return

    emit('click')
  }

  function handleImageError () {
    imageError.value = true
  }
</script>

<template>
  <button
    class="flex w-full flex-wrap items-center justify-between gap-y-3 p-4 text-left transition-colors duration-150 sm:p-5 focus-visible:outline-2 focus-visible:outline-blue-600"
    :class="
      isLocked
        ? 'cursor-default bg-slate-50/50'
        : 'cursor-pointer bg-white hover:bg-blue-50/50'
    "
    :disabled="isLocked"
    type="button"
    @click="handleClick"
  >
    <!-- Informações do projeto -->
    <div class="mr-2 flex min-w-0 flex-1 items-center gap-3 sm:gap-4">

      <!-- Avatar -->
      <div
        class="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100"
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
          class="flex size-full items-center justify-center text-base font-bold text-blue-600 sm:text-lg"
        >
          {{ projectInitial }}
        </span>
      </div>

      <!-- Nome e equipe -->
      <div class="min-w-0">
        <p
          class="break-words text-sm font-semibold sm:text-base"
          :class="'text-slate-700'"
        >
          {{ props.name }}
        </p>

        <p
          class="mt-0.5 truncate text-xs sm:text-sm"
          :class="'text-slate-500'"
        >
          {{ props.teamName }}
        </p>
      </div>
    </div>

    <!-- Status -->
    <div class="ml-3 flex shrink-0 items-center gap-3">
      <EvaluationBadge
        v-if="props.status === 'avaliado'"
        :score="props.score"
        status="Avaliado"
      />

      <EvaluationBadge
        v-else
        status="Pendente"
      />

      <span v-if="!isLocked" aria-hidden="true" class="mdi mdi-chevron-right text-xl text-slate-400" />
    </div>
  </button>
</template>
