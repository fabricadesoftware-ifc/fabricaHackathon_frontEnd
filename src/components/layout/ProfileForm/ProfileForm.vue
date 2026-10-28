<script setup lang="ts">
import type { FormValidationRule } from '@vuetify/v0'
import { Input } from '@vuetify/v0'
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  nome: string
  sobrenome: string
  disabled?: boolean
}>(), {
  disabled: false,
})

const emit = defineEmits<{
  (e: 'update:nome' | 'update:sobrenome', value: string): void
}>()

const nome = computed({
  get: () => props.nome,
  set: value => emit('update:nome', value),
})

const sobrenome = computed({
  get: () => props.sobrenome,
  set: value => emit('update:sobrenome', value),
})

const requiredRule: FormValidationRule[] = [
  value => (typeof value === 'string' && value.trim().length > 0) || 'Campo obrigatório',
]
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
    <label class="flex flex-col gap-1.5 text-sm font-medium text-slate-600">
      <span>Nome</span>
      <Input.Root v-model="nome" :rules="requiredRule" :disabled="disabled">
        <Input.Control
          autocomplete="given-name"
          class="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition-colors data-[focused]:border-blue-500 data-[state=invalid]:border-red-500 disabled:bg-slate-50"
        />
      </Input.Root>
    </label>

    <label class="flex flex-col gap-1.5 text-sm font-medium text-slate-600">
      <span>Sobrenome</span>
      <Input.Root v-model="sobrenome" :rules="requiredRule" :disabled="disabled">
        <Input.Control
          autocomplete="family-name"
          class="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition-colors data-[focused]:border-blue-500 data-[state=invalid]:border-red-500 disabled:bg-slate-50"
        />
      </Input.Root>
    </label>
  </div>
</template>
