<script setup lang="ts">

  import { onBeforeUnmount, ref, watch } from 'vue'

  const props = withDefaults(defineProps<{
    modelValue: string
    placeholder?: string
    debounceMs?: number
    id?: string
    ariaLabel?: string
  }>(), {
    placeholder: 'Buscar…',
    id: undefined,
    ariaLabel: 'Buscar',
    debounceMs: 300,
  })

  const emit = defineEmits<{
    'update:modelValue': [value: string]
    'search': [query: string]
  }>()

  const searchValue = ref(props.modelValue)

  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  watch(() => props.modelValue, (val: string) => {
    searchValue.value = val
  })

  onBeforeUnmount(() => {
    if (debounceTimer) clearTimeout(debounceTimer)
  })

  function onInput (value: string) {
    searchValue.value = value
    emit('update:modelValue', value)
    debounceSearch()
  }

  function debounceSearch () {
    if (debounceTimer) clearTimeout(debounceTimer)

    debounceTimer = setTimeout(() => {
      emit('search', searchValue.value)
    }, props.debounceMs)
  }

  function onEnter () {
    if (debounceTimer) clearTimeout(debounceTimer)

    emit('search', searchValue.value)
  }

  function onClear () {
    searchValue.value = ''

    emit('update:modelValue', '')

    if (debounceTimer) clearTimeout(debounceTimer)

    emit('search', '')
  }

</script>

<template>

  <div>

    <div
      class="
      flex
      items-center
      bg-white
      border
      border-[#E5E7EB]

      transition
      hover:border-blue-300
      focus-within:border-blue-600
      focus-within:ring-2
      focus-within:ring-blue-100
      rounded-lg
      h-11
      w-full
      px-4
    "
    >

      <span
        aria-hidden="true"
        class="
        mdi mdi-magnify
        text-blue-600
        text-[22px]
        mr-2
      "
      />

      <input
        :id="id"
        :aria-label="ariaLabel"
        autocomplete="off"
        class="
        bg-transparent
        w-full
        text-gray-900
        text-sm
        placeholder-slate-500
        outline-none
      "
        name="search"
        :placeholder="placeholder"
        type="search"
        :value="searchValue"
        @input="onInput(($event.target as HTMLInputElement).value)"
        @keydown.enter="onEnter"
      >

      <button
        v-if="searchValue"
        aria-label="Limpar busca"
        class="
          mdi mdi-close
          text-gray-400
          text-[20px]
          xl:text-[25px]
          hover:text-gray-600
          ml-2
          min-h-8 min-w-8
        "
        type="button"
        @click="onClear"
      />

    </div>

  </div>

</template>
