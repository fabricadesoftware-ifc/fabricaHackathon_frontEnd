<script setup lang="ts">
import { computed } from 'vue'
import AppSelect from '../AppSelect/AppSelect.vue'
import searchBar from '../SearchBar/searchBar.vue'

const search = defineModel<string>('search', { default: '' })
const tipo = defineModel<string>('tipo', { default: '' })
const status = defineModel<string>('status', { default: '' })
const ano = defineModel<string>('ano', { default: '' })

interface Option { label: string, value: string }

const TODOS = '__todos'

const props = withDefaults(defineProps<{
  placeholder?: string
  appearance?: 'standard' | 'toolbar'
  tipoLabel?: string
  optionsTipo?: Option[]
  optionsStatus?: Option[]
  optionsAno?: Option[]
}>(), {
  placeholder: 'Buscar...',
  appearance: 'standard',
  tipoLabel: 'Tipo',
  optionsTipo: () => [],
  optionsStatus: () => [],
  optionsAno: () => [],
})

const isToolbar = computed(() => props.appearance === 'toolbar')
const hasOptions = computed(() =>
  props.optionsTipo.length > 0 || props.optionsStatus.length > 0 || props.optionsAno.length > 0,
)
const hasActiveFilters = computed(() => Boolean(tipo.value || status.value || ano.value))

function comTodos(options: Option[]): Option[] {
  return options.length > 0 ? [{ label: 'Todos', value: TODOS }, ...options] : []
}

function clearAll() {
  search.value = ''
  tipo.value = ''
  status.value = ''
  ano.value = ''
}
</script>

<template>
  <div
    :class="isToolbar
      ? 'mb-5 w-full min-w-0'
      : 'flex min-w-full flex-col justify-between gap-4 py-3 sm:flex-row'"
  >
    <div :class="isToolbar ? 'flex min-w-0 flex-col gap-3 xl:flex-row xl:items-center' : 'contents'">
      <div :class="isToolbar ? hasOptions ? 'relative min-w-0 flex-1' : 'relative w-full max-w-[420px]' : 'w-full sm:w-72 lg:w-96'">
        <template v-if="isToolbar">
          <span class="mdi mdi-magnify pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xl text-blue-600" aria-hidden="true" />
          <input
            v-model="search"
            type="search"
            :aria-label="props.placeholder"
            :placeholder="props.placeholder"
            class="h-11 w-full min-w-0 rounded-lg border border-slate-200 bg-white py-2 pl-11 pr-10 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
          <button
            v-if="search"
            type="button"
            aria-label="Limpar busca"
            class="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            @click="search = ''"
          >
            <span class="mdi mdi-close text-lg" aria-hidden="true" />
          </button>
        </template>
        <searchBar v-else v-model="search" :placeholder="props.placeholder" />
      </div>

      <div
        v-if="hasOptions"
        :class="isToolbar
          ? 'grid min-w-0 grid-cols-2 gap-2 sm:flex sm:flex-wrap xl:justify-end'
          : 'flex flex-wrap gap-4'"
      >
        <div v-if="props.optionsTipo.length > 0" :class="isToolbar ? 'min-w-0 sm:w-40' : ''">
          <AppSelect
            :model-value="tipo"
            :options="comTodos(props.optionsTipo)"
            :placeholder="props.tipoLabel"
            :toolbar="isToolbar"
            :active="Boolean(tipo)"
            @update:model-value="tipo = $event === TODOS ? '' : $event"
          />
        </div>

        <div v-if="props.optionsStatus.length > 0" :class="isToolbar ? 'min-w-0 sm:w-36' : ''">
          <AppSelect
            :model-value="status"
            :options="comTodos(props.optionsStatus)"
            placeholder="Status"
            :toolbar="isToolbar"
            :active="Boolean(status)"
            @update:model-value="status = $event === TODOS ? '' : $event"
          />
        </div>

        <div v-if="props.optionsAno.length > 0" :class="isToolbar ? 'min-w-0 sm:w-28' : ''">
          <AppSelect
            :model-value="ano"
            :options="comTodos(props.optionsAno)"
            placeholder="Ano"
            :toolbar="isToolbar"
            :active="Boolean(ano)"
            @update:model-value="ano = $event === TODOS ? '' : $event"
          />
        </div>

        <button
          v-if="isToolbar && hasActiveFilters"
          type="button"
          class="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-medium text-blue-700 hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          @click="clearAll"
        >
          <span class="mdi mdi-filter-remove-outline text-lg" aria-hidden="true" />
          Limpar tudo
        </button>
      </div>
    </div>
  </div>
</template>
