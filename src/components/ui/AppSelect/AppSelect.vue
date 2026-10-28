<template>
  <Select.Root v-model="model">
    <Select.Activator
      :aria-label="placeholder"
      :class="toolbar
        ? [
          'flex h-11 w-full min-w-0 items-center gap-2 rounded-lg border bg-white px-3 text-sm transition-colors hover:border-blue-300 data-[open=true]:border-blue-600',
          active ? 'border-blue-300 text-blue-700' : 'border-slate-200 text-slate-600',
        ]
        : 'flex items-center gap-3 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 shadow-sm transition-colors hover:bg-gray-50 data-[open=true]:border-blue-600'"
    >
      <Select.Value v-slot="{ selectedValue }" :class="toolbar ? 'min-w-0 flex-1 truncate' : 'whitespace-nowrap'">
        {{ options.find((option) => option.value === selectedValue)?.label }}
      </Select.Value>

      <Select.Placeholder class="whitespace-nowrap text-gray-700">
        {{ placeholder }}
      </Select.Placeholder>

      <Select.Cue class="ml-auto text-gray-400 transition-transform data-[state=open]:rotate-180">
        <span class="mdi mdi-chevron-down text-base" />
      </Select.Cue>
    </Select.Activator>

    <Select.Content
      class="z-10 mt-1 min-w-[8rem] overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
    >
      <Select.Item
        v-for="option in options"
        :id="option.value"
        :key="option.value"
        class="cursor-pointer px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 data-[selected=true]:bg-blue-50 data-[selected=true]:font-medium data-[selected=true]:text-blue-600"
        :value="option.value"
      >
        {{ option.label }}
      </Select.Item>
    </Select.Content>
  </Select.Root>
</template>

<script setup lang="ts">
  import { Select } from '@vuetify/v0'
  import { computed } from 'vue'

  export interface SelectOption {
    label: string
    value: string
  }

  interface Props {
    options: SelectOption[]
    modelValue: string
    placeholder?: string
    toolbar?: boolean
    active?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    placeholder: 'Ano',
    toolbar: false,
    active: false,
  })

  const emit = defineEmits<{
    'update:modelValue': [value: string]
  }>()

  const model = computed({
    get: () => props.modelValue || undefined,
    set: (value: string | undefined) => emit('update:modelValue', value ?? ''),
  })
</script>
