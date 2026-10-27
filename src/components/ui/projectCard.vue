<script setup lang="ts">
import { computed } from 'vue'
import StatusProject from './statusProject.vue'

type Status = 'finalizado' | 'ativo'

const props = withDefaults(defineProps<{
  title: string
  description: string
  team: string
  event: string
  logo: string
  status: Status
  statusLabel: string

  cover?: string | null
  deployUrl?: string | null
  editavel?: boolean
  preAvaliacaoTo?: string
  notaFinal?: string | null
}>(), {
  cover: null,
  deployUrl: null,
  editavel: false,
  preAvaliacaoTo: undefined,
  notaFinal: null,
})

const emit = defineEmits<{
  (e: 'edit'): void
}>()

const inicialProjeto = computed(() =>
  props.title.trim().charAt(0).toUpperCase() || 'P',
)
</script>

<template>
  <article
    class="group flex w-full flex-col overflow-hidden
           rounded-lg border border-slate-200 bg-white
           shadow-sm transition-all duration-200
           hover:-translate-y-0.5 hover:border-blue-200
           hover:shadow-md"
  >
    <!-- Capa -->
    <div
  class="relative h-28 shrink-0 overflow-hidden"
  style="background: linear-gradient(135deg, #93C5FD 0%, #60A5FA 50%, #3B82F6 100%);"
>
      <img
        v-if="cover"
        :src="cover"
        :alt="`Capa de ${title}`"
        class="h-full w-full object-cover
               transition-transform duration-300
               group-hover:scale-105"
      >

      <!-- Fundo quando não existe capa -->
      <div
        v-else
        class="absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div
          class="absolute -right-8 -top-16 h-48 w-48
                 rounded-full border border-white/10"
        />

        <div
          class="absolute -right-2 -top-8 h-32 w-32
                 rounded-full border border-white/10"
        />

        <div
          class="absolute -bottom-20 -left-12 h-44 w-44
                 rounded-full bg-blue-400/10 blur-2xl"
        />
      </div>

      <!-- Status reutilizável -->
      <div class="absolute right-3 top-3">
        <StatusProject
          :label="statusLabel"
          :status="status"
        />
      </div>
    </div>

    <!-- Conteúdo -->
    <div class="relative flex flex-col px-4 pb-4">

      <!-- Logo -->
      <div
        class="relative z-10 -mt-5 mb-2 flex h-11 w-11
               shrink-0 items-center justify-center
               overflow-hidden rounded-xl border-[3px]
               border-white bg-slate-100 shadow-sm"
      >
        <img
          v-if="logo"
          :src="logo"
          :alt="`Logo de ${title}`"
          class="h-full w-full object-cover"
        >

        <span
          v-else
          class="text-lg font-bold text-slate-700"
          aria-hidden="true"
        >
          {{ inicialProjeto }}
        </span>
      </div>

      <!-- Nome -->
      <h3
        class="truncate text-base font-bold
               tracking-tight text-slate-900"
        :title="title"
      >
        {{ title }}
      </h3>

      <!-- Descrição -->
      <p
        class="mt-1 line-clamp-2 text-sm
               leading-5 text-slate-500"
        :title="description || undefined"
      >
        {{ description || 'Este projeto ainda não possui descrição.' }}
      </p>

      <!-- Informações -->
      <div class="mt-3 space-y-1.5">

        <!-- Equipe -->
        <div class="flex min-w-0 items-center gap-2">
          <span
            class="mdi mdi-account-group-outline
                   shrink-0 text-base text-slate-400"
            aria-hidden="true"
          />

          <span class="truncate text-sm font-medium text-slate-700">
            {{ team }}
          </span>
        </div>

        <!-- Edição -->
        <div
          v-if="event"
          class="flex min-w-0 items-center gap-2"
        >
          <span
            class="mdi mdi-trophy-outline
                   shrink-0 text-base text-blue-600"
            aria-hidden="true"
          />

          <span class="truncate text-sm font-medium text-blue-600">
            {{ event }}
          </span>
        </div>

        <!-- Nota final -->
        <div
          v-if="notaFinal !== null && notaFinal !== undefined"
          class="flex items-center gap-2 text-sm"
        >
          <span
            class="mdi mdi-star-outline
                   text-base text-amber-500"
            aria-hidden="true"
          />

          <span class="text-slate-500">
            Nota final:
            <strong class="text-slate-900">
              {{ notaFinal }}
            </strong>
          </span>
        </div>
      </div>

      <!-- Ações -->
      <div
        v-if="deployUrl || preAvaliacaoTo || editavel"
        class="mt-3 flex flex-col gap-2
               border-t border-slate-100 pt-3"
      >
        <!-- Acessar sistema -->
        <a
          v-if="deployUrl"
          :href="deployUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex min-h-10 w-full items-center
                 justify-center gap-2 rounded-lg
                 bg-blue-600 px-4 py-2
                 text-sm font-semibold text-white
                 transition-colors hover:bg-blue-700"
        >
          <span
            class="mdi mdi-open-in-new text-base"
            aria-hidden="true"
          />

          Acessar sistema

          <span
            class="mdi mdi-arrow-right text-base"
            aria-hidden="true"
          />
        </a>

        <!-- Ações do participante -->
        <div
          v-if="preAvaliacaoTo || editavel"
          class="flex flex-wrap gap-2"
        >
          <RouterLink
            v-if="preAvaliacaoTo"
            :to="preAvaliacaoTo"
            class="inline-flex min-h-9 flex-1 items-center
                   justify-center gap-2 rounded-lg
                   border border-slate-200 bg-white
                   px-3 py-2 text-sm font-medium
                   text-slate-600 transition-colors
                   hover:bg-slate-50"
          >
            <span
              class="mdi mdi-clipboard-text-outline"
              aria-hidden="true"
            />

            Pré-avaliação
          </RouterLink>

          <button
            v-if="editavel"
            type="button"
            class="inline-flex min-h-9 flex-1 items-center
                   justify-center gap-2 rounded-lg
                   border border-slate-200 bg-white
                   px-3 py-2 text-sm font-medium
                   text-slate-600 transition-colors
                   hover:bg-slate-50"
            @click="emit('edit')"
          >
            <span
              class="mdi mdi-pencil-outline"
              aria-hidden="true"
            />

            Editar
          </button>
        </div>
      </div>

    </div>
  </article>
</template>