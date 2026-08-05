<script setup lang="ts">
  import { Input } from '@vuetify/v0'
  import { ref, watch } from 'vue'

  const props = withDefaults(defineProps<{
    modelValue: string
    placeholder?: string
    debounceMs?: number
  }>(), {
    placeholder: 'Buscar...',
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
// Nota: o isDirty é nativo do Input, logo, ele funciona como um valor booleano que retorna true sempre que tem algo no input
</script>

<template>
  <Input.Root
    #default="{ isDirty }"
    :model-value="searchValue"
    @update:model-value="onInput"
  >
    <div class="flex items-center bg-gray-100 rounded-full px-4 py-2 max-w-[32vw]">
      <span class="mdi mdi-magnify text-gray-400 text-xl mr-2" />

      <Input.Control
        class="bg-transparent w-full text-gray-700 outline-none placeholder-gray-400 px-1.5"
        :placeholder="placeholder"
        @keydown.enter="onEnter"
      />

      <button
        v-if="isDirty"
        class="mdi mdi-close text-gray-400 text-lg hover:text-gray-600 ml-2"
        type="button"
        @click="onClear"
      />
    </div>
  </Input.Root>
</template>
<style scoped>
input:focus,
input:focus-visible,
input:focus-within {
  outline: none !important;
  box-shadow: none !important;
  border-color: transparent !important;
}
</style>
