<script setup lang="ts">
const props = defineProps<{
    title: string
    subtitle: string
}>()
</script>

<template>
  <div class="p-2 ">
    <h1 class="text-[2rem] text-center my-5 text-black">
        {{ props.title }}
    </h1>
    <h2 class="text-[1.5rem] text-center mb-2 text-[#565F6D] ">
        {{ props.subtitle }}
    </h2>    
  </div>
</template>

<style scoped>

</style>