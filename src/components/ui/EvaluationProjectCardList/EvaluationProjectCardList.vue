<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import EvaluationBadge from '@/components/ui/EvaluationBadge'

  interface BaseProjectProps {
    avatar?: string | null
    name: string
    teamName: string
    /** Permite abrir um projeto pendente quando a avaliação da edição estiver aberta. */
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

  const isCompleted = computed(() => props.status === 'avaliado')
  const isLocked = computed(() => isCompleted.value || !props.editable)
  const formattedScore = computed(() => props.status === 'avaliado'
    ? props.score.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '')

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
    class="grid w-full grid-cols-1 gap-x-4 gap-y-3 p-4 text-left transition-colors duration-150 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-5 focus-visible:outline-2 focus-visible:outline-app-focus"
    :class="
      isLocked
        ? 'cursor-default bg-app-surface-subtle/50'
        : 'cursor-pointer bg-app-surface hover:bg-app-selection-soft/50'
    "
    :disabled="isLocked"
    type="button"
    @click="handleClick"
  >
    <!-- Informações do projeto -->
    <div class="flex min-w-0 items-center gap-3">

      <!-- Avatar -->
      <div
        class="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-app-surface-muted"
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
          class="flex size-full items-center justify-center text-base font-semibold"
          :class="isCompleted ? 'text-app-text-muted' : 'text-app-link'"
        >
          {{ projectInitial }}
        </span>
      </div>

      <!-- Nome e equipe -->
      <div class="min-w-0">
        <p
          class="break-words text-sm leading-6 sm:text-base"
          :class="isCompleted ? 'font-medium text-app-text-secondary' : 'font-semibold text-app-text-body-strong'"
        >
          {{ props.name }}
        </p>

        <p
          class="mt-0.5 break-words text-xs text-app-text-muted sm:text-sm"
        >
          {{ props.teamName }}
        </p>
      </div>
    </div>

    <!-- Status -->
    <div class="flex items-center gap-3 pl-13 sm:pl-0">
      <EvaluationBadge
        v-if="props.status === 'avaliado'"
        :score="props.score"
        status="Avaliado"
      >
        <template #score>{{ formattedScore }}</template>
      </EvaluationBadge>

      <EvaluationBadge
        v-else
        status="Pendente"
      />

      <span v-if="!isLocked" aria-hidden="true" class="mdi mdi-chevron-right ml-auto text-xl text-app-text-placeholder sm:ml-0" />
    </div>
  </button>
</template>
