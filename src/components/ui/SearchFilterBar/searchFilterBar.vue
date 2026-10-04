<script setup lang="ts">
import AppSelect from '../AppSelect/AppSelect.vue'
import searchBar from '../SearchBar/searchBar.vue'
import { computed } from 'vue'

interface Props {
  search?: string
  tipo?: string
  status?: string
  ano?: string
}

const props = withDefaults(defineProps<Props>(), {
  search: '',
  tipo: '',
  status: '',
  ano: '',
})

const emit = defineEmits<{
  'update:search': [value: string]
  'update:tipo': [value: string]
  'update:status': [value: string]
  'update:ano': [value: string]
  search: [value: string]
}>()

const model = computed({
  get: () => props.search,
  set: (value: string) => {
    emit('update:search', value)
    emit('search', value)
  },
})

const tipo = computed({
  get: () => props.tipo,
  set: (value: string) => emit('update:tipo', value),
})

const status = computed({
  get: () => props.status,
  set: (value: string) => emit('update:status', value),
})

const ano = computed({
  get: () => props.ano,
  set: (value: string) => emit('update:ano', value),
})

const optionsTipo = [
  {
    label: '2º Ano',
    value: '1',
  },
  {
    label: '3º Ano',
    value: '2',
  },
  {
    label: 'Fábrica',
    value: '3',
  },
]

const optionsStatus = [
  {
    label: 'Inscrição',
    value: '1',
  },
  {
    label: 'Andamento',
    value: '2',
  },
  {
    label: 'Finalizado',
    value: '3',
  },
]

const optionsAno = [
  {
    label: '2026',
    value: '2026',
  },
  {
    label: '2025',
    value: '2025',
  },
  {
    label: '2024',
    value: '2024',
  },
  {
    label: '2023',
    value: '2023',
  },
]
</script>

<template>
  <div class="flex flex-col sm:flex-row justify-between gap-4 py-3 min-w-full">
    <searchBar v-model="model" />
    <div class="flex flex-wrap gap-4">
      <!-- Tipo -->
      <AppSelect v-model="tipo" :options="optionsTipo" placeholder="Tipo" />

      <!-- Status -->
      <AppSelect v-model="status" :options="optionsStatus" placeholder="Status" />

      <!-- Ano -->
      <AppSelect v-model="ano" :options="optionsAno" placeholder="Ano" />
    </div>
  </div>
</template>

<style scoped></style>