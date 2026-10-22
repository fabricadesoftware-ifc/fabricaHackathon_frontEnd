<script setup lang="ts">
  const props = defineProps<{
    title?: string
    count?: number
  }>()
</script>
<template>
  <div class="flex items-baseline-last gap-4">
    <h2 class="text-[#111827] text-[22px]">{{ props.title }}</h2>
    <span v-if="count" class="text-[16px] bg-[#F2F2FE] text-[#646470] rounded-full px-[10px]">Total {{ props.count }}</span>
  </div>
</template>
