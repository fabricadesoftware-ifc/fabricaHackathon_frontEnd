<script setup lang='ts'>
  import { computed } from 'vue'

  type varianteCor = 'sair' | 'excluir'

  const props = defineProps<{
    icon: string
    title: string
    subtitle: string
    variant: varianteCor
  }>()
  const subTitleClass = computed(() => {
    const variantes = {
      sair: 'text-app-text-placeholder-neutral',
      excluir: 'text-app-danger-text-500',
    }
    const base = 'text-[0.9rem]'
    return `${base} ${variantes[props.variant]}`
  })
</script>
<template>
  <div class="p-5 gap-2 flex items-center w-m sm:max-w-[40vw] rounded-xl">
    <div class=" p-0.5 px-1.5 rounded-sm bg-app-danger-surface-100 flex justify-center items-center shadow-lg mr-2">
      <span class="p-1.5  text-[1.5rem] text-app-danger-text-500" :class="props.icon" />
    </div>

    <div>
      <h1 class="mb-0.5 text-[1.3rem] text-app-ink-strong-neutral">
        {{ props.title }}
      </h1>

      <h2 :class="subTitleClass">
        {{ props.subtitle }}
      </h2>
    </div>
  </div>
</template>
