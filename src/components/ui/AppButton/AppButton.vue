<script setup lang="ts">
  import { computed } from 'vue'

  type Variant = 'primary' | 'text'

  const props = defineProps<{
    variant: Variant
    label: string
    disabled?: boolean
  }>()

  const emit = defineEmits<{
    (e: 'click'): void
  }>()

  function handleClick () {
    emit('click')
  }

  const base = 'py-5 xl:py-8 px-5 xl:px-9 rounded-md text-[20px] xl:text-[30px] font-normal normal-case transition-all duration-150 ease-in-out'

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
    @click="handleClick"
  >
    {{ props.label }}
  </v-btn>
</template>
