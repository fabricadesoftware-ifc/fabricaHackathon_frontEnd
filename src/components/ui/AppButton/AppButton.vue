<script setup lang="ts">
  import { computed } from 'vue'

  type Variant = 'primary' | 'text' | 'secondary'

  const props = defineProps<{
    variant: Variant
    label: string
    disabled?: boolean
    loading?: boolean
    icon?: string
    iconPosition?: string
  }>()

  const emit = defineEmits<{
    (e: 'click'): void
  }>()

  function handleClick () {
    if (props.disabled || props.loading) return
    emit('click')
  }

  const base
    = 'app-btn py-[22.5px] px-4.5 rounded-lg text-[16px] font-medium normal-case transition-all duration-150 ease-in-out'

  const buttonClasses = computed(() => {
    const variants: Record<Variant, string> = {
      primary: '!bg-[#2563EB] !text-white hover:!bg-[#2054C6]',
      text: '!bg-transparent !text-[#111827] !shadow-none hover:!bg-gray-200',
      secondary: '!bg-white !text-[#4B5563] hover:!bg-indigo-100',
    }

    return `${base} ${variants[props.variant]}`
  })
</script>

<template>
  <v-btn
    :aria-busy="props.loading || undefined"
    :class="buttonClasses"
    :disabled="props.disabled || props.loading || (!props.iconPosition && !!props.icon)"
    :loading="props.loading"
    :ripple="false"
    @click="handleClick"
  >
    <span v-if="props.iconPosition === 'left' || props.iconPosition === 'right'" class="inline-flex items-center justify-center gap-1.5">
      <span
        v-if="props.iconPosition === 'left'"
        class="text-[24px] leading-none font-light transform -translate-y-[1.5px] select-none"
      >{{ props.icon }}</span>

      <span class="leading-none">{{ props.label }}</span>

      <span
        v-if="props.iconPosition === 'right'"
        class="text-[24px] leading-none font-light transform -translate-y-[1.5px] select-none"
      >{{ props.icon }}</span>
    </span>

    <template v-else-if="props.iconPosition || !props.icon">{{ props.label }}</template>
  </v-btn>
</template>

<style scoped>
.app-btn :deep(.v-btn__overlay),
.app-btn :deep(.v-btn__underlay) {
  display: none;
}

.app-btn.v-btn--disabled {
  opacity: 0.5;
}
</style>
