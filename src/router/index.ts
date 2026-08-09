/**
 * router/index.ts
 *
 * Manual routes for ./src/pages/*.vue
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router'
import Index from '@/pages/index.vue'
import HomeView from '@/pages/HomeView.vue'
import EdicoesView from '@/pages/EdicoesView.vue'
import MyProjectsView from '@/pages/MyProjectsView.vue'
import InscricaoView from '@/pages/InscricaoView.vue'
import ConfiguracoesView from '@/pages/ConfiguracoesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      component: HomeView,
    },
    {
      path: '/edicoes',
      component: EdicoesView,
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
      path: '/configuracoes',
      component: ConfiguracoesView,
    },
  ],
})

export default router
