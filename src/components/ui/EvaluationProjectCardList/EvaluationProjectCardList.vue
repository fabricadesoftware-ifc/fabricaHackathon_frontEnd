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
    class="
      relative mx-4 mb-3 flex
      w-[calc(100%-2rem)]
      rounded-xl border px-4 py-3
      text-left transition duration-150
    "
    :class="
      props.status === 'avaliado'
        ? 'border-[#D9D9D9] bg-[#D9D9D9]'
        : 'border-[#E5E7EB] bg-white'
    "
    type="button"
    @click="handleClick"
  >
    <div
      class="flex min-w-0 items-center gap-3 pr-28"
      :class="props.status === 'avaliado' ? 'opacity-[0.49]' : ''"
    >
      <div
        class="
    flex size-10 shrink-0
    items-center justify-center
    overflow-hidden rounded-full
    border border-[#D1D5DB]
    bg-white
    shadow-[0_3px_6px_rgba(0,0,0,0.18)]
  "
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
          class="
            flex size-full items-center
            justify-center text-sm
            font-semibold text-[#2563EB]
          "
        >
          {{ projectInitial }}
        </span>
      </div>

      <div class="min-w-0">
        <p class="truncate text-sm font-semibold text-[#374151]">
          {{ props.name }}
        </p>

        <p class="mt-0.5 truncate text-xs text-[#9CA3AF]">
          {{ props.teamName }}
        </p>
      </div>
    </div>

    <div
      class="absolute right-4 top-3"
      :class="props.status === 'avaliado' ? 'opacity-[0.49]' : ''"
    >
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
