<template>
  <div class="text-[16px] flex gap-3.5 bg-[#F3F4F6] w-fit h-min items-center rounded-full px-7">
    <span class="mdi mdi-calendar text-[30px]" />

    <div class="flex gap-3">
      <span>{{ props.startDate }}</span>
      <span>{{ '-' }}</span>
      <span>{{ props.endDate }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
  const props = defineProps<{
    startDate: string
    endDate: string
  }>()
</script>
