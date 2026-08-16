<script setup lang="ts">
import AppButton from '../AppButton/AppButton.vue'; 
const props = defineProps<{
    title: string
    description: string
    buttonLabel: string 
}>()

const emits = defineEmits<{
    (e: 'click'): void;
}>()
</script>

 <template>
    <div class="px-3 py-2">
        <div class="min-w-full flex justify-center items-center">
        <span class="w-20 h-20 text-[2.5rem] bg-blue-400 rounded-full text-white flex justify-center items-center mdi mdi-check ">
        </span>     
        </div>
        <h1 class="text-[1.5rem] mb-5 text-gray-900 text-center">
            {{ props.title }}
        </h1>
        <p class="text-[1.1rem] mb-5 max-w-[30vw] text-gray-600 text-center">
            {{ props.description }}
        </p>
        <div class="min-w-full justify-center flex">
            <AppButton variant="primary" :label="buttonLabel" @click="emits('click')"></AppButton>
        </div>

    </div>
 </template>