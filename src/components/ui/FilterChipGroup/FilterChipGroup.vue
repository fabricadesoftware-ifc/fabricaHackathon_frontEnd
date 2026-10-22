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
  <div class="flex gap-2 sm:gap-3 flex-wrap">

    <button
      v-for="option in props.options"
      :key="option.value"
      @click="selectOption(option.value)"
      :class="[
        'px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition whitespace-nowrap',
        props.modelValue === option.value
          ? 'bg-blue-600 text-white border border-blue-600'
          : 'bg-white border border-gray-400 text-gray-700 hover:bg-gray-50'
      ]"
    >
      {{ option.label }}
    </button>

  </div>
</template>