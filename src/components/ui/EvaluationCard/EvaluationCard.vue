<template>
  <div class="group hover:-translate-y-0.5 transition-all duration-350 w-fit cursor-pointer p-3 flex flex-col gap-4 shadow-xl rounded-lg" @click="emits('click')">
    <div class="flex gap-3">
      <img :alt="props.image" class="w-30 h-30 rounded-lg object-cover shrink-0" :src="props.image">

      <div class="flex justify-between items-start gap-[4vw] pt-2">
        <div>
          <h4 class="text-[#111827] text-[16px]">{{ props.title }}</h4>
          <p class="text-[#4B5563] text-[14px]">prazo final {{ props.deadline }}</p>
        </div>

        <statusSelect
          :label="label"
          :status="props.status"
        />
      </div>
    </div>

    <div class="flex flex-col gap-1">
      <ProgressBar
        :current="props.current"
        :label="props.progressLabel"
        :total="props.total"
      />

      <div class="flex justify-end">
        <span
          class="text-[20px] text-[#3B82F6] group-hover:text-[#1a60d2] mdi mdi-arrow-right"
          @click="emits('click')"
        />
      </div>
    </div>
  </div>

</template>
<script setup lang="ts">
  import { computed } from 'vue'

  import ProgressBar from '../ProgressBar'
  import statusSelect from '../statusSelect.vue'

  const label = computed(() => {
    if (props.status === 'inscricoes') return 'Inscrições'
    if (props.status === 'avaliacao') return 'Avaliação'
    if (props.status === 'andamento') return 'Andamento'
    return 'Finalizado'
  })
  type Status = 'inscricoes' | 'avaliacao' | 'andamento' | 'finalizado'
  const props = defineProps<{
    image: string
    title: string
    deadline: string
    current: number
    total: number
    progressLabel: string
    status: Status
  }>()
  const emits = defineEmits<{
    (e: 'click'): void
  }>()
</script>
