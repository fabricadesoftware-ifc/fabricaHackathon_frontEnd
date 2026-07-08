<script lang="ts" setup>
  import ProgressStepper from './components/ui/progressStepper.vue';
</script>

<template>

  <div>
    <ProgressStepper :steps="['Inscrições', 'Andamento', 'Avaliação', 'Finalizado']" :currentStep="2">
    </ProgressStepper>
  </div>
  
</template>

  <style>

  </style>
