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
    perfil: 'text-[#111827]',
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
 <div class="p-5 gap-2 flex items-start  w-m sm:max-w-[20vw] rounded-xl">
  <div class="rounded-full p-1 px-2 bg-[#F3F4F6] flex justify-center items-center shadow-lg mr-2">
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