<script setup lang="ts">

  interface FilterOption {
    label: string
    value: string
  }

  interface Props {
    options: FilterOption[]
    modelValue: string
    variant?: 'chips' | 'underline'
  }

  const props = defineProps<Props>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
  }>()

  function optionClasses (value: string) {
    const selected = props.modelValue === value
    if (props.variant === 'underline') {
      return [
        'filter-underline min-h-11 -mb-px rounded-none [border-width:0_0_2px] bg-[transparent] px-[1rem] py-[.75rem] text-sm font-normal transition-[color,border-color,background-color] duration-150 whitespace-nowrap hover:bg-[#f8fafc] hover:text-[#334155]',
        selected ? 'border-[#2563eb] text-[#2563eb]' : 'border-transparent text-[#64748b]',
      ]
    }
    return [
      'px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap min-h-11',
      selected ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-white border border-slate-200 text-slate-600 hover:bg-gray-50',
    ]
  }

  function selectOption (value: string) {
    emit('update:modelValue', value)
  }

</script>

<template>
  <div :class="props.variant === 'underline' ? 'flex gap-0' : 'flex gap-2 sm:gap-3 flex-wrap'">

    <button
      v-for="option in props.options"
      :key="option.value"
      :aria-pressed="props.modelValue === option.value"
      :class="optionClasses(option.value)"
      type="button"
      @click="selectOption(option.value)"
    >
      {{ option.label }}
    </button>

  </div>
</template>

<style scoped>
/* Preserve these properties above Vuetify's unlayered button reset. */
.filter-underline { font-size: .875rem; color: #64748b; }
.filter-underline[aria-pressed="true"] { color: #2563eb; }
.filter-underline:hover { color: #334155; }
</style>
