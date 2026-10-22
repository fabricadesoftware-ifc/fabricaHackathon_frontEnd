import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { TipoUsuario } from '@/types/usuario'

import HomeView from '@/pages/HomeView.vue'
import EdicoesView from '@/pages/EdicoesView.vue'
import MyProjectsView from '@/pages/MyProjectsView.vue'
import InscricaoView from '@/pages/InscricaoView.vue'
import EquipesView from '@/pages/EquipesView.vue'
import ExplorarView from '@/pages/ExplorarView.vue'
import ConfiguracoesView from '@/pages/ConfiguracoesView.vue'
import EvaluationsListView from '@/pages/EvaluationsListView.vue'
import EventView from '@/pages/EventView.vue'
import ProjectEvaluationView from '@/pages/ProjectEvaluationView.vue'
import ProjectRegistrationView from '@/pages/ProjectRegistrationView.vue'
import LoginView from '@/pages/LoginView.vue'
import RegisterView from '@/pages/RegisterView.vue'
import SolicitacoesPerfilView from '@/pages/SolicitacoesPerfilView.vue'
import PreAvaliacaoView from '@/pages/PreAvaliacaoView.vue'

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
      path: '/explorar',
      component: ExplorarView,
    },
    {
      path: '/projetos',
      component: MyProjectsView,
      meta: { requiresAuth: true, roles: ['PARTICIPANTE', 'PROFESSOR', 'ADMIN'] },
    },
    {
      path: '/equipes',
      component: EquipesView,
      meta: { requiresAuth: true, roles: ['PARTICIPANTE', 'PROFESSOR', 'ADMIN'] },
    },
    {
      path: '/projetos/:projetoId/pre-avaliacao',
      name: 'pre-avaliacao',
      component: PreAvaliacaoView,
      meta: { requiresAuth: true },
    },
    {
      path: '/inscricao',
      component: InscricaoView,
      meta: { requiresAuth: true, roles: ['PARTICIPANTE'] },
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
      meta: { requiresAuth: true, roles: ['PARTICIPANTE'] },
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
      // Só o avaliador lança notas; professor e admin não têm ações de escrita aqui.
      meta: {
        requiresAuth: true,
        roles: ['AVALIADOR'],
      },
    },
    {
      path: '/admin/solicitacoes',
      name: 'solicitacoes-perfil',
      component: SolicitacoesPerfilView,
      meta: {
        requiresAuth: true,
        roles: ['ADMIN'],
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