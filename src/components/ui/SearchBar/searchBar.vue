<script setup lang="ts">
  import { Input } from '@vuetify/v0'
  import { ref, watch } from 'vue'

  const props = withDefaults (defineProps<{
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
    v-slot="{ isDirty }"
    :model-value="searchValue"
    @update:model-value="onInput"
  >
    <div class="focus-within:border-blue-500 flex items-center border-[#E5E7EB] border-[3px] border-solid bg-gray-100 rounded-full px-8 max-w-[50vw]">
      <span
        class="mdi mdi-magnify text-gray-400 mr-2 text-[60px]"
      />

      <Input.Control
        class="bg-transparent w-[35vw] text-gray-700 py-2.5 text-[35px] placeholder-gray-400 rounded-[10px] px-1.5"
        :placeholder="placeholder"
        style="outline: none;"
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
