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

  function selectOption (value: string) {
    emit('update:modelValue', value)
  }

</script>

<template>
  <div class="flex gap-2 sm:gap-3 flex-wrap">

    <button
      v-for="option in props.options"
      :key="option.value"
      :aria-pressed="props.modelValue === option.value"
      :class="[
        'px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap min-h-11',
        props.modelValue === option.value
          ? 'bg-blue-50 text-blue-700 border border-blue-200'
          : 'bg-white border border-slate-200 text-slate-600 hover:bg-gray-50'
      ]"
      type="button"
      @click="selectOption(option.value)"
    >
      {{ option.label }}
    </button>

  </div>
</template>
