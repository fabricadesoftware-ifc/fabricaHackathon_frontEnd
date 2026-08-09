<script setup lang='ts'>
import { computed } from 'vue';

type varianteCor = 'sair' | 'excluir'

const props = defineProps<{
    icon: string
    title: string
    subtitle: string
    variant: varianteCor
}>()
const subTitleClass = computed(()=>{
    const variantes = {
        sair: 'text-gray-400',
        excluir: 'text-red-500',
    }
    const base = 'text-[0.9rem]'
    return `${base} ${variantes[props.variant]}`
})
</script>
<template>
 <div class="p-5 gap-2 flex items-center w-m sm:max-w-[40vw] rounded-xl">
  <div class=" p-0.5 px-1.5 rounded-sm bg-red-100 flex justify-center items-center shadow-lg mr-2">
    <span  class="p-1.5  text-[1.5rem] text-red-500" :class="props.icon"></span>
  </div>  
  <div>
    <h1 class="mb-0.5 text-[1.3rem] text-[#111827]">
        {{ props.title }}
    </h1>
    <h2 :class="subTitleClass">
        {{ props.subtitle }}
    </h2>
  </div>
 </div>   
</template>