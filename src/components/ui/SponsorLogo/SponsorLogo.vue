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
                class="max-w-[100px] max-h-[40px] object-contain"
                :src="props.imageUrl"
                :alt="props.name"
            >
        </a>

        <img
            v-else
            class="max-w-[100px] max-h-[40px] object-contain"
            :src="props.imageUrl"
            :alt="props.name"
        >
    </div>
</template>