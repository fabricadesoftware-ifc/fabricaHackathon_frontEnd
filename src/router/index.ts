import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/pages/HomeView.vue'
import EdicoesView from '@/pages/EdicoesView.vue'
import MyProjectsView from '@/pages/MyProjectsView.vue'
import InscricaoView from '@/pages/InscricaoView.vue'
import EvaluationsListView from '@/pages/EvaluationsListView.vue'
import EventView from '@/pages/EventView.vue'
import ProjectEvaluationView from '@/pages/ProjectEvaluationView.vue'
import ProjectRegistrationView from '@/pages/ProjectRegistrationView.vue'

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
    },
    {
      path: '/inscricao',
      component: InscricaoView,
    },
    {
      path: '/avaliacao',
      name: 'avaliacoes',
      component: EvaluationsListView,
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
      meta: { requiresAuth: true },
    },
    {
      path: '/avaliacao/:editionId/projeto/:projectId',
      name: 'avaliacao-projeto',
      component: ProjectEvaluationView,
      meta: { requiresAuth: true },
    },
  ],
})

export default router