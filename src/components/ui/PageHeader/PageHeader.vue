<template>
    <div class="flex flex-col gap-1 my-4">
        <p class="text-gray-900 md:text-2xl">{{ title }}</p>
        <p class="text-gray-600 md:text-base">{{ subtitle }}</p>
    </div>
</template>

<script setup lang="ts">
    defineProps<{
        title: string
        subtitle: string
    }>()
</script>
