<script lang='ts' setup>
  import { reactive, ref } from 'vue'
  import AvatarUpload from '@/components/layout/AvatarUpload'
  import EvaluationProjectCard from '@/components/ui/EvaluationProjectCard/EvaluationProjectCard.vue'
  import AppHeader from './components/layout/AppHeader/AppHeader.vue'
  import LoginCard from './components/layout/LoginCard/LoginCard.vue'
  import AppButton from './components/ui/AppButton/AppButton.vue'
  import EvaluationCriteriaCard from './components/ui/EvaluationCriteriaCard/EvaluationCriteriaCard.vue'
  import EvalutionProjectCardList from './components/ui/EvalutionProjectCardList/EvalutionProjectCardList.vue'
  import EventDateRange from './components/ui/EventDateRange/EventDateRange.vue'
  import ProgressBar from './components/ui/ProgressBar/ProgressBar.vue'
  import ProjectDetailsCard from './components/ui/ProjectDetailsCard/ProjectDetailsCard.vue'
  import { Sidebar } from './components/ui/Sidebar'

  const form = reactive({
    logo: null,
    teamName: '',
    bio: '',
    deployUrl: '',
  })

  function salvar () {
    console.log(`Salvou!`)
  }

  function remover (id: number) {
  convidados.value = convidados.value.filter(c => c.id !== id)
  }

  function handleLogin (dados: {
    email: string
    password: string
    rememberMe: boolean
  }) {
    console.log('Login:', dados)
  }

  function handleGoogleLogin () {
    console.log('Login com Google')
  }

  function handleForgotPassword () {
    console.log('Esqueci minha senha')
  }

  function handleCreateAccount () {
    console.log('Criar conta')
  }

  const activeItem = ref('home')
  const isLoggedIn = ref(true)
  const file = ref<File | null>(null)

  function handleFileChange (event: Event) {
    const input = event.target as HTMLInputElement

    file.value = input.files?.[0] ?? null
  }

  const notaCriatividade = ref(7)
  const comentarioCriatividade = ref('')

  function abrirProjeto () {
    console.log('Abrir projeto')
  }

  const search = ref('')
</script>
<template>
  <div class="flex">
    <Sidebar v-model:active-item="activeItem" :is-logged-in="isLoggedIn" />

    <main class="flex-1 flex-row bg-[#F9FAFB]">
      <AppHeader
        v-model="search"
        :is-logged="true"
        :notification-count="3"
        user-avatar="/avatar.png"
        user-name="Renan"
      />

      <div class="mx-10">
        <RouterView />

        <EvaluationProjectCard
          avatar="/avatar.png"
          description="Sistema para gerenciamento de hackathons"
          edition-name="HackIFC 2026"
          name="Hackathon App"
          project-url="github.com/equipe-alpha"
          :score="9.5"
          status="Avaliado"
          team-name="Equipe Alpha"
        />

        <ProjectDetailsCard
          :bio="form.bio"
          :deploy-url="form.deployUrl"
          :logo="form.logo"
          :max-bio-length="300"
          subtitle="Preencha as informações do seu projeto"
          :team-name="form.teamName"
          title="Detalhes do projeto"
        />
      </div>

      <EvalutionProjectCardList
        name="Alugaê"
        :score="8.4"
        status="avaliado"
        team-name="Os tops"
      />

      <EvalutionProjectCardList
        name="Alugaê"
        status="pendente"
        team-name="Os tops"
      />
    </main>
  </div>
</template>
<style></style>
