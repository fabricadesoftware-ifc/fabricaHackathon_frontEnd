<script setup lang="ts">
  import { onBeforeUnmount, onMounted, ref } from 'vue'
  import CardGrid from '@/components/layout/CardGrid/CardGrid.vue'
  import AppButton from '@/components/ui/AppButton/AppButton.vue'
  import { AsyncView } from '@/components/ui/AsyncView'
  import PageHeader from '@/components/ui/PageHeader/PageHeader.vue'
  import { startNavigationLoading } from '@/composables/useNavigationLoading'

  const loading = ref(true)
  let timer: ReturnType<typeof setTimeout> | undefined
  let finishLoading: (() => void) | undefined

  function stopPreview () {
    clearTimeout(timer)
    timer = undefined
    finishLoading?.()
    finishLoading = undefined
  }

  function replay () {
    stopPreview()
    loading.value = true
    finishLoading = startNavigationLoading()
    timer = setTimeout(() => {
      loading.value = false
      stopPreview()
    }, 2500)
  }

  onMounted(replay)
  onBeforeUnmount(stopPreview)
</script>

<template>
  <div class="w-full min-w-0 space-y-8 pt-4">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <PageHeader
        subtitle="Prévia local dos estados de carregamento, sem chamadas à API."
        title="Teste de loading"
      />

      <AppButton label="Repetir animação" variant="secondary" @click="replay" />
    </div>

    <section aria-label="Prévia de cartões" class="space-y-4">
      <h2 class="text-lg font-semibold text-app-text-strong">Cartões</h2>

      <AsyncView :error="null" :loading="loading" skeleton="cards" :skeleton-count="3">
        <CardGrid compact>
          <article
            v-for="item in 3"
            :key="item"
            class="rounded-lg border border-app-border-default bg-app-surface p-5 shadow-app-soft"
          >
            <div class="mb-4 flex h-28 items-center justify-center rounded-md bg-app-surface-subtle text-app-link">
              <span aria-hidden="true" class="mdi mdi-lightbulb-outline text-3xl" />
            </div>

            <h3 class="font-semibold text-app-text-strong">Projeto {{ item }}</h3>
            <p class="mt-2 text-sm text-app-text-secondary">Conteúdo carregado e pronto para explorar.</p>
          </article>
        </CardGrid>
      </AsyncView>
    </section>

    <section aria-label="Prévia de conteúdo" class="space-y-4">
      <h2 class="text-lg font-semibold text-app-text-strong">Conteúdo</h2>

      <AsyncView :error="null" :lines="3" :loading="loading">
        <p class="text-sm text-app-text-secondary">
          Os dados apareceram após o skeleton, com a transição suave usada nas páginas do HackIFC.
        </p>
      </AsyncView>
    </section>
  </div>
</template>
