<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import StatusBadge from '@/components/ui/statusSelect.vue'

import type {
  EdicaoDetalhe,
  EdicaoStatus,
} from '@/types/edicao'

const props = defineProps<{
  edicao: EdicaoDetalhe
  status: EdicaoStatus
  podeInscrever: boolean
}>()

defineEmits<{
  (e: 'ver-equipes'): void
}>()

const equipesDestaque = computed(() =>
  props.edicao.equipes.slice(0, 3),
)

const mensagemStatus = computed(() => {
  switch (props.status) {
    case 'inscricoes':
      return 'As inscrições estão abertas para esta edição.'

    case 'andamento':
      return 'Esta edição está em andamento.'

    case 'avaliacao':
      return 'Os projetos estão na etapa de avaliação.'

    case 'finalizado':
      return 'Esta edição foi finalizada.'
  }
})
</script>

<template>
  <aside class="space-y-4">

    <!-- SITUAÇÃO DA EDIÇÃO -->
    <section
      class="rounded-lg border border-slate-200 bg-white p-5"
    >
      <div class="flex flex-wrap items-center justify-between gap-3">
        <h2 class="text-base font-semibold text-slate-700">
          Situação da edição
        </h2>

        <StatusBadge
          :status="status"
          :label="edicao.status_label"
        />
      </div>

      <p
        class="mt-3 rounded-lg bg-slate-50 px-3 py-3
               text-sm leading-5 text-slate-500"
      >
        {{ mensagemStatus }}
      </p>

      <RouterLink
        v-if="status === 'inscricoes' && podeInscrever"
        :to="{
          path: '/novo',
          query: { edicao_id: edicao.id },
        }"
        class="mt-4 flex min-h-11 w-full items-center
               justify-center gap-2 rounded-lg bg-blue-600
               px-4 py-2.5 text-sm font-semibold text-white
               transition-colors hover:bg-blue-700"
      >
        <span
          class="mdi mdi-ticket-outline text-lg"
          aria-hidden="true"
        />

        Inscrever-se nesta edição
      </RouterLink>
    </section>

    <!-- EQUIPES PARTICIPANTES -->
    <section
      class="rounded-lg border border-slate-200
             bg-white p-4 sm:p-5"
    >
      <!-- Cabeçalho -->
      <div class="flex items-center justify-between gap-3">
        <h2 class="text-sm font-semibold text-slate-700">
          Equipes participantes
        </h2>

        <button
          v-if="edicao.equipes.length > 0"
          type="button"
          class="inline-flex shrink-0 items-center gap-1
                 text-xs font-medium text-blue-600
                 transition-colors hover:text-blue-700"
          @click="$emit('ver-equipes')"
        >
          Ver todas ({{ edicao.equipes.length }})

          <span
            class="mdi mdi-arrow-right text-sm"
            aria-hidden="true"
          />
        </button>
      </div>

      <!-- Lista de equipes -->
      <div
        v-if="equipesDestaque.length"
        class="mt-4 space-y-2"
      >
        <article
  v-for="equipe in equipesDestaque"
  :key="equipe.id"
  class="flex items-start gap-3 rounded-lg
         bg-slate-50/60 p-3"
>
          <!-- Logo / inicial do projeto -->
          <div
            class="flex h-9 w-9 shrink-0 items-center
                   justify-center overflow-hidden rounded-lg
                   bg-blue-50 text-sm font-semibold text-blue-600"
          >
            <img
              v-if="equipe.projeto?.logo_projeto"
              :src="equipe.projeto.logo_projeto"
              :alt="`Logo de ${equipe.projeto.nome_projeto}`"
              class="h-full w-full object-cover"
            >

            <span v-else>
              {{
                (
                  equipe.projeto?.nome_projeto ||
                  equipe.nome_equipe
                ).charAt(0).toUpperCase()
              }}
            </span>
          </div>

          <!-- Informações -->
          <div class="min-w-0 flex-1">

            <!-- Nome do projeto -->
            <h3
              class="truncate text-sm font-semibold
                     leading-5 text-slate-700"
            >
              {{
                equipe.projeto?.nome_projeto ||
                equipe.nome_equipe
              }}
            </h3>

            <!-- Descrição -->
            <p
              v-if="equipe.projeto?.descricao_projeto"
              class="mt-0.5 line-clamp-1 text-xs
                     leading-4 text-slate-500"
            >
              {{ equipe.projeto.descricao_projeto }}
            </p>

            <!-- Nome da equipe -->
            <div
              class="mt-2 flex min-w-0 items-center
                     gap-1.5 text-xs text-slate-500"
            >
              <span
                class="mdi mdi-account-group-outline
                       shrink-0 text-sm text-slate-400"
                aria-hidden="true"
              />

              <span class="truncate">
                {{ equipe.nome_equipe }}
              </span>
            </div>
          </div>
        </article>
      </div>

      <!-- Estado vazio -->
      <div
        v-else
        class="mt-4 rounded-lg bg-slate-50
               px-4 py-6 text-center"
      >
        <span
          class="mdi mdi-account-group-outline
                 text-2xl text-slate-400"
          aria-hidden="true"
        />

        <p class="mt-2 text-sm text-slate-500">
          Ainda não existem equipes participantes.
        </p>
      </div>
    </section>

  </aside>
</template>