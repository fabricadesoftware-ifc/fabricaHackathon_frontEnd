<!--
Sim é a mesma coisa do SelectTipo, mas é que ele
é praticamente universal e usável pra qualquer select
-->
<template>
  <Select.Root v-model="model">
    <Select.Activator
      class="border-0 flex items-center gap-7 text-left rounded-xl bg-white px-6 py-2 text-[1.5rem] text-black transition-colors hover:bg-[#e8e8e8] data-[open=true]:border-blue-600"
    >
      <Select.Value
        class="block truncate whitespace-nowrap"
        :style="{
          maxWidth: props.maxWidth ? `${String(props.maxWidth)}rem` : '',
          width: props.width ? String(props.width)+'rem' : ''}"
      >
        {{ selectedOption?.label }}
      </Select.Value>

      <Select.Placeholder
        class="block whitespace-nowrap text-black"
        :style="{
          maxWidth: props.maxWidth ? String(props.maxWidth)+'rem' : '',
          width: props.width ? String(props.width)+'rem' : ''}"
      >
        {{ props.placeholder }}
      </Select.Placeholder>

      <Select.Cue class="leading-0 text-black transition-transform data-[state=open]:rotate-180">
        <span class="mdi mdi-chevron-down text-[2.2rem]" />
      </Select.Cue>
    </Select.Activator>

    <Select.Content
      class="z-10 min-w-32 overflow-hidden rounded-lg bg-white py-1 shadow-lg"
      :side-offset="0"
    >
      <Select.Item
        v-for="option in props.options"
        :id="option.value"
        :key="option.value"
        class="px-3 cursor-pointer py-2 text-[1.8rem] text-gray-700 hover:bg-gray-100 data-[selected=true]:bg-blue-50 data-[selected=true]:font-medium data-[selected=true]:text-blue-600"
        :value="option.value"
      >
        {{ option.label }}
      </Select.Item>
    </Select.Content>
  </Select.Root>
</template>

<script setup lang="ts">
  import { Select } from '@vuetify/v0'
  import { computed } from 'vue'

  export interface SelectOption {
    label: string
    value: string
  }

  const props = defineProps<{
    options: SelectOption[]
    modelValue: string | null
    placeholder?: string
    // Caso queira definir uma largura máxima pro select crescer passe a props maxWidth
    maxWidth?: number | string
    // Caso queira definir uma largura fixa pro select passe a props width
    width?: number | string
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string | null): void
  }>()

  const selectedOption = computed(() => {
    return props.options.find(option => option.value === props.modelValue)
  })

  const model = computed<string | undefined>({
    get: () => props.modelValue ?? undefined,
    set: value => emit('update:modelValue', value ?? null),
  })
</script>
