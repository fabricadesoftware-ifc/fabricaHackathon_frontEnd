<script setup lang="ts">
const props = defineProps<{
    imageUrl: string
    href?: string
    name: string
   
}>()
</script>
<template>
    <div class=" w-fit bg-white p-1.5 flex justify-center items-center">
        <a :href="props.href" target="_blank" v-if="props.href">    
        <img class="min-w-[5vw]"  :src="props.imageUrl" :alt="props.name">
        </a>
        <img v-else class="min-w-[5vw]"  :src="props.imageUrl" :alt="props.name">
    </div>
</template>