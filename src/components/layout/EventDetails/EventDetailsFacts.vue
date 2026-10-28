<script setup lang="ts">
import { computed } from 'vue'

import type { EdicaoDetalhe } from '@/types/edicao'
import { formatarData } from '@/utils/format'

const props = defineProps<{
  edicao: EdicaoDetalhe
}>()

const informacoes = computed(() => [
  {
    id: 'periodo',
    icon: 'mdi-calendar-blank-outline',
    label: 'Período',
    value: `${formatarData(props.edicao.data_inicio)} - ${formatarData(props.edicao.data_fim)}`,
  },
  {
    id: 'tipo',
    icon: 'mdi-shape-outline',
    label: 'Tipo de edição',
    value: props.edicao.tipo_edicao || 'Não informado',
  },
  {
    id: 'local',
    icon: 'mdi-map-marker-outline',
    label: 'Local',
    value: props.edicao.local || 'Não informado',
  },
  {
    id: 'equipe',
    icon: 'mdi-account-group-outline',
    label: 'Tamanho da equipe',
    value: `${props.edicao.minimo_participantes} - ${props.edicao.maximo_participantes} participantes`,
  },
])
</script>

<template>
  <div
    class="grid grid-cols-1 gap-3
           sm:grid-cols-2 xl:grid-cols-4"
  >
    <div
      v-for="informacao in informacoes"
      :key="informacao.id"
      class="flex min-w-0 items-center gap-3
             rounded-lg border border-slate-200
             bg-white px-4 py-3.5"
    >
      <!-- Ícone -->
      <div
        class="flex h-10 w-10 shrink-0
               items-center justify-center
               rounded-lg bg-blue-50
               text-blue-600"
      >
        <span
          :class="['mdi', informacao.icon]"
          class="text-xl"
          aria-hidden="true"
        />
      </div>

      <!-- Informações -->
      <div class="min-w-0">
        <p
          class="text-xs font-medium
                 text-slate-500"
        >
          {{ informacao.label }}
        </p>

        <p
          class="mt-1 break-words text-sm
                 font-semibold leading-5
                 text-slate-800"
        >
          {{ informacao.value }}
        </p>
      </div>
    </div>
  </div>
</template>