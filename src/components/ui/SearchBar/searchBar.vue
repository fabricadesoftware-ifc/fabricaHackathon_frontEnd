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


function onInput(value: string) {
  searchValue.value = value
  emit('update:modelValue', value)
  debounceSearch()
}


function debounceSearch() {
  if (debounceTimer) clearTimeout(debounceTimer)

  debounceTimer = setTimeout(() => {
    emit('search', searchValue.value)
  }, props.debounceMs)
}


function onEnter() {
  if (debounceTimer) clearTimeout(debounceTimer)

  emit('search', searchValue.value)
}


function onClear() {
  searchValue.value = ''

  emit('update:modelValue', '')

  if (debounceTimer) clearTimeout(debounceTimer)

  emit('search', '')
}

</script>


<template>

  <Input.Root
    #default="{ isDirty }"
    :model-value="searchValue"
    @update:model-value="onInput"
  >

    <div
      class="
      flex
      items-center
      bg-gray-100
      border-2
      border-[#E5E7EB]
      focus-within:border-blue-500
      rounded-full
      h-[45px]
      w-[350px]
      px-3
    "
    >

      <span
        class="
        mdi mdi-magnify
        text-gray-400
        text-[22px]
        mr-2
      "
      />


      <Input.Control
        class="
        bg-transparent
        w-full
        text-gray-700
        text-sm
        placeholder-gray-400
        outline-none
      "
        "
        :placeholder="placeholder"
        @keydown.enter="onEnter"
      />


      <button
        v-if="isDirty"
        class="
          mdi mdi-close
          text-gray-400
          text-[20px]
          xl:text-[25px]
          hover:text-gray-600
          ml-2
        "
        type="button"
        @click="onClear"
      />

    </div>

  </Input.Root>

</template>
