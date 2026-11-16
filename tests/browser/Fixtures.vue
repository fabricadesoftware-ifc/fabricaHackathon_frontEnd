<script setup lang="ts">
  import { useTheme as useLegacyTheme } from '@vuetify/v0'
  import { ref } from 'vue'
  import { useTheme } from 'vuetify'
  import AppHeader from '@/components/layout/AppHeader/AppHeader.vue'
  import CardGrid from '@/components/layout/CardGrid/CardGrid.vue'
  import EditProjectModal from '@/components/layout/EditProjectModal/EditProjectModal.vue'
  import UnsavedChangesBar from '@/components/layout/UnsavedChangesBar/UnsavedChangesBar.vue'
  import AppButton from '@/components/ui/AppButton/AppButton.vue'
  import EvaluationCard from '@/components/ui/EvaluationCard/EvaluationCard.vue'
  import EventCard from '@/components/ui/eventCard.vue'
  import FilterChipGroup from '@/components/ui/FilterChipGroup/FilterChipGroup.vue'
  import CardGridSkeleton from '@/components/ui/LoadingSkeleton/CardGridSkeleton.vue'
  import ProjectCard from '@/components/ui/projectCard.vue'
  import ProjectDetailsCard from '@/components/ui/ProjectDetailsCard/ProjectDetailsCard.vue'
  import Sidebar from '@/components/ui/Sidebar/Sidebar.vue'
  import StatusProject from '@/components/ui/statusProject.vue'
  import StatusEdition from '@/components/ui/statusSelect.vue'
  import ThemeToggle from '@/components/ui/ThemeToggle.vue'
  import Configuracoes from '@/pages/ConfiguracoesView.vue'
  import EvaluationsList from '@/pages/EvaluationsListView.vue'
  import EventView from '@/pages/EventView.vue'
  import Home from '@/pages/HomeView.vue'
  import LoginView from '@/pages/LoginView.vue'
  import NotFound from '@/pages/NotFoundView.vue'
  import PreAvaliacao from '@/pages/PreAvaliacaoView.vue'
  import RegisterView from '@/pages/RegisterView.vue'
  import Requests from '@/pages/SolicitacoesPerfilView.vue'
  import Termos from '@/pages/TermosView.vue'
  import { selectedTheme } from '@/theme/state'

  const showcase = new URLSearchParams(location.search).get('case') ?? 'shared'
  const legacyTheme = useLegacyTheme()
  const vuetifyTheme = useTheme()
  const dialog = ref(false)
  const gridQuery = new URLSearchParams(location.search)
  const gridCount = Number(gridQuery.get('count') ?? 7)
  const gridKind = gridQuery.get('kind') ?? 'events'
  const gridColumns = gridQuery.get('columns') === '3' ? 3 : (gridQuery.get('columns') === '4' ? 4 : undefined)
  const gridItems = Array.from({ length: gridCount }, (_, id) => ({
    id, title: `Projeto ${id + 1}`, description: 'Descrição do projeto para conferir a distribuição dos cards.',
    team: 'Equipe IFC', event: 'Edição de teste', logo: '', status: 'ativo' as const, statusLabel: 'Em andamento',
  }))
  const loading = ref(false)
  const selected = ref('pending')
  const bio = ref('Descrição inicial')
  const edits = ref(0)
  const filters = [{ label: 'Pendentes', value: 'pending' }, { label: 'Aprovadas', value: 'approved' }, { label: 'Recusadas', value: 'rejected' }]
</script>

<template>
  <main
    class="p-4 sm:p-6 md:mx-10 md:p-0"
    :data-legacy-theme="legacyTheme.selectedId.value"
    :data-showcase="showcase"
    :data-theme-state="selectedTheme"
    :data-vuetify-theme="vuetifyTheme.name.value"
  >
    <template v-if="showcase === 'grids'">
      <section data-grid-fixture>
        <CardGrid v-if="gridKind === 'legacy'" :columns="gridColumns" compact :items="gridItems" />
        <CardGridSkeleton v-else-if="gridKind === 'skeleton'" :count="gridCount" />

        <CardGrid v-else :columns="gridColumns" compact>
          <template v-for="(item, index) in gridItems" :key="item.id">
            <EventCard
              v-if="gridKind === 'events'"
              :id="index + 1"
              end-date="14/11/2026"
              image=""
              location="Campus IFC"
              start-date="11/11/2026"
              status="inscricoes"
              status-label="Inscrições abertas"
              :tags="[]"
              :teams-counter="4"
              title="Edição de teste"
            />

            <ProjectCard v-else-if="gridKind === 'projects'" v-bind="item" />

            <EvaluationCard
              v-else
              :current="2"
              deadline="14/11/2026"
              image=""
              status="avaliacao"
              title="Edição de avaliação"
              :total="5"
            />
          </template>
        </CardGrid>
      </section>
    </template>

    <template v-else-if="showcase === 'shared'">
      <div class="mb-6 border-b border-app-border-default" data-testid="filters">
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

    <template v-else-if="showcase === 'evaluations-list' || showcase === 'evaluations-count-unavailable'">
      <EvaluationsList />
    </template>

    <template v-else-if="showcase === 'evaluations'">
      <div class="grid max-w-[720px] grid-cols-1 items-start gap-6 sm:grid-cols-2">
        <EvaluationCard
          :current="2"
          data-testid="evaluation-card"
          deadline="14/11/2026"
          image="/images/fabricaHackathonThumb.png"
          location="Campus Videira · IFC"
          :project-count="8"
          start-date="11/11/2026"
          status="avaliacao"
          title="Hackathon Avaliação 2023"
          :total="5"
          @click="edits++"
        />

        <EvaluationCard
          data-testid="evaluation-readonly"
          deadline="14/11/2026"
          image=""
          location="Localização com um nome extenso para conferir a quebra de linhas no card de avaliação"
          status="finalizado"
          title="Edição com um título bastante extenso para conferir o comportamento responsivo"
          @click="edits++"
        />
      </div>

      <p data-testid="evaluation-clicks">{{ edits }}</p>
    </template>

    <template v-else-if="showcase === 'logos'">
      <ProjectCard
        data-testid="fallback-logo-card"
        description=""
        event="Edição"
        logo=""
        status="ativo"
        status-label="Em andamento"
        team="Equipe"
        title="Sem logo"
      />

      <ProjectCard
        data-testid="real-logo-card"
        description="Projeto com imagem real"
        event="Edição"
        logo="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Ccircle cx='20' cy='20' r='16' fill='navy'/%3E%3C/svg%3E"
        status="ativo"
        status-label="Em andamento"
        team="Equipe"
        title="Com logo"
      />
    </template>

    <template v-else-if="showcase === 'theme'">
      <ThemeToggle />
      <AppButton disabled label="Indisponível" variant="secondary" />
      <AppButton label="Abrir modal" variant="primary" @click="dialog = true" />
      <v-text-field label="Campo Vuetify" />
      <v-dialog v-model="dialog" max-width="400"><v-card title="Modal Vuetify"><v-card-text>Conteúdo teleportado</v-card-text><v-card-actions><v-btn @click="dialog = false">Fechar</v-btn></v-card-actions></v-card></v-dialog>
    </template>

    <template v-else-if="showcase === 'login'"><LoginView /></template>
    <template v-else-if="showcase === 'register'"><RegisterView /></template>
    <template v-else-if="showcase === 'header'"><AppHeader :is-logged="false" /><AppHeader is-logged user-name="Pessoa de teste" /><CardGridSkeleton :count="3" /></template>
    <template v-else-if="showcase === 'modal'"><EditProjectModal description="Descrição do projeto" :model-value="true" project-name="Projeto" team-name="Equipe" /></template>
    <template v-else-if="showcase === 'sidebar'"><Sidebar active-item="home" :is-logged-in="false" /></template>

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
