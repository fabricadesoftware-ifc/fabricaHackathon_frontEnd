<script setup lang="ts">
  import { ref } from 'vue'
  import UnsavedChangesBar from '@/components/layout/UnsavedChangesBar/UnsavedChangesBar.vue'
  import AppButton from '@/components/ui/AppButton/AppButton.vue'
  import EventCard from '@/components/ui/eventCard.vue'
  import FilterChipGroup from '@/components/ui/FilterChipGroup/FilterChipGroup.vue'
  import ProjectCard from '@/components/ui/projectCard.vue'
  import ProjectDetailsCard from '@/components/ui/ProjectDetailsCard/ProjectDetailsCard.vue'
  import StatusProject from '@/components/ui/statusProject.vue'
  import StatusEdition from '@/components/ui/statusSelect.vue'
  import Configuracoes from '@/pages/ConfiguracoesView.vue'
  import EventView from '@/pages/EventView.vue'
  import Home from '@/pages/HomeView.vue'
  import NotFound from '@/pages/NotFoundView.vue'
  import PreAvaliacao from '@/pages/PreAvaliacaoView.vue'
  import Requests from '@/pages/SolicitacoesPerfilView.vue'
  import Termos from '@/pages/TermosView.vue'

  const showcase = new URLSearchParams(location.search).get('case') ?? 'shared'
  const loading = ref(false)
  const selected = ref('pending')
  const bio = ref('Descrição inicial')
  const edits = ref(0)
  const filters = [{ label: 'Pendentes', value: 'pending' }, { label: 'Aprovadas', value: 'approved' }, { label: 'Recusadas', value: 'rejected' }]
</script>

<template>
  <main class="p-4 sm:p-6 md:mx-10 md:p-0" :data-showcase="showcase">
    <template v-if="showcase === 'shared'">
      <div class="mb-6 border-b border-slate-200" data-testid="filters">
        <FilterChipGroup v-model="selected" :options="filters" variant="underline" />
      </div>

      <div class="flex flex-wrap gap-4">
        <AppButton
          data-testid="loading"
          label="Salvar"
          :loading="loading"
          variant="primary"
          @click="loading = true"
        />

        <AppButton icon="→" icon-position="right" label="Continuar" variant="secondary" />
        <AppButton label="Cancelar" variant="text" />
      </div>

      <div class="my-6 flex flex-wrap items-start gap-4">
        <StatusProject label="Em andamento" status="ativo" variant="card" />
        <StatusProject label="Finalizado" status="finalizado" />
        <StatusEdition label="Inscrições" status="inscricoes" variant="card" />
        <StatusEdition label="Avaliação" status="avaliacao" variant="evaluation" />
      </div>

      <ProjectDetailsCard v-model:bio="bio" />
      <p data-testid="bio-value">{{ bio }}</p>
    </template>

    <template v-else-if="showcase === 'cards'">
      <div class="flex flex-wrap items-start gap-8">
        <ProjectCard
          deploy-url="https://example.com"
          :description="'Descrição para conferir a expansão do projeto e a leitura de informações. '.repeat(6)"
          editavel
          event="Edição de teste"
          logo=""
          pre-avaliacao-to="/teste"
          status="ativo"
          status-label="Em andamento"
          team="Equipe de teste"
          title="Projeto de teste"
          @edit="edits++"
        />

        <EventCard
          :id="1"
          end-date="12/11/2026"
          image=""
          location="Campus IFC"
          manager="Organização"
          start-date="11/11/2026"
          status="inscricoes"
          status-label="Inscrições abertas"
          :tags="[]"
          :teams-counter="4"
          title="Edição de teste"
        />
      </div>

      <p data-testid="edits">{{ edits }}</p>
    </template>

    <template v-else-if="showcase === 'home'">
      <Home />
    </template>

    <template v-else-if="showcase === 'requests'">
      <Requests />
    </template>

    <template v-else-if="showcase === 'focus'">
      <UnsavedChangesBar visible />
    </template>

    <template v-else-if="showcase === 'containers'">
      <div data-container="pre-avaliacao"><PreAvaliacao /></div>
      <div data-container="configuracoes"><Configuracoes /></div>
      <div data-container="termos"><Termos /></div>
      <div data-container="not-found"><NotFound /></div>
      <div data-container="event"><EventView /></div>
    </template>
  </main>
</template>
