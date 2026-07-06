<script setup lang="ts">
defineProps<{
    steps: string[]
    currentStep: 0 | 1 | 2 | 3 | 4
}>()
</script>

<template>
    <div class="p-5 bg-gray-600 pl-8 pr-8 w-[70vw] flex justify-evenly items-center">
        <template v-for="i in 4" :key="i">

            <div class="grid grid-cols-1 place-items-center">
                <div class="rounded-full mt-5 w-10 h-10  flex justify-center items-center"
                    :class="i - 1 <= currentStep ? 'bg-blue-700 border-0' : 'bg-white border-gray-400 border-4'">
                    <span class="mdi mdi-check text-2xl" v-show="currentStep > i-1"></span>
                    <span v-show="currentStep == i-1">{{ i }}</span>
                </div>
                <span class="mt-1 text-[1.1rem]" :class="currentStep >= i-1? 'text-blue-700' : 'text-gray-400'">
                    {{ steps[i-1] }}
                </span>

            </div>
            <div class="w-45 h-1.5" :class="currentStep > i - 1 ? 'bg-blue-700' : 'bg-gray-400'" v-show="i !== 4">
            </div>
        </template>
    </div>
</template>

<style scoped></style>