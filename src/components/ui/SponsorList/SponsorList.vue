<script setup lang="ts">
import SponsorLogo from '../SponsorLogo/SponsorLogo.vue';
type ImageInfo = {
    imageUrl: string
    name: string
    href?: string
};

const props = defineProps<{
    images: ImageInfo[]
}>()
</script>

<template>
  <div class="bg-white p-1">
    <ul class="flex flex-wrap gap-2 justify-evenly  items-center">
        <li v-for="image in props.images" :key="'key-' + image.name">
            <SponsorLogo 
            :name="image.name"
            :image-url="image.imageUrl"
            :href="image.href"
            ></SponsorLogo>
        </li>
    </ul>    
  </div>
</template>

<style scoped>

</style>