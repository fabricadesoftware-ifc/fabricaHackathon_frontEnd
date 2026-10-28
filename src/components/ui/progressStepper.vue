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
        : atual
          ? 'Em andamento'
          : 'Não iniciada',
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
        class="relative flex gap-4
               pb-7 last:pb-0"
        :aria-current="
          etapa.atual ? 'step' : undefined
        "
      >
        <!-- Linha vertical -->
        <div
          v-if="index < etapas.length - 1"
          class="absolute left-[7px]
                 top-4 bottom-0 w-[2px]"
          :class="
            etapa.concluida
              ? 'bg-blue-200'
              : 'bg-slate-200'
          "
          aria-hidden="true"
        />

        <!-- Indicador -->
        <div
          class="relative z-10 mt-0.5
                 flex h-4 w-4 shrink-0
                 items-center justify-center
                 rounded-full border-2"
          :class="[
            etapa.atual
              ? 'border-blue-500 bg-blue-500'
              : etapa.concluida
                ? 'border-blue-400 bg-blue-400'
                : 'border-slate-300 bg-slate-300',
          ]"
          aria-hidden="true"
        >
          <span
            v-if="etapa.atual"
            class="h-1.5 w-1.5
                   rounded-full bg-white"
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
                  ? 'text-blue-600'
                  : etapa.concluida
                    ? 'text-slate-600'
                    : 'text-slate-500',
              ]"
            >
              {{ etapa.nome }}
            </h3>

            <!-- Descrição -->
            <p
              class="mt-1 text-xs leading-4
                     text-slate-500"
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
                ? 'bg-emerald-50 text-emerald-600'
                : etapa.concluida
                  ? 'bg-blue-50 text-blue-600'
                  : 'bg-slate-100 text-slate-500',
            ]"
          >
            <span
              class="h-1.5 w-1.5 rounded-full"
              :class="[
                etapa.atual
                  ? 'bg-emerald-500'
                  : etapa.concluida
                    ? 'bg-blue-400'
                    : 'bg-slate-400',
              ]"
              aria-hidden="true"
            />

            {{ etapa.label }}
          </span>

        </div>
      </li>
    </ol>
  </div>
</template>