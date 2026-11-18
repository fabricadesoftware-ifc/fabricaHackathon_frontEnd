import type { TipoUsuario } from '@/types/usuario'
import { createRouter, createWebHistory } from 'vue-router'
import { startNavigationLoading } from '@/composables/useNavigationLoading'
import ConfiguracoesView from '@/pages/ConfiguracoesView.vue'
import EdicoesView from '@/pages/EdicoesView.vue'
import EquipesView from '@/pages/EquipesView.vue'
import EvaluationsListView from '@/pages/EvaluationsListView.vue'
import EventView from '@/pages/EventView.vue'
import ExplorarView from '@/pages/ExplorarView.vue'
import HomeView from '@/pages/HomeView.vue'
import InscricaoView from '@/pages/InscricaoView.vue'
import LoginView from '@/pages/LoginView.vue'
import MyProjectsView from '@/pages/MyProjectsView.vue'
import NotFoundView from '@/pages/NotFoundView.vue'
import PreAvaliacaoView from '@/pages/PreAvaliacaoView.vue'
import ProjectEvaluationView from '@/pages/ProjectEvaluationView.vue'
import ProjectRegistrationView from '@/pages/ProjectRegistrationView.vue'
import RegisterView from '@/pages/RegisterView.vue'
import SolicitacoesPerfilView from '@/pages/SolicitacoesPerfilView.vue'
import TermosView from '@/pages/TermosView.vue'
import { useAuthStore } from '@/stores/auth'

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
      meta: { title: 'Home' },
    },
    {
      path: '/edicoes',
      component: EdicoesView,
      meta: { title: 'Edições' },
    },
    {
      path: '/edicoes/:id',
      name: 'edicoes',
      component: EventView,
      meta: { title: 'Edição' },
    },
    {
      path: '/explorar',
      component: ExplorarView,
      meta: { title: 'Explorar projetos' },
    },
    {
      path: '/projetos',
      component: MyProjectsView,
      meta: { title: 'Meus projetos', requiresAuth: true, roles: ['PARTICIPANTE', 'PROFESSOR', 'ADMIN'] },
    },
    {
      path: '/equipes',
      component: EquipesView,
      meta: { title: 'Equipes', requiresAuth: true, roles: ['PARTICIPANTE', 'PROFESSOR', 'ADMIN'] },
    },
    {
      path: '/projetos/:projetoId/pre-avaliacao',
      name: 'pre-avaliacao',
      component: PreAvaliacaoView,
      meta: { title: 'Pré-avaliação', requiresAuth: true },
    },
    {
      path: '/inscricao',
      component: InscricaoView,
      meta: { title: 'Inscrição', requiresAuth: true, roles: ['PARTICIPANTE'] },
    },
    {
      path: '/configuracoes',
      component: ConfiguracoesView,
      meta: { title: 'Configurações', requiresAuth: true },
    },
    {
      path: '/avaliacao',
      name: 'avaliacoes',
      component: EvaluationsListView,
      meta: {
        title: 'Avaliações',
        requiresAuth: true,
        roles: ['AVALIADOR'],
      },
    },
    {
      path: '/novo',
      name: 'projeto-novo',
      component: ProjectRegistrationView,
      meta: { title: 'Novo projeto', requiresAuth: true, roles: ['PARTICIPANTE'] },
    },
    {
      path: '/avaliacao/:editionId',
      name: 'projetos-para-avaliar',
      component: () => import('@/pages/ProjectsToEvaluateView.vue'),
      meta: {
        title: 'Projetos para avaliar',
        requiresAuth: true,
        roles: ['AVALIADOR'],
      },
    },
    {
      path: '/avaliacao/:editionId/projeto/:projectId',
      name: 'avaliacao-projeto',
      component: ProjectEvaluationView,
      // Só o avaliador lança notas; professor e admin não têm ações de escrita aqui.
      meta: {
        title: 'Avaliar projeto',
        requiresAuth: true,
        roles: ['AVALIADOR'],
      },
    },
    {
      path: '/admin/solicitacoes',
      name: 'solicitacoes-perfil',
      component: SolicitacoesPerfilView,
      meta: {
        title: 'Solicitações de perfil',
        requiresAuth: true,
        roles: ['ADMIN'],
      },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { title: 'Entrar' },
    },
    {
      path: '/registro',
      name: 'registro',
      component: RegisterView,
      meta: { title: 'Criar conta' },
    },
    {
      path: '/termos',
      name: 'termos',
      component: TermosView,
      meta: { title: 'Termos de Uso' },
    },
    // Endereço inexistente: página 404 em vez de tela em branco.
    {
      path: '/:pathMatch(.*)*',
      name: 'nao-encontrada',
      component: NotFoundView,
      meta: { title: 'Página não encontrada' },
    },
  ],
})

if (import.meta.env.DEV) {
  router.addRoute({
    path: '/loading-preview',
    name: 'loading-preview',
    component: () => import('@/pages/LoadingPreviewView.vue'),
    meta: { title: 'Teste de loading' },
  })
}

const finishRouteLoading = new WeakMap<object, () => void>()

router.beforeEach(to => {
  finishRouteLoading.set(to, startNavigationLoading())
})

router.beforeEach(async to => {
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
    allowedRoles?.length
    && (!authStore.userRole || !allowedRoles.includes(authStore.userRole))
  ) {
    return '/home'
  }

  return true
})

router.afterEach(to => {
  finishRouteLoading.get(to)?.()
  finishRouteLoading.delete(to)
  const titulo = to.meta.title
  document.title = typeof titulo === 'string' ? `${titulo} · HackIFC // 24H` : 'HackIFC // 24H'
})

router.onError((_error, to) => {
  finishRouteLoading.get(to)?.()
  finishRouteLoading.delete(to)
})

export default router
