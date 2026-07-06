<script lang="ts" setup>
  import ProgressStepper from './components/ui/progressStepper.vue';
</script>

<template>

  <div>
    <ProgressStepper :steps="['Inscrições', 'Andamento', 'Avaliação', 'Finalizado']" :currentStep="4">
    </ProgressStepper>
  </div>
  
</template>

  <style>

  </style>
