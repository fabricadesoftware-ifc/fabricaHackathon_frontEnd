<script setup lang="ts">
import { computed } from 'vue'

type Variant = 'primary' | 'text'

const props = defineProps<{
  variant: Variant
  label: string
  disabled?: boolean
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()

function handleClick () {
  if (props.disabled || props.loading) return
  emit('click')
}

const base = 'py-2 px-3.5 rounded-md text-[20px] font-normal normal-case transition-all duration-150 ease-in-out'

const buttonClasses = computed(() => {
  const variants: Record<Variant, string> = {
    primary: 'bg-[#2563EB] text-white hover:bg-[#2054C6]',
    text: 'bg-transparent text-[#111827] shadow-none hover:bg-gray-200',
  }

  return `${base} ${variants[props.variant]}`
})
</script>

<template>
  <v-btn
    :class="buttonClasses"
    :disabled="props.disabled"
    :loading="props.loading"
    @click="handleClick"
  >
    {{ props.label }}
  </v-btn>
</template>