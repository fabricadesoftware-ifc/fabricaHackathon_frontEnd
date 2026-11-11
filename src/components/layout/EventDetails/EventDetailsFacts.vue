<script setup lang="ts">
  import type { EdicaoDetalhe } from '@/types/edicao'
  import { computed } from 'vue'
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
  <div class="grid grid-cols-1 gap-y-5 py-4 sm:grid-cols-2 lg:grid-cols-4">
    <div
      v-for="(informacao, index) in informacoes"
      :key="informacao.id"
      class="flex min-w-0 items-center gap-3 px-2 sm:px-4 lg:px-5"
      :class="{
        'lg:border-l lg:border-app-border-default': index > 0,
        'lg:pl-0': index === 0,
      }"
    >
      <!-- Ícone -->
      <span
        aria-hidden="true"
        class="shrink-0 text-xl text-app-link-soft"
        :class="['mdi', informacao.icon]"
      />

      <!-- Informações -->
      <div class="min-w-0">
        <p class="text-xs font-medium text-app-text-placeholder">
          {{ informacao.label }}
        </p>

        <p class="mt-1 text-sm font-medium leading-5 text-app-text-secondary">
          {{ informacao.value }}
        </p>
      </div>
    </div>
  </div>
</template>
