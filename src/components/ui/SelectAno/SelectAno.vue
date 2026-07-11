<template>
  <Select.Root>
    <Select.Activator>
      <Select.Value v-slot="{ selectedValue }">
        {{ options.find((option) => option.value === selectedValue)?.label }}
      </Select.Value>

      <Select.Placeholder>
        {{ placeholder }}
      </Select.Placeholder>

      <Select.Cue>
        <span class="mdi mdi-chevron-down" />
      </Select.Cue>
    </Select.Activator>

    <Select.Content>
      <Select.Item
        v-for="option in options"
        :id="option.value"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </Select.Item>
    </Select.Content>
  </Select.Root>
</template>

<script setup lang="ts">
  import { Select } from '@vuetify/v0'

  export interface SelectOption {
    label: string
    value: string
  }

  interface Props {
    options: SelectOption[]
    modelValue: string | null
    placeholder?: string
  }

  withDefaults(defineProps<Props>(), {
    placeholder: 'Ano',
  })

  defineEmits<{
    'update:modelValue': [value: string | null]
  }>()
</script>
