import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { TipoUsuario } from '@/types/usuario'

import HomeView from '@/pages/HomeView.vue'
import EdicoesView from '@/pages/EdicoesView.vue'
import MyProjectsView from '@/pages/MyProjectsView.vue'
import InscricaoView from '@/pages/InscricaoView.vue'
import ConfiguracoesView from '@/pages/ConfiguracoesView.vue'
import EvaluationsListView from '@/pages/EvaluationsListView.vue'
import EventView from '@/pages/EventView.vue'
import ProjectEvaluationView from '@/pages/ProjectEvaluationView.vue'
import ProjectRegistrationView from '@/pages/ProjectRegistrationView.vue'
import LoginView from '@/pages/LoginView.vue'
import RegisterView from '@/pages/RegisterView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      component: HomeView,
    },
    {
      path: '/edicoes',
      component: EdicoesView,
    },
    {
      path: '/edicoes/:id',
      name: 'edicoes',
      component: EventView,
    },
    {
      path: '/projetos',
      component: MyProjectsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/inscricao',
      component: InscricaoView,
      meta: { requiresAuth: true },
    },
    {
      path: '/configuracoes',
      component: ConfiguracoesView,
      meta: { requiresAuth: true },
    },
    {
      path: '/avaliacao',
      name: 'avaliacoes',
      component: EvaluationsListView,
      meta: {
        requiresAuth: true,
        roles: ['AVALIADOR', 'PROFESSOR', 'ADMIN'],
      },
    },
    {
      path: '/novo',
      name: 'projeto-novo',
      component: ProjectRegistrationView,
      meta: { requiresAuth: true },
    },
    {
      path: '/avaliacao/:editionId',
      name: 'projetos-para-avaliar',
      component: () => import('@/pages/ProjectsToEvaluateView.vue'),
      meta: {
        requiresAuth: true,
        roles: ['AVALIADOR', 'PROFESSOR', 'ADMIN'],
      },
    },
    {
      path: '/avaliacao/:editionId/projeto/:projectId',
      name: 'avaliacao-projeto',
      component: ProjectEvaluationView,
      meta: {
        requiresAuth: true,
        roles: ['AVALIADOR', 'PROFESSOR', 'ADMIN'],
      },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
  path: '/registro',
  name: 'registro',
  component: RegisterView,
},
  ],
})
router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  // Recupera a sessão caso a página tenha sido atualizada.
  await authStore.restoreSession()

  // Rotas públicas não exigem autenticação.
  if (!to.meta.requiresAuth) {
    return true
  }

  // Usuário não autenticado.
  if (!authStore.isAuthenticated) {
    return {
      path: '/login',
      query: {
        redirect: to.fullPath,
      },
    }
  }

  // Verifica permissões por perfil.
  const allowedRoles = to.meta.roles as TipoUsuario[] | undefined

  if (
    allowedRoles?.length &&
    (!authStore.userRole || !allowedRoles.includes(authStore.userRole))
  ) {
    return '/home'
  }

  return true
})
export default router