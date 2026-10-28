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

    <!-- Situação da edição -->
    <section
      class="rounded-lg border border-slate-200
             bg-white p-5"
    >
      <div
        class="flex flex-wrap items-center
               justify-between gap-3"
      >
        <h2 class="text-base font-semibold text-slate-900">
          Situação da edição
        </h2>

        <StatusBadge
          :status="status"
          :label="edicao.status_label"
        />
      </div>

      <p
        class="mt-3 rounded-lg bg-slate-50
               px-3 py-3 text-sm
               leading-5 text-slate-600"
      >
        {{ mensagemStatus }}
      </p>

      <!-- Botão de inscrição -->
      <RouterLink
        v-if="status === 'inscricoes' && podeInscrever"
        :to="{
          path: '/novo',
          query: { edicao_id: edicao.id },
        }"
        class="mt-4 flex min-h-11 w-full
               items-center justify-center
               gap-2 rounded-lg bg-blue-600
               px-4 py-2.5 text-sm
               font-semibold text-white
               transition-colors hover:bg-blue-700"
      >
        <span
          class="mdi mdi-ticket-outline text-lg"
          aria-hidden="true"
        />

        Inscrever-se nesta edição
      </RouterLink>
    </section>

    <!-- Equipes participantes -->
    <section
      class="rounded-lg border border-slate-200
             bg-white p-5"
    >
      <!-- Cabeçalho -->
      <div
        class="flex flex-wrap items-center
               justify-between gap-2"
      >
        <h2 class="text-base font-semibold text-slate-900">
          Equipes participantes
        </h2>

        <button
          v-if="edicao.equipes.length > 0"
          type="button"
          class="inline-flex items-center gap-1
                 text-sm font-medium text-blue-600
                 hover:text-blue-700"
          @click="$emit('ver-equipes')"
        >
          Ver todas ({{ edicao.equipes.length }})

          <span
            class="mdi mdi-arrow-right"
            aria-hidden="true"
          />
        </button>
      </div>

      <!-- Lista -->
      <div
        v-if="equipesDestaque.length"
        class="mt-4 space-y-2"
      >
        <article
          v-for="equipe in equipesDestaque"
          :key="equipe.id"
          class="flex min-w-0 items-start
                 gap-3 rounded-lg border
                 border-slate-200 p-3"
        >
          <!-- Avatar do projeto -->
          <div
            class="flex h-10 w-10 shrink-0
                   items-center justify-center
                   overflow-hidden rounded-lg
                   bg-blue-50 font-semibold
                   text-blue-700"
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
            <h3
              class="truncate text-sm font-semibold
                     text-slate-900"
            >
              {{
                equipe.projeto?.nome_projeto ||
                equipe.nome_equipe
              }}
            </h3>

            <p
              v-if="equipe.projeto?.descricao_projeto"
              class="mt-1 line-clamp-2
                     text-xs leading-4 text-slate-500"
            >
              {{ equipe.projeto.descricao_projeto }}
            </p>

            <p
              class="mt-2 flex items-center gap-1.5
                     text-xs text-slate-500"
            >
              <span
                class="mdi mdi-account-group-outline"
                aria-hidden="true"
              />

              <span class="truncate">
                {{ equipe.nome_equipe }}
              </span>
            </p>
          </div>
        </article>
      </div>

      <!-- Sem equipes -->
      <p
        v-else
        class="mt-4 rounded-lg bg-slate-50
               px-4 py-6 text-center
               text-sm text-slate-500"
      >
        Ainda não existem equipes participantes.
      </p>
    </section>

  </aside>
</template>