<script setup lang="ts">
defineProps<{
  steps: string[]
  currentStep: 0 | 1 | 2 | 3 | 4
}>()
</script>

<template>
  <div class="flex items-center justify-between w-full max-w-2xl px-4 py-2">
    <template v-for="i in 4" :key="i">
      <div class="flex flex-col items-center">
        <div 
          class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors"
          :class="i - 1 <= currentStep ? 'bg-[#2B67EB] text-white' : 'bg-white border-2 border-[#9D9DA8] text-[#9D9DA8]'"
        >
          <span v-if="currentStep > i - 1" class="mdi mdi-check text-base"></span>
          <span v-else>{{ i }}</span>
        </div>

        <span 
          class="mt-1 text-xs font-medium" 
          :class="currentStep >= i - 1 ? 'text-[#2B67EB]' : 'text-[#9D9DA8]'"
        >
          {{ steps[i - 1] }}
        </span>
      </div>

      <div 
        v-if="i !== 4" 
        class="flex-1 h-1 mx-2 rounded-full mb-5"
        :class="currentStep > i - 1 ? 'bg-[#2B67EB]' : 'bg-[#9D9DA8]'"
      ></div>
    </template>
  </div>
</template>