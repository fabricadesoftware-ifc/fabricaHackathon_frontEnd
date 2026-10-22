<template>
  <div class="flex items-center justify-between">
    <h2 class="text-base font-semibold text-gray-900">
      {{ title }}
    </h2>

    <component
      :is="linkTag"
      class="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
      :href="href"
      :to="to"
    >
      {{ linkText }}
      <span class="mdi mdi-arrow-right text-base" />
    </component>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  interface Props {
    title: string
    to?: string
    href?: string
    linkText?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    linkText: 'Ver todos',
  })

  const linkTag = computed(() => {
    if (props.to) return 'RouterLink'
    if (props.href) return 'a'
    return 'span'
  })
</script>
