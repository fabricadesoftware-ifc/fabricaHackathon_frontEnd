<template>
  <div>
    <!-- ola renan mais uma vez -->
  </div>
</template>

<script setup lang="ts">
  export interface SelectOption {
    label: string
    value: string
  }

  defineProps<{
    options: SelectOption[]
    modelValue: string | null
    placeholder?: string
  }>()

  defineEmits<{
    'update:modelValue': [value: string | null]
  }>()
</script>
