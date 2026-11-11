<template>
  <Pagination.Root
    v-slot="{ items }"
    v-model="model"
    class="flex flex-wrap items-center justify-center gap-1 mt-10"
    :items-per-page="1"
    :size="length"
  >
    <Pagination.Prev
      class="flex h-9 w-9 items-center justify-center rounded-md border border-app-border-strong-neutral bg-app-surface text-app-text-muted-neutral transition-colors hover:bg-app-surface-subtle-neutral data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40"
    >
      <span class="mdi mdi-chevron-left text-lg" />
    </Pagination.Prev>

    <template v-for="(item, index) in items" :key="index">
      <Pagination.Ellipsis
        v-if="item.type === 'ellipsis'"
        class="flex h-9 w-9 items-center justify-center text-sm text-app-text-placeholder-neutral"
      />

      <Pagination.Item
        v-else
        class="flex h-9 w-9 items-center justify-center rounded-md border border-app-border-strong-neutral bg-app-surface text-sm font-medium text-app-text-body-strong-neutral transition-colors hover:bg-app-surface-subtle-neutral data-[selected]:border-app-brand-border-600 data-[selected]:bg-app-action data-[selected]:text-app-on-brand data-[selected]:hover:bg-app-action"
        :value="item.value as number"
      >
        {{ item.value }}
      </Pagination.Item>
    </template>

    <Pagination.Next
      class="flex h-9 w-9 items-center justify-center rounded-md border border-app-border-strong-neutral bg-app-surface text-app-text-muted-neutral transition-colors hover:bg-app-surface-subtle-neutral data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40"
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
