<template>
  <div class="text-[16px] flex gap-3.5 bg-[#F3F4F6] w-fit h-min items-center rounded-full px-7">
    <span class="mdi mdi-calendar text-[25px] text-[#111827] " />

    <div class="flex gap-3">
      <span>{{ formatDate(props.startDate) }}</span>
      <span>{{ '-' }}</span>
      <span>{{ formatDate(props.endDate) }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
  const props = defineProps<{
    startDate: string
    endDate: string
  }>()

  function formatDate (date: string) {
    if (date.includes(' de ')) {
      return date
    }

    const [day, month] = date.split('/')

    const monthName = new Intl.DateTimeFormat('pt-BR', {
      month: 'long',
    }).format(new Date(2000, Number(month) - 1, 1))

    return `${Number(day)} de ${monthName}`
  }

</script>
