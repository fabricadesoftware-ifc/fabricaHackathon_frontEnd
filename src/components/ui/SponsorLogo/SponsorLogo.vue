<script setup lang="ts">
  const props = defineProps<{
    imageUrl: string
    href?: string
    name: string

  }>()
</script>
<template>
  <div class="w-fit p-1.5 flex justify-center items-center">
    <a v-if="props.href" :href="props.href" target="_blank">
      <img
        :alt="props.name"
        class="max-w-[100px] max-h-[40px] object-contain"
        :src="props.imageUrl"
      >
    </a>

    <img
      v-else
      :alt="props.name"
      class="max-w-[100px] max-h-[40px] object-contain"
      :src="props.imageUrl"
    >
  </div>
</template>
