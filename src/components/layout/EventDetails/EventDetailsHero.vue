<script setup lang="ts">
import { RouterLink } from 'vue-router'

import StatusBadge from '@/components/ui/statusSelect.vue'

import type {
  EdicaoDetalhe,
  EdicaoStatus,
} from '@/types/edicao'

defineProps<{
  edicao: EdicaoDetalhe
  status: EdicaoStatus
  podeInscrever: boolean
  linkCopiado: boolean
}>()

defineEmits<{
  (e: 'compartilhar'): void
}>()
</script>

<template>
  <div
    class="relative overflow-hidden rounded-lg
           bg-slate-900"
  >
    <!-- Capa da edição -->
    <img
      :src="
        edicao.imagem_capa ||
        '/images/fabricaHackathonThumb.png'
      "
      alt=""
      class="absolute inset-0 h-full w-full object-cover"
    >

    <!-- Sobreposição escura -->
    <div
      class="absolute inset-0 bg-gradient-to-r
             from-slate-950/85
             via-slate-950/45
             to-slate-950/15"
      aria-hidden="true"
    />

    <!-- Conteúdo -->
    <div
      class="relative flex min-h-64 flex-col
             justify-between gap-8
             p-5 sm:p-7 lg:min-h-72 lg:p-9"
    >
      <!-- Linha superior -->
      <div
        class="flex flex-wrap items-start
               justify-between gap-3"
      >
        <StatusBadge
          :status="status"
          :label="edicao.status_label"
        />

        <button
          type="button"
          class="inline-flex items-center gap-2
                 rounded-lg bg-white/95
                 px-4 py-2 text-sm font-medium
                 text-slate-800
                 transition-colors hover:bg-white"
          @click="$emit('compartilhar')"
        >
          <span
            :class="[
              'mdi',
              linkCopiado
                ? 'mdi-check'
                : 'mdi-share-variant-outline',
            ]"
            aria-hidden="true"
          />

          {{ linkCopiado ? 'Link copiado' : 'Compartilhar' }}
        </button>
      </div>

      <!-- Informações principais -->
      <div
        class="flex flex-col gap-5
               sm:flex-row sm:items-end
               sm:justify-between"
      >
        <div class="min-w-0">
          <h1
            class="max-w-3xl text-2xl font-bold
                   leading-tight tracking-tight
                   text-white
                   sm:text-3xl lg:text-4xl"
          >
            {{ edicao.nome }}
          </h1>

          <p
            v-if="edicao.responsavel"
            class="mt-3 flex items-center gap-2
                   text-sm text-white/85"
          >
            <span
              class="mdi mdi-domain text-lg"
              aria-hidden="true"
            />

            Gerenciado por:
            <span class="font-medium text-white">
              {{ edicao.responsavel }}
            </span>
          </p>
        </div>

      </div>
    </div>
  </div>
</template>