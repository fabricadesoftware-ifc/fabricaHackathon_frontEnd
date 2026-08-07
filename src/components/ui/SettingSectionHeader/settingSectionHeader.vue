<script setup lang='ts'>
import { computed } from 'vue';

type varianteCor = 'perigo' | 'perfil'

const props = defineProps<{
    icon: string
    title: string
    subtitle: string
    variant: varianteCor
}>()

const variantes = {
    perigo: 'text-red-400',
    perfil: 'text-black'
}
const iconClass = computed(()=>{
    const base = 'text-[1.5rem]'
    return `${base} ${variantes[props.variant]} ${props.icon}`
})
const titleClass = computed(()=>{
    const base = 'mb-1 text-[1.3rem] font-semibold'
    return `${base} ${variantes[props.variant]}`
})
</script>
<template>
 <div class="bg-white p-5 gap-2 flex items-start justify-space-between w-m sm:max-w-[25vw] rounded-xl">
  <div class="rounded-full p-1 px-2 bg-gray-100 flex justify-center items-center shadow-lg mr-2">
    <span  :class="iconClass"></span>
  </div>  
  <div>
    <h1 :class="titleClass">
        {{ props.title }}
    </h1>
    <h2 class="text-[0.9rem] text-gray-400">
        {{ props.subtitle }}
    </h2>
  </div>
 </div>   
</template>