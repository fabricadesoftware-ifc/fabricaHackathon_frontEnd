<template>
  <Pagination.Root
    v-slot="{ items }"
    v-model="model"
    :size="length"
    :items-per-page="1"
    class="flex flex-wrap items-center justify-center gap-1"
  >
    <Pagination.Prev
      class="flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-500 transition-colors hover:bg-gray-50 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40"
    >
      <span class="mdi mdi-chevron-left text-lg" />
    </Pagination.Prev>

    <template v-for="(item, index) in items" :key="index">
      <Pagination.Ellipsis
        v-if="item.type === 'ellipsis'"
        class="flex h-9 w-9 items-center justify-center text-sm text-gray-400"
      />

      <Pagination.Item
        v-else
        :value="item.value as number"
        class="flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 data-[selected]:border-blue-600 data-[selected]:bg-blue-600 data-[selected]:text-white data-[selected]:hover:bg-blue-600"
      >
        {{ item.value }}
      </Pagination.Item>
    </template>

    <Pagination.Next
      class="flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-500 transition-colors hover:bg-gray-50 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40"
    >
      <span class="mdi mdi-chevron-right text-lg" />
    </Pagination.Next>
  </Pagination.Root>
</template>

<script setup lang="ts">
import { Pagination } from '@vuetify/v0'
import { computed } from 'vue'

interface Props {
  length: number
  modelValue: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [page: number]
  'update:page': [page: number]
}>()

const model = computed({
  get: () => props.modelValue,
  set: (value: number) => {
    emit('update:modelValue', value)
    emit('update:page', value)
  },
})
</script>
