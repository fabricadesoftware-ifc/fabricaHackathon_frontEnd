import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import { connectThemes, themePlugin, vuetify } from '../../src/plugins/vuetify'
import Fixtures from './Fixtures.vue'
import '../../src/tailwind.css'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

// Isolated UI fixtures never request or write real backend data.
Object.assign(window, { __APP_CONFIG__: { API_URL: `${location.origin}/api-fixture` } })
const editions = [
  { id: 1, nome: 'Edição com inscrições', status: 'INSCRICAO', status_label: 'Inscrições abertas' },
  { id: 2, nome: 'Edição em andamento', status: 'EM_ANDAMENTO', status_label: 'Em andamento' },
].map(edition => ({
  ...edition, ano: 2026, data_inicio: '2026-11-11', data_fim: '2026-11-12',
  local: 'Campus IFC', responsavel: 'Organização', tipo_edicao: 'Hackathon', total_equipes: 4,
}))
window.fetch = async input => {
  const url = String(input instanceof Request ? input.url : input)
  if (new URLSearchParams(location.search).get('case') === 'home') {
    const results = url.includes('/edicoes/') ? editions : []
    return Response.json({ results, count: results.length, next: null, previous: null }, {
      headers: { 'Content-Type': 'application/json' },
    })
  }
  return Response.json({ detail: 'Fixture sem dados de API.' }, {
    status: 404, headers: { 'Content-Type': 'application/json' },
  })
}
const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/:pathMatch(.*)*', component: { render: () => null } }, { path: '/edicoes/:id', name: 'edicoes', component: { render: () => null } }],
})
void router.push('/projetos/1/pre-avaliacao')
const app = createApp(Fixtures).use(createPinia()).use(vuetify).use(themePlugin).use(router)
connectThemes(app)
app.mount('#app')
