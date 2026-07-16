<template>
  <VSelect
    v-model="model"
    bg-color="white"
    class="select-tipo max-w-40 max-h-20"
    flat
    hide-details
    item-title="label"
    item-value="value"
    :items="props.options"
    menu-icon="mdi-chevron-down"
    persistent-placeholder
    :placeholder="props.placeholder"
    rounded="lg"
    variant="solo"
  />
</template>
<script setup lang="ts">
  import { computed } from 'vue'
  import { VSelect } from 'vuetify/components'

  type Model = string | null

  interface SelectOption {
    label: string
    value: string
  }

  const props = defineProps<{
    options: SelectOption[]
    modelValue: Model
    placeholder: string
  }>()

  const emits = defineEmits<{
    (e: 'update:modelValue', value: Model): void
  }>()

  const model = computed({
    get: () => props.modelValue,
    set: (value: Model) => emits('update:modelValue', value),
  })
</script>
<style scoped>
.v-field {
  background-color: white;
}

.select-tipo :deep(.v-field__input) {
  font-size: 20px;
  font-weight: 400;
  color: #111827;
}

.select-tipo :deep(.v-select__control) {

}

.select-tipo :deep(.v-select__selection) {
  display: none;
}

.select-tipo :deep(input) {
  text-align: center;
  align-items: center;
  font-size: 25px;
}

.select-tipo :deep(.v-field__append-inner) {
padding-right: 1.2vw;
}
</style>
