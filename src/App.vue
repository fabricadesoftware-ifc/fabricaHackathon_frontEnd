<script lang="ts" setup>
import SponsorLogo from './components/ui/SponsorLogo/SponsorLogo.vue';
import SponsorList from './components/ui/SponsorList/SponsorList.vue';

const arr:any = [{
  name: "logo-vue", 
  imageUrl: "images/hackifc.png",
   href: "https://pictogrammers.com/docs/library/mdi/getting-started/webfont/"
},{
  name: "logo-vue", 
  imageUrl: "images/hackifc.png",
   href: "https://pictogrammers.com/docs/library/mdi/getting-started/webfont/"
},
{
  name: "logo-vue", 
  imageUrl: "images/hackifc.png",
  
}
];
</script>
<template>

  <div class="flex">
    <main class="flex-1 flex-row">
      <SponsorLogo name="logo-vue" image-url="/0.png" href="https://pictogrammers.com/docs/library/mdi/getting-started/webfont/" :max-width="2"></SponsorLogo>
      <SponsorList
      :images="arr"
      ></SponsorList>
  </main>
  </div>
</template>
<style></style>
