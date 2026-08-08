<script setup lang="ts">
const props = defineProps<{
    imageUrl: string
    href?: string
    name: string
    maxWidth?: number // Apenas para questões de manipular as imagens
    maxHeight?: number

}>()
</script>
<template>
    <div class=" w-fit bg-white p-1.5 flex justify-center items-center">
        <a :href="props.href" target="_blank" v-if="props.href">    
        <img class="min-w-[5vw]" :class="`max-w-${props.maxWidth} max-h-${props.maxHeight}`" :src="props.imageUrl" :alt="props.name">
        </a>
        <img v-else class="min-w-[5vw]" :class="`max-w-${props.maxWidth} max-h-${props.maxHeight}`" :src="props.imageUrl" :alt="props.name">
    </div>
</template>