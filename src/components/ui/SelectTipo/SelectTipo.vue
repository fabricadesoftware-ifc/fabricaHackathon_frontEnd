<template>
  <v-select
    v-model="model"
    item-title="label"
    item-value="value"
    :items="props.options"
    persistent-placeholder
    :placeholder="props.placeholder"
  />
</template>
<script setup lang="ts">
  import { computed } from 'vue'
  import { VSelect } from 'vuetify/components'

  type Model = string | null

  interface SelectOption {
    label: string
    value: string
  }

  const props = defineProps<{
    options: SelectOption[]
    modelValue: Model
    placeholder: string
  }>()

  const emits = defineEmits<{
    (e: 'update:modelValue', value: Model): void
  }>()

  const model = computed({
    get: () => props.modelValue,
    set: (value: Model) => emits('update:modelValue', value),
  })
</script>
