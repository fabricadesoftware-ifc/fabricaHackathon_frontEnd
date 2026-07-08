<script setup lang="ts">
defineProps<{
    steps: string[]
    currentStep: 0 | 1 | 2 | 3 | 4
}>()
</script>

<template>
    <div class="p-5 bg-[#454545] pl-8 pr-8 w-[70vw] flex justify-evenly items-center">
        <template v-for="i in 4" :key="i">

            <div class="grid grid-cols-1 place-items-center">
                <div class="rounded-full mt-7 w-10 h-10 flex justify-center items-center"
                    :class="i - 1 <= currentStep ? 'bg-[#2B67EB] border-0' : 'bg-white border-[#9D9DA8] border-4'">
                    <span class="mdi mdi-check text-2xl" v-show="currentStep > i-1"></span>
                    <span v-show="currentStep == i-1">{{ i }}</span>
                </div>
                <span class="mt-1 text-[1.1rem]" :class="currentStep >= i-1? 'text-[#2B67EB]' : 'text-[#9D9DA8]'">
                    {{ steps[i-1] }}
                </span>

            </div>
            <div class="w-70 h-1.5" :class="currentStep > i - 1 ? 'bg-[#2B67EB]' : 'bg-[#9D9DA8]'" v-show="i !== 4">
            </div>
        </template>
    </div>
</template>

<style scoped></style>