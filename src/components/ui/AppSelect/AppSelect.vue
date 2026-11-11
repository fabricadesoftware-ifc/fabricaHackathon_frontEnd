<template>
  <Select.Root v-model="model">
    <Select.Activator
      :aria-label="placeholder"
      :class="toolbar
        ? [
          'flex h-11 w-full min-w-0 items-center gap-2 rounded-lg border bg-app-surface px-3 text-sm transition-colors hover:border-app-brand-border-300 data-[open=true]:border-app-brand-border-600',
          active ? 'border-app-brand-border-300 text-app-link-hover' : 'border-app-border-default text-app-text-secondary',
        ]
        : 'flex items-center gap-3 rounded-lg border border-app-border-strong-neutral bg-app-surface px-3 text-sm text-app-text-body-strong-neutral shadow-sm transition-colors hover:bg-app-surface-subtle-neutral data-[open=true]:border-app-brand-border-600'"
    >
      <Select.Value v-slot="{ selectedValue }" :class="toolbar ? 'min-w-0 flex-1 truncate' : 'whitespace-nowrap'">
        {{ options.find((option) => option.value === selectedValue)?.label }}
      </Select.Value>

      <Select.Placeholder class="whitespace-nowrap text-app-text-body-strong-neutral">
        {{ placeholder }}
      </Select.Placeholder>

      <Select.Cue class="ml-auto text-app-text-placeholder-neutral transition-transform data-[state=open]:rotate-180">
        <span class="mdi mdi-chevron-down text-base" />
      </Select.Cue>
    </Select.Activator>

    <Select.Content
      class="z-10 mt-1 min-w-[8rem] overflow-hidden rounded-lg border border-app-border-default-neutral bg-app-surface py-1 shadow-lg"
    >
      <Select.Item
        v-for="option in options"
        :id="option.value"
        :key="option.value"
        class="cursor-pointer px-3 py-2 text-sm text-app-text-body-strong-neutral hover:bg-app-surface-muted-neutral data-[selected=true]:bg-app-selection-soft data-[selected=true]:font-medium data-[selected=true]:text-app-link"
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
