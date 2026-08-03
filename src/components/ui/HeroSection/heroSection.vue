<script setup lang="ts">
import { ref } from 'vue';
import heroTitle from '../HeroTitle/heroTitle.vue';
import searchBar from '../SearchBar/searchBar.vue';
const value = ref('');
</script>

<template>
  <div class="min-h-40 grid grid-cols-1 justify-items-center center bg-white py-10 min-w-full">
        <heroTitle title="Desenvolva, colabore e inove no HackIFC // 24H" subtitle="Desenvolva, colabore e inove no HackIFC // 24H"></heroTitle>
        <searchBar :model-value="value"></searchBar>
    
  </div>
</template>

<style scoped>

</style>