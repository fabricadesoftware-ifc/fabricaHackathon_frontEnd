<script setup lang=ts>
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
  <div class="flex justify-between px-4 py-3 bg-white min-w-full">
        <searchBar :modelValue='model' ></searchBar>
        <div class="flex justify-between gap-2">
          <SelectStatus placeholder="Tipo" :options="optionsTipo" v-model="tipo"></SelectStatus>
          <SelectStatus placeholder="Status" :options="optionsStatus" v-model="status"></SelectStatus>
          <SelectStatus placeholder="Ano" :options="optionsAno" v-model="ano"></SelectStatus>
        </div>
  </div>
</template>

<style scoped>

</style>