<script setup lang="ts">
  import { computed } from 'vue'

  const props = defineProps<{
    steps: string[]
    currentStep: number
  }>()

  // Organiza as etapas de acordo com o status.
  const etapas = computed(() =>
    props.steps.map((nome, index) => {
      const concluida = index < props.currentStep
      const atual = index === props.currentStep
      const pendente = index > props.currentStep

      return {
        nome,
        concluida,
        atual,
        pendente,

        label: concluida
          ? 'Concluída'
          : (atual
            ? 'Em andamento'
            : 'Não iniciada'),
      }
    }),
  )
</script>

<template>
  <div class="w-full">
    <ol class="flex flex-col">
      <li
        v-for="(etapa, index) in etapas"
        :key="index"
        :aria-current="
          etapa.atual ? 'step' : undefined
        "
        class="relative flex gap-4
               pb-7 last:pb-0"
      >
        <!-- Linha vertical -->
        <div
          v-if="index < etapas.length - 1"
          aria-hidden="true"
          class="absolute left-[7px]
                 top-4 bottom-0 w-[2px]"
          :class="
            etapa.concluida
              ? 'bg-app-selection-strong'
              : 'bg-app-surface-skeleton'
          "
        />

        <!-- Indicador -->
        <div
          aria-hidden="true"
          class="relative z-10 mt-0.5
                 flex h-4 w-4 shrink-0
                 items-center justify-center
                 rounded-full border-2"
          :class="[
            etapa.atual
              ? 'border-app-brand-border-500 bg-app-action-indicator'
              : etapa.concluida
                ? 'border-app-brand-border-400 bg-app-action-indicator-soft'
                : 'border-app-border-strong bg-app-surface-step-pending',
          ]"
        >
          <span
            v-if="etapa.atual"
            class="h-1.5 w-1.5
                   rounded-full bg-app-surface"
          />
        </div>

        <!-- Informações -->
        <div
          class="flex min-w-0 flex-1
                 flex-wrap items-start
                 justify-between gap-3"
        >
          <!-- Nome da etapa -->
          <div class="min-w-0">

            <h3
              class="text-sm font-medium leading-5"
              :class="[
                etapa.atual
                  ? 'text-app-link'
                  : etapa.concluida
                    ? 'text-app-text-secondary'
                    : 'text-app-text-muted',
              ]"
            >
              {{ etapa.nome }}
            </h3>

            <!-- Descrição -->
            <p
              class="mt-1 text-xs leading-4
                     text-app-text-muted"
            >
              {{
                etapa.concluida
                  ? 'Etapa concluída'
                  : etapa.atual
                    ? 'Etapa atual do hackathon'
                    : 'Aguardando início'
              }}
            </p>

          </div>

          <!-- Badge da etapa -->
          <span
            class="inline-flex shrink-0
                   items-center gap-1.5
                   rounded-full px-3 py-1
                   text-xs font-medium"
            :class="[
              etapa.atual
                ? 'bg-app-positive-surface-50 text-app-positive-text-600'
                : etapa.concluida
                  ? 'bg-app-selection-soft text-app-link'
                  : 'bg-app-surface-muted text-app-text-muted',
            ]"
          >
            <span
              aria-hidden="true"
              class="h-1.5 w-1.5 rounded-full"
              :class="[
                etapa.atual
                  ? 'bg-app-positive-surface-500'
                  : etapa.concluida
                    ? 'bg-app-action-indicator-soft'
                    : 'bg-app-surface-step-marker',
              ]"
            />

            {{ etapa.label }}
          </span>

        </div>
      </li>
    </ol>
  </div>
</template>
