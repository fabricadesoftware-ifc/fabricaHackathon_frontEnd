<template>
  <Button.Root
    class="flex items-center rounded-xl px-4 py-1.5 text-[14px]"
    :class="!props.disabled ? props.variant == 'voltar' ? 'bg-white text-[#4B5563] hover:bg-gray-100 gap-3' : 'bg-[#3B82F6] text-[white] hover:bg-[#2563EB] gap-2' : 'bg-[#b7b8b9] text-[white] cursor-auto'"
    :disabled="props.disabled"
    :loading="props.loading"
    @click="handleClick"
  >
    <Button.Icon
      v-if="props.variant === 'voltar' && !props.loading"
      class="text-[20px]"
    >
      <span class="mdi mdi-arrow-left" />
    </Button.Icon>

    <Button.Content v-if="!props.loading">
      {{ props.label }}
    </Button.Content>

    <Button.Icon
      v-if="props.variant === 'ir' && !props.loading"
      class="text-[20px]"
    >
      <span class="mdi mdi-arrow-right" />
    </Button.Icon>

    <Button.Loading v-if="props.loading">
      <span class="mdi mdi-loading animate-spin text-lg" />
    </Button.Loading>
  </Button.Root>
</template>

<script setup lang="ts">
  import { Button } from '@vuetify/v0'

  interface Props {
    variant: 'voltar' | 'ir'
    label: string
    disabled?: boolean
    loading?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    disabled: false,
    loading: false,
  })

  const emit = defineEmits<{
    (e: 'click'): void
  }>()

  function handleClick () {
    if (props.disabled || props.loading) return

    emit('click')
  }
</script>
