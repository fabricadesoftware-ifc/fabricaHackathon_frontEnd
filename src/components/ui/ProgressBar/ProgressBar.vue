<template>
  <div>
    <div class="flex w-full h-2 bg-gray-200 rounded-full overflow-hidden" role="progressbar" :aria-valuenow="porcentagem" aria-valuemin="0" aria-valuemax="100">
      <div 
        class="flex flex-col justify-center rounded-full overflow-hidden bg-primary text-xs text-primary-foreground text-center whitespace-nowrap transition-all duration-700 " 
        :style="{ width: `${porcentagem}%` }">
      </div>
    </div>
    
    <div class="mt-2 flex justify-between items-center">
      <h3 class="text-sm font-normal text-[#4B5563] text-foreground">
        {{ props.current }}/{{ props.total }} {{ props.label }}
      </h3>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  current: number;
  total: number;
  label: string;
}>();

const porcentagem = computed(() => {
  if (props.total <= 0) return 0;
  
  const calculo = (props.current / props.total) * 100;
  
  return Math.min(Math.max(calculo, 0), 100);
});
</script>