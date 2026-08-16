<script setup lang="ts">
import { computed } from 'vue';


const props = defineProps<{
  label: string
  values: string | string[]
}>()
const values = computed(()=>{
  return Array.isArray(props.values)? props.values : [props.values];
})
</script>

<template>
  <div class="min-w-full flex py-3 px-4 justify-between bg-white shadow-lg my-3 rounded-2xl">
    <span class="text-gray-500">
      {{ props.label }}
    </span>
    <div class="flex gap-1.5 items-center">
      <span v-for="(valor, index) in values" :key="index">
        {{ valor }}
      </span>
    </div>
  </div>
</template>

<style scoped>

</style>