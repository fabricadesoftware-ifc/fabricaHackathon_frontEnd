<template>
  <section class="flex flex-col gap-4">
    <SectionHeader
      :href="href"
      :link-text="linkText"
      :title="title"
      :to="to"
    />

    <slot />
  </section>
</template>

<script setup lang="ts">
  import { SectionHeader } from '@/components/layout/SectionHeader'

  interface Props {
    title: string
    to?: string
    href?: string
    linkText?: string
  }

  defineProps<Props>()
</script>
