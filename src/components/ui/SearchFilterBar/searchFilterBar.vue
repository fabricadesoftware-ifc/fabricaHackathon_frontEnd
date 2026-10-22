<script setup lang="ts">
  import AppSelect from '../AppSelect/AppSelect.vue'
  import searchBar from '../SearchBar/searchBar.vue'

  const search = defineModel<string>('search', {
    default: '',
  })

  const tipo = defineModel<string>('tipo', {
    default: '',
  })

  const status = defineModel<string>('status', {
    default: '',
  })

  const ano = defineModel<string>('ano', {
    default: '',
  })

  interface Option { label: string, value: string }

  /** Valor da opção que limpa o filtro (o Select não permite desmarcar). */
  const TODOS = '__todos'

  const props = withDefaults(defineProps<{
    placeholder?: string
    optionsTipo?: Option[]
    optionsStatus?: Option[]
    optionsAno?: Option[]
  }>(), {
    placeholder: 'Buscar...',
    optionsTipo: () => [],
    optionsStatus: () => [],
    optionsAno: () => [],
  })

  function comTodos (options: Option[]): Option[] {
    return options.length > 0 ? [{ label: 'Todos', value: TODOS }, ...options] : []
  }
</script>

<template>
  <div class="flex flex-col sm:flex-row justify-between gap-4 py-3 min-w-full">
    <div class="w-full sm:w-72 lg:w-96">
      <searchBar v-model="search" :placeholder="props.placeholder" />
    </div>

    <div class="flex flex-wrap gap-4">
      <AppSelect
        v-if="props.optionsTipo.length > 0"
        :model-value="tipo"
        :options="comTodos(props.optionsTipo)"
        placeholder="Tipo"
        @update:model-value="tipo = $event === TODOS ? '' : $event"
      />

      <AppSelect
        v-if="props.optionsStatus.length > 0"
        :model-value="status"
        :options="comTodos(props.optionsStatus)"
        placeholder="Status"
        @update:model-value="status = $event === TODOS ? '' : $event"
      />

      <AppSelect
        v-if="props.optionsAno.length > 0"
        :model-value="ano"
        :options="comTodos(props.optionsAno)"
        placeholder="Ano"
        @update:model-value="ano = $event === TODOS ? '' : $event"
      />
    </div>
  </div>
</template>

<style scoped></style>
