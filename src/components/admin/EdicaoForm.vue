<script setup lang="ts">
  import type { PainelEdicaoBase } from '@/services/painel'
  import { onMounted, reactive, ref } from 'vue'
  import { ApiError } from '@/services/http'
  import { listarTiposEdicao } from '@/services/painel'

  const props = defineProps<{
    inicial?: Partial<PainelEdicaoBase>
    rotulo: string
    onSalvar: (dados: Record<string, unknown>) => Promise<void>
  }>()

  const f = reactive({
    nome: props.inicial?.nome ?? '',
    ano: props.inicial?.ano ?? new Date().getFullYear(),
    descricao: props.inicial?.descricao ?? '',
    tipo_edicao: props.inicial?.tipo_edicao ?? (null as number | null),
    data_inicio: props.inicial?.data_inicio ?? '',
    data_fim: props.inicial?.data_fim ?? '',
    local: props.inicial?.local ?? '',
    responsavel: props.inicial?.responsavel ?? '',
    minimo_participantes: props.inicial?.minimo_participantes ?? 3,
    maximo_participantes: props.inicial?.maximo_participantes ?? 5,
    maximo_equipes: props.inicial?.maximo_equipes ?? 20,
  })
  const tipos = ref<{ id: number, nome: string }[]>([])
  const erro = ref('')
  const ok = ref(false)
  const salvando = ref(false)

  onMounted(async () => {
    try {
      const r = await listarTiposEdicao()
      tipos.value = Array.isArray(r) ? r : (r.results ?? [])
      if (f.tipo_edicao === null && tipos.value.length > 0) {
        f.tipo_edicao = tipos.value[0].id
      }
    } catch { /* o select fica vazio */ }
  })

  async function enviar () {
    erro.value = ''
    ok.value = false
    salvando.value = true
    try {
      await props.onSalvar({ ...f })
      ok.value = true
    } catch (error_) {
      erro.value = error_ instanceof ApiError ? error_.message : 'Não foi possível salvar.'
    } finally {
      salvando.value = false
    }
  }

  const campo = 'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none'
</script>

<template>
  <form class="grid gap-4 sm:grid-cols-2" @submit.prevent="enviar">
    <label class="text-sm sm:col-span-2">Nome
      <input v-model="f.nome" :class="campo" name="nome" required>
    </label>

    <label class="text-sm">Ano
      <input
        v-model.number="f.ano"
        :class="campo"
        name="ano"
        required
        type="number"
      >
    </label>

    <label class="text-sm">Tipo
      <select v-model="f.tipo_edicao" :class="campo" name="tipo_edicao" required>
        <option v-for="t in tipos" :key="t.id" :value="t.id">{{ t.nome }}</option>
      </select>
    </label>

    <label class="text-sm">Início
      <input
        v-model="f.data_inicio"
        :class="campo"
        name="data_inicio"
        required
        type="date"
      >
    </label>

    <label class="text-sm">Fim
      <input
        v-model="f.data_fim"
        :class="campo"
        name="data_fim"
        required
        type="date"
      >
    </label>

    <label class="text-sm">Local
      <input v-model="f.local" :class="campo" name="local">
    </label>

    <label class="text-sm">Responsável
      <input v-model="f.responsavel" :class="campo" name="responsavel">
    </label>

    <label class="text-sm">Mín. participantes por equipe
      <input v-model.number="f.minimo_participantes" :class="campo" min="1" type="number">
    </label>

    <label class="text-sm">Máx. participantes por equipe
      <input v-model.number="f.maximo_participantes" :class="campo" min="1" type="number">
    </label>

    <label class="text-sm">Máx. de equipes
      <input v-model.number="f.maximo_equipes" :class="campo" min="1" type="number">
    </label>

    <label class="text-sm sm:col-span-2">Descrição
      <textarea v-model="f.descricao" :class="campo" rows="3" />
    </label>

    <p v-if="erro" class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 sm:col-span-2" role="alert">{{ erro }}</p>
    <p v-if="ok" class="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800 sm:col-span-2" role="status">Salvo.</p>

    <div class="sm:col-span-2">
      <button class="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60" :disabled="salvando" type="submit">{{ salvando ? 'Salvando…' : rotulo }}</button>
    </div>
  </form>
</template>
