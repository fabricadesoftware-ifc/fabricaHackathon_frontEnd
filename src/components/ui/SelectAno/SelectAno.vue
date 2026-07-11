<template>
  <Select.Root v-model="model">
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
  import { computed } from 'vue'

  export interface SelectOption {
    label: string
    value: string
  }

  interface Props {
    options: SelectOption[]
    modelValue: string | null
    placeholder?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    placeholder: 'Ano',
  })

  const emit = defineEmits<{
    'update:modelValue': [value: string | null]
  }>()

  const model = computed<string | undefined>({
    get: () => props.modelValue ?? undefined,
    set: (value: string | undefined) => emit('update:modelValue', value ?? null),
  })
</script>
