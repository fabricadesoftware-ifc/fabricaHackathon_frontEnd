<script setup lang="ts">

interface FilterOption {
  label: string
  value: string
}

interface Props {
  options: FilterOption[]
  modelValue: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

function selectOption(value: string) {
  emit('update:modelValue', value)
}

</script>

<template>
  <div class="flex gap-3">

    <button
      v-for="option in props.options"
      :key="option.value"
      @click="selectOption(option.value)"
      :class="[
        'px-4 py-2 rounded-full text-sm font-medium transition',
        props.modelValue === option.value
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      ]"
    >
      {{ option.label }}
    </button>

  </div>
</template>