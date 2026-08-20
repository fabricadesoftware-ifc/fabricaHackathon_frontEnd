<script setup lang="ts">
const props = defineProps<{
    email: string
    status: string
}>()
const emits = defineEmits<{
    remove: any
}>()
</script>

<template>
  <div class="bg-white flex justify-between lg:min-w-10 min-w-5 rounded-3xl lg:gap-5 gap-2 lg:px-4 px-2 items-center">
    <span class="lg:text-[1.1rem] text-[0.7rem] max-w-[50vw]">
    {{ props.email }}          
    </span>
    <span class="text-blue-400 lg:text-[1rem] text-[0.6rem]">
        {{ status }}
    </span>
    <button @click="emits('remove')" class="lg:text-[1.4rem]">
        <span class="mdi mdi-close"></span>
    </button>
</div>
</template>

<style scoped>

</style>