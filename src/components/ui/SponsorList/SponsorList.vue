<script setup lang="ts">
  import SponsorLogo from '../SponsorLogo/SponsorLogo.vue'
  type ImageInfo = {
    imageUrl: string
    name: string
    href?: string
  }

  const props = defineProps<{
    images: ImageInfo[]
  }>()
</script>

<template>
  <div class="p-1">
    <ul class="flex flex-wrap gap-10 items-center">
      <li v-for="image in props.images" :key="'key-' + image.name">
        <SponsorLogo
          :href="image.href"
          :image-url="image.imageUrl"
          :name="image.name"
        />
      </li>
    </ul>
  </div>
</template>
