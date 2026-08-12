<template>
  <section class="px-[5vw] py-[2.5vw] max-h-[90vh] overflow-y-scroll no-scrollbar max-w-screen">
    <EventThumbnail
      class="mb-[1vw]"
      image="/images/fabricaHackathonThumb.png"
      :status="evento?.status"
      title="hackathon"
    />

    <div class="flex justify-between items-baseline mb-[3vw]">
      <div>
        <h2 class="text-[40px] text-[#111827]">{{ evento?.title }}</h2>
        <p class="text-[20px] text-[#4B5563]">Gerenciado por: <span class="text-[#111827]">{{ evento?.manager }}</span></p>
      </div>

      <div class="flex flex-col items-end gap-6 h-[10vh]">
        <EventDateRange
          :end-date="evento?.endDate"
          :start-date="evento?.startDate"
        />

        <RouterLink v-if="evento?.status == 'inscricoes'" to="/nomePraMudar">
          <SubscribeButton />
        </RouterLink>
      </div>
    </div>

    <SponsorList
      class="justify-start mb-[3vw]"
      :images="evento?.sponsor ? evento?.sponsor : []"
    />

    <div class="flex justify-center mb-[3vw]">

      <progressStepper
        :current-step="step"
        :steps="['Inscrições', 'Andamento', 'Avaliação', 'Finalizado']"
      />
    </div>

    <InfoCard
      :criteria="evento?.tags ? evento?.tags : []"
      criteria-label="Critérios"
      :description="evento?.description"
      :title="`Sobre o ${evento?.title}`"
    />

    <TeamsSection
      class="max-w-max mt-[3vw]"
      :items="evento?.teams"
      :title="evento?.title"
    />
  </section>
</template>
<script setup lang="ts">
  import { computed } from 'vue'
  import { RouterLink, useRoute } from 'vue-router'
  import SubscribeButton from '@/components/layout/SubscribeButton'
  import TeamsSection from '@/components/layout/TeamsSection'
  import EventDateRange from '@/components/ui/EventDateRange'
  import EventThumbnail from '@/components/ui/EventThumbnail'
  import InfoCard from '@/components/ui/InfoCard/InfoCard.vue'
  import progressStepper from '@/components/ui/progressStepper.vue'
  import SponsorList from '@/components/ui/SponsorList'
  import { hackathons } from '@/data/hackathons'

  const step = computed(() => {
    if (evento.value?.status == 'inscricoes') return 0
    if (evento.value?.status == 'andamento') return 1
    if (evento.value?.status == 'avaliacao') return 2
    return 3
  })

  const route = useRoute()

  const evento = computed(() => {
    return hackathons.find(
      hackathon => hackathon.id === Number(route.params.id),
    )
  })
</script>
