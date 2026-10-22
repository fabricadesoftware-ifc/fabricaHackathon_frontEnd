<template>
  <section class="px-[5vw] py-[2.5vw] max-h-[90vh] overflow-y-scroll no-scrollbar max-w-screen">
    <AsyncView :error="error" :lines="8" :loading="loading" @retry="run">
      <template v-if="edicao">
        <EventThumbnail class="mb-[1vw]" :image="edicao.imagem_capa || '/images/fabricaHackathonThumb.png'"
          :status="status" :title="edicao.nome" />

        <div class="flex justify-between items-baseline mb-[3vw]">
          <div>
            <h2 class="text-[30px] text-[#111827]">{{ edicao.nome }}</h2>

            <p class="text-[16px] text-[#4B5563]">
              Gerenciado por: <span class="text-[#111827]">{{ edicao.responsavel }}</span>
            </p>
          </div>

          <div class="flex flex-col items-end gap-6 h-[10vh]">
            <EventDateRange :end-date="formatarData(edicao.data_fim)" :start-date="formatarData(edicao.data_inicio)" />

            <RouterLink v-if="status === 'inscricoes'" :to="{
              path: '/novo',
              query: { edicao_id: edicao.id },
            }">
              <SubscribeButton />
            </RouterLink>
          </div>
        </div>

        <SponsorList v-if="patrocinadores.length > 0" class="justify-start mb-[3vw]" :images="patrocinadores" />

        <div class="flex justify-center mb-[3vw]">
          <progressStepper :current-step="step" :steps="['Inscrições', 'Andamento', 'Avaliação', 'Finalizado']" />
        </div>

        <InfoCard :criteria="edicao.criterios.map(c => c.nome)" criteria-label="Critérios"
          :description="edicao.descricao" :title="`Sobre o ${edicao.nome}`" />

        <section v-if="status === 'finalizado'" class="mt-[3vw]">
          <h3 class="text-[24px] text-[#111827] mb-4">Ranking</h3>

          <AsyncView :empty="!ranking.loading.value && !ranking.error.value && (ranking.data.value?.length ?? 0) === 0"
            empty-message="O ranking ainda não está disponível." :error="ranking.error.value"
            :loading="ranking.loading.value" @retry="ranking.run">
            <ol class="flex flex-col gap-2">
              <li v-for="item in ranking.data.value" :key="item.projeto_id"
                class="flex items-center gap-4 rounded-md border border-[#E5E7EB] bg-white px-4 py-3">
                <span class="w-8 text-center text-lg font-semibold text-[#111827]">{{ item.posicao }}º</span>

                <div class="flex-1">
                  <p class="font-medium text-[#111827]">{{ item.projeto }}</p>
                  <p class="text-sm text-[#4B5563]">{{ item.equipe }}</p>
                </div>

                <span class="font-semibold text-[#1C74FB]">{{ item.nota_final }}</span>
              </li>
            </ol>
          </AsyncView>
        </section>

        <TeamsSection class="max-w-max mt-[3vw]" :items="equipes" title="Equipes Participantes" />
      </template>
    </AsyncView>
  </section>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import SubscribeButton from '@/components/layout/SubscribeButton'
import TeamsSection from '@/components/layout/TeamsSection'
import { AsyncView } from '@/components/ui/AsyncView'
import EventDateRange from '@/components/ui/EventDateRange'
import EventThumbnail from '@/components/ui/EventThumbnail'
import InfoCard from '@/components/ui/InfoCard/InfoCard.vue'
import progressStepper from '@/components/ui/progressStepper.vue'
import SponsorList from '@/components/ui/SponsorList'
import { useAsync } from '@/composables/useAsync'
import { listarRanking, obterEdicao } from '@/services'
import { equipeParaCard, mapearStatus } from '@/types'
import { formatarData } from '@/utils/format'

const route = useRoute()
const edicaoId = computed(() => route.params.id as string)

const { data: edicao, loading, error, run } = useAsync(() => obterEdicao(edicaoId.value))

const status = computed(() => (edicao.value ? mapearStatus(edicao.value.status) : undefined))

const STEPS = { inscricoes: 0, andamento: 1, avaliacao: 2, finalizado: 3 } as const
const step = computed(() => (status.value ? STEPS[status.value] : 0))

// Só apoiadores com logo entram na lista de logos.
const patrocinadores = computed(() =>
  (edicao.value?.apoiadores ?? [])
    .filter(a => a.logo_apoiador)
    .map(a => ({ name: a.nome, imageUrl: a.logo_apoiador as string })),
)

const equipes = computed(() => {
  const e = edicao.value
  return e ? e.equipes.map(eq => equipeParaCard(eq, { nome: e.nome, status: e.status })) : []
})

// Ranking: a API responde 403 antes de FINALIZADO, então só buscamos quando já terminou.
const ranking = useAsync(() => listarRanking(edicaoId.value), false)

watch(edicaoId, run)
watch(status, s => {
  if (s === 'finalizado') {
    ranking.run()
  }
})
</script>
