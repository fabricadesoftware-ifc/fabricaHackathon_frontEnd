<template>
    <div class="flex flex-row justify-between">
        <p class="text-gray-500 text-xs md:text-sm">{{ total }} hackathons encontrado(s)</p>
        <p class="text-gray-500 text-xs md:text-sm">mostrando {{ start }}-{{ end }} de {{ total }}</p>
    </div>
</template>

<script setup lang="ts">
    defineProps<{
    total: number
    start: number
    end: number
    }>()
</script>