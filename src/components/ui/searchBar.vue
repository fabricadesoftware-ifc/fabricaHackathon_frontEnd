<script setup lang="ts">
import { ref } from 'vue';


const props = defineProps<{
  modelValue: string
  placeholder: string
  debounceMs?: number 
}>()
const debouncedTime = props.debounceMs || 300 
const inputModel = ref(props.modelValue);
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

const emit = defineEmits<{
  update: [modelValue: string]
  search: [query: string]
}>()

function addDebouncer(){
   if (debounceTimer) {
    clearTimeout(debounceTimer)
  }

  debounceTimer = setTimeout(() => {
   console.log(inputModel.value);
  }, debouncedTime)
}

</script>

<template>
  <div class="max-w-[50vw] flex justify-center items-center bg-gray-500">
    <label for="input">
      <div class="bg-[#F3F4F6] rounded-3xl m-5 min-w-[40vw] p-5 pt-0 pb-0 flex items-center">     
          <span class="mdi mdi-magnify text-gray-400 text-[1.8rem] mr-3"></span>
          <input type="text" id="input" v-model="inputModel" class="mt-1.5 mb-1.5 text-gray-400 w-full pl-1" @input="addDebouncer"  :placeholder="placeholder">
      </div>
    </label>
  </div>
</template>

<style scoped>

</style>