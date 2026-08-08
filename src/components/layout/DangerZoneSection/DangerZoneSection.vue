<script setup lang=ts>
import settingSectionHeader from '@/components/ui/SettingSectionHeader/settingSectionHeader.vue';

</script>

<template>
  <div class="min-w-40 flex bg-white justify-between">
    <settingSectionHeader
    title='Zona de Perigo'
    subtitle="Ações que podem ser irreversíveis"
    variant="perigo"
    icon="mdi mdi-alert"
    >    
    </settingSectionHeader>    
    <slot>
    </slot>
    </div>
</template>

<style scoped>

</style>