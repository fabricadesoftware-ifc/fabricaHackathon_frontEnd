<script setup lang=ts>
import AppSelect from '../AppSelect/AppSelect.vue';
import searchBar from '../SearchBar/searchBar.vue';
import SelectStatus from '../SelectStatus/SelectStatus.vue';
import { ref } from 'vue';
const model = ref('');
const tipo = ref('');
const optionsTipo = [{
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
];
const status = ref('');
const optionsStatus = [{
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
const ano = ref('');
const optionsAno = [{
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
  <div class="flex justify-between py-3 bg-white min-w-full">
    <searchBar :modelValue='model'></searchBar>
    <div class="flex gap-4">
    <!-- Tipo -->
    <AppSelect
      v-model="tipo"
      :options="optionsTipo"
      placeholder="Tipo"
    />

    <!-- Status -->
    <AppSelect
      v-model="status"
      :options="optionsStatus"
      placeholder="Status"
    />

    <!-- Ano -->
    <AppSelect
      v-model="ano"
      :options="optionsAno"
      placeholder="Ano"
    />
  </div>
  </div>
</template>

<style scoped></style>