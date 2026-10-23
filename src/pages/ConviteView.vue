<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { AsyncView } from '@/components/ui/AsyncView'
  import { useAsync } from '@/composables/useAsync'
  import { ApiError } from '@/services/http'
  import { aceitarConvite, obterConvite } from '@/services/inscricoes'
  import { useAuthStore } from '@/stores/auth'

  const route = useRoute()
  const router = useRouter()
  const auth = useAuthStore()
  const token = computed(() => String(route.params.token))

  const { data, loading, error, run } = useAsync(() => obterConvite(token.value))
  const entrando = ref(false)
  const erroAcao = ref('')

  const destino = computed(() => ({ redirect: route.fullPath }))
  const ehParticipante = computed(() => auth.userRole === 'PARTICIPANTE')

  async function entrar () {
    if (entrando.value) return
    entrando.value = true
    erroAcao.value = ''
    try {
      await aceitarConvite(token.value)
      router.push('/equipes')
    } catch (error_) {
      erroAcao.value = error_ instanceof ApiError
        ? (Object.values(error_.fields).flat().join(' ') || error_.message)
        : 'Não foi possível entrar na equipe.'
    } finally {
      entrando.value = false
    }
  }
</script>

<template>
  <div class="mx-auto flex min-h-[60vh] w-full max-w-md items-center px-4 py-10">
    <div class="w-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <AsyncView :error="error" :loading="loading" @retry="run">
        <template v-if="data">
          <p class="text-sm text-gray-500">Convite para equipe</p>
          <h1 class="mt-1 text-2xl font-semibold text-gray-900" data-testid="convite-equipe">{{ data.equipe }}</h1>

          <p class="mt-1 text-sm text-gray-600">
            Edição {{ data.edicao }}<template v-if="data.criador"> · convidado por {{ data.criador }}</template>
          </p>

          <p v-if="!data.valido" class="mt-5 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800" role="alert">{{ data.motivo }}</p>

          <template v-else-if="!auth.isAuthenticated">
            <p class="mt-5 text-sm text-gray-700">Entre ou crie uma conta para aceitar o convite.</p>

            <div class="mt-4 flex flex-wrap gap-3">
              <router-link class="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700" :to="{ path: '/login', query: destino }">Entrar</router-link>
              <router-link class="rounded-lg border border-gray-300 px-5 py-2.5 text-sm hover:bg-gray-50" :to="{ path: '/registro', query: destino }">Criar conta</router-link>
            </div>
          </template>

          <template v-else-if="!ehParticipante">
            <p class="mt-5 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">Só contas com perfil de Participante entram em equipes.</p>
          </template>

          <template v-else>
            <button
              class="mt-5 w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
              data-testid="aceitar-convite"
              :disabled="entrando"
              type="button"
              @click="entrar"
            >
              {{ entrando ? 'Entrando…' : 'Entrar na equipe' }}
            </button>
          </template>

          <p v-if="erroAcao" class="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600" role="alert">{{ erroAcao }}</p>
        </template>
      </AsyncView>
    </div>
  </div>
</template>
