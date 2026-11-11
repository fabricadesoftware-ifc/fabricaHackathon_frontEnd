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
        'filter-underline min-h-11 -mb-px rounded-none [border-width:0_0_2px] bg-[transparent] px-[1rem] py-[.75rem] text-sm font-normal transition-[color,border-color,background-color] duration-150 whitespace-nowrap hover:bg-app-surface-faint hover:text-app-ink-heading',
        selected ? 'border-app-brand-accent text-app-brand-text' : 'border-transparent text-app-ink-muted',
      ]
    }
    return [
      'px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap min-h-11',
      selected ? 'bg-app-selection-soft text-app-link-hover border border-app-brand-border-200' : 'bg-app-surface border border-app-border-default text-app-text-secondary hover:bg-app-surface-subtle-neutral',
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
.filter-underline { font-size: .875rem; color: var(--app-ink-muted); }
.filter-underline[aria-pressed="true"] { color: var(--app-brand-text); }
.filter-underline:hover { color: var(--app-ink-heading); }
</style>
