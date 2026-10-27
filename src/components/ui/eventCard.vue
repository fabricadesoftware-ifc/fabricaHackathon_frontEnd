<script setup lang="ts">
import { RouterLink } from 'vue-router'
import StatusBadge from '@/components/ui/statusSelect.vue'

type Status = 'inscricoes' | 'avaliacao' | 'andamento' | 'finalizado'

const props = defineProps<{
  id: number
  title: string
  image: string
  status: Status
  statusLabel: string
  startDate: string
  endDate: string
  teamsCounter: number
  location: string
  tags: string[]
}>()
</script>

<template>
  <RouterLink
    :to="{ name: 'edicoes', params: { id: props.id } }"
    class="group flex h-full w-full flex-col overflow-hidden
           rounded-lg border border-slate-200 bg-white
           shadow-sm transition-all duration-200
           hover:-translate-y-0.5 hover:border-blue-300
           hover:shadow-md"
  >
    <!-- Imagem da edição -->
    <div class="relative h-40 shrink-0 overflow-hidden bg-blue-200">

      <img
        :src="props.image"
        :alt="props.title"
        class="h-full w-full object-cover
               transition-transform duration-300
               group-hover:scale-105"
      >

      <!-- Sobreposição azul -->
      <div
        class="absolute inset-0 bg-gradient-to-r
               from-blue-950/30 via-blue-500/10 to-blue-400/30"
        aria-hidden="true"
      />

      <!-- Detalhes decorativos -->
      <div
        class="pointer-events-none absolute -right-16 -top-24
               h-64 w-64 rounded-full border border-white/20"
        aria-hidden="true"
      />

      <div
        class="pointer-events-none absolute -right-8 -top-14
               h-44 w-44 rounded-full border border-white/20"
        aria-hidden="true"
      />

      <!-- Status reutilizável -->
      <div class="absolute left-3 top-3">
        <StatusBadge
          :label="props.statusLabel"
          :status="props.status"
        />
      </div>
    </div>

    <!-- Conteúdo -->
    <div
      class="relative -mt-2 flex flex-1 flex-col
             rounded-t-lg bg-white px-5 pb-5 pt-5"
    >
      <!-- Título -->
      <h2
        class="line-clamp-2 text-base font-bold
               leading-6 tracking-tight text-slate-900"
        :title="props.title"
      >
        {{ props.title }}
      </h2>

      <!-- Tags -->
      <div class="mt-3 flex flex-wrap gap-2">
        <span
          v-for="tag in props.tags"
          :key="tag"
          class="inline-flex items-center rounded-full
                 bg-blue-100 px-3 py-1
                 text-xs font-medium text-blue-700"
        >
          {{ tag }}
        </span>
      </div>

      <!-- Informações da edição -->
      <div class="mt-5 space-y-3">

        <!-- Data -->
        <div class="flex items-start gap-3 text-sm text-slate-500">
          <span
            class="mdi mdi-calendar-blank-outline
                   w-5 shrink-0 text-xl leading-5 text-slate-500"
            aria-hidden="true"
          />

          <span class="leading-5">
            {{ props.startDate }} - {{ props.endDate }}
          </span>
        </div>

        <!-- Local -->
        <div
          v-if="props.location"
          class="flex items-start gap-3 text-sm text-slate-500"
        >
          <span
            class="mdi mdi-map-marker-outline
                   w-5 shrink-0 text-xl leading-5 text-slate-500"
            aria-hidden="true"
          />

          <span class="leading-5">
            {{ props.location }}
          </span>
        </div>

        <!-- Equipes -->
        <div class="flex items-start gap-3 text-sm text-slate-500">
          <span
            class="mdi mdi-account-group-outline
                   w-5 shrink-0 text-xl leading-5 text-slate-500"
            aria-hidden="true"
          />

          <span class="leading-5">
            {{ props.teamsCounter }}
            {{ props.teamsCounter === 1 ? 'equipe' : 'equipes' }}
          </span>
        </div>

      </div>
    </div>
  </RouterLink>
</template>