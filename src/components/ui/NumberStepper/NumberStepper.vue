<template>

  <div class="flex items-center gap-4">
    <div class="h-7 w-7">
      <button :class="buttonDesign" :style="{ visibility: ShowPlus ? 'visible' : 'hidden' }" @click="incrementar">
        <span class="mdi mdi-plus" />
      </button>
    </div>

    <p class="text-[22px] text-[#2563EB] w-11.25 text-center">{{ value.toFixed(1) }}</p>

    <div class="h-7 w-7">
      <button :class="buttonDesign" :style="{ visibility: ShowMinus ? 'visible' : 'hidden' }" @click="decrementar">
        <span class="mdi mdi-minus" />
      </button>
    </div>
  </div>

</template>
<script setup lang="ts">
  import { computed, ref } from 'vue'

  const buttonDesign = 'hover:bg-gray-100 rounded-md flex h-7 w-7 shrink-0 items-center justify-center border-[0.5px] border-solid border-[#CDCDCD] bg-white text-[18px] text-[#111827]'

  interface NumberStepper {
    modelValue?: number
    min?: number
    max?: number
    step?: number
  }
  const props = withDefaults(
    defineProps<NumberStepper>(),
    {
      modelValue: 0,
      min: 0,
      max: 10,
      step: 0.5,
    },
  )
  const emits = defineEmits<{
    (e: 'update:modelValue', value: number): void
  }>()
  const ShowPlus = computed(() => {
    if (value.value == props.max) {
      return false
    }
    return true
  })
  const ShowMinus = computed(() => {
    if (value.value == props.min) {
      return false
    }
    return true
  })

  const value = ref<number>(props.modelValue)

  function incrementar () {
    if (value.value + props.step >= props.max) {
      value.value = props.max
    } else {
      value.value += props.step
    }
    emits('update:modelValue', value.value)
  }
  function decrementar () {
    if (value.value - props.step <= props.min) {
      value.value = props.min
    } else {
      value.value -= props.step
    }
    emits('update:modelValue', value.value)
  }

</script>
