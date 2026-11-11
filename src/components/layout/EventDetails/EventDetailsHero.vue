<script setup lang="ts">
  import type {
    EdicaoDetalhe,
    EdicaoStatus,
  } from '@/types/edicao'

  import StatusBadge from '@/components/ui/statusSelect.vue'

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
           bg-app-surface-inverse"
  >
    <!-- Capa da edição -->
    <img
      alt=""
      class="absolute inset-0 h-full w-full object-cover"
      :src="
        edicao.imagem_capa ||
          '/images/fabricaHackathonThumb.png'
      "
    >

    <!-- Sobreposição escura -->
    <div
      aria-hidden="true"
      class="absolute inset-0 bg-gradient-to-r
             from-slate-950/85
             via-slate-950/45
             to-slate-950/15"
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
          :label="edicao.status_label"
          :status="status"
        />

        <button
          class="inline-flex items-center gap-2
                 rounded-lg bg-app-surface/95
                 px-4 py-2 text-sm font-medium
                 text-app-text-heading
                 transition-colors hover:bg-app-surface"
          type="button"
          @click="$emit('compartilhar')"
        >
          <span
            aria-hidden="true"
            :class="[
              'mdi',
              linkCopiado
                ? 'mdi-check'
                : 'mdi-share-variant-outline',
            ]"
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
                   text-app-on-brand
                   sm:text-3xl lg:text-4xl"
          >
            {{ edicao.nome }}
          </h1>

          <p
            v-if="edicao.responsavel"
            class="mt-3 flex items-center gap-2
                   text-sm text-app-on-brand/85"
          >
            <span
              aria-hidden="true"
              class="mdi mdi-domain text-lg"
            />

            Gerenciado por:
            <span class="font-medium text-app-on-brand">
              {{ edicao.responsavel }}
            </span>
          </p>
        </div>

      </div>
    </div>
  </div>
</template>
