<template>
  <div class="flex flex-col p-4 border border-gray-200 rounded-lg bg-white shadow-sm w-full gap-2 mb-2">
    <div class="flex justify-between items-center w-full">
      <h3 class="text-base font-semibold text-gray-800">{{ criteriaName }}</h3>
      
      <NumberStepper 
        :modelValue="modelValue"
        @update:modelValue="updateScore"
        :min="min"
        :max="max"
        :step="step"
      />
    </div>
    <div class="flex">
      <button 
        type="button"
        @click="toggleComment"
        class="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors focus:outline-none"
      >
        {{ isCommentVisible ? '- Esconder comentário' : '+ Adicionar comentário' }}
      </button>
    </div>
    <div v-if="isCommentVisible" class="flex flex-col mt-2">
      <textarea 
        :value="comment"
        @input="updateComment"
        class="w-full p-3 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
        placeholder="comentário (nota)"
        rows="3"
      ></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NumberStepper from '../NumberStepper/NumberStepper.vue' 

const props = withDefaults(defineProps<{
  criteriaName: string;
  modelValue: number;
  comment?: string;
  min?: number;
  max?: number;
  step?: number;
}>(), {
  comment: '',
  min: 0,
  max: 10,
  step: 0.5
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void;
  (e: 'update:comment', value: string): void;
}>()

const isCommentVisible = ref(false)

const toggleComment = () => {
  isCommentVisible.value = !isCommentVisible.value
}

const updateScore = (newValue: number) => {
  emit('update:modelValue', newValue)
}

const updateComment = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:comment', target.value)
}
</script>