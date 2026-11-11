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

  function comTodos (options: Option[]): Option[] {
    return options.length > 0 ? [{ label: 'Todos', value: TODOS }, ...options] : []
  }

  function clearAll () {
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
          <span aria-hidden="true" class="mdi mdi-magnify pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xl text-app-link" />

          <input
            v-model="search"
            :aria-label="props.placeholder"
            class="h-11 w-full min-w-0 rounded-lg border border-app-border-default bg-app-surface py-2 pl-11 pr-10 text-sm text-app-text-body-strong outline-none placeholder:text-app-text-placeholder focus:border-app-brand-border-500 focus:ring-2 focus:ring-app-focus-halo"
            :placeholder="props.placeholder"
            type="search"
          >

          <button
            v-if="search"
            aria-label="Limpar busca"
            class="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-app-text-placeholder hover:bg-app-surface-muted hover:text-app-text-body-strong"
            type="button"
            @click="search = ''"
          >
            <span aria-hidden="true" class="mdi mdi-close text-lg" />
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
            :active="Boolean(tipo)"
            :model-value="tipo"
            :options="comTodos(props.optionsTipo)"
            :placeholder="props.tipoLabel"
            :toolbar="isToolbar"
            @update:model-value="tipo = $event === TODOS ? '' : $event"
          />
        </div>

        <div v-if="props.optionsStatus.length > 0" :class="isToolbar ? 'min-w-0 sm:w-36' : ''">
          <AppSelect
            :active="Boolean(status)"
            :model-value="status"
            :options="comTodos(props.optionsStatus)"
            placeholder="Status"
            :toolbar="isToolbar"
            @update:model-value="status = $event === TODOS ? '' : $event"
          />
        </div>

        <div v-if="props.optionsAno.length > 0" :class="isToolbar ? 'min-w-0 sm:w-28' : ''">
          <AppSelect
            :active="Boolean(ano)"
            :model-value="ano"
            :options="comTodos(props.optionsAno)"
            placeholder="Ano"
            :toolbar="isToolbar"
            @update:model-value="ano = $event === TODOS ? '' : $event"
          />
        </div>

        <button
          v-if="isToolbar && hasActiveFilters"
          class="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-medium text-app-link-hover hover:bg-app-selection-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-focus"
          type="button"
          @click="clearAll"
        >
          <span aria-hidden="true" class="mdi mdi-filter-remove-outline text-lg" />
          Limpar tudo
        </button>
      </div>
    </div>
  </div>
</template>
