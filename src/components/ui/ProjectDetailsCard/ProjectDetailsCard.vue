<template>
    <div class="container mx-auto px-5 py-4">
        <div class="flex flex-col">
            <span class="text-xl text-gray-900">Sua equipe</span>
            <span class="text-base text-gray-600">Esses dados aparecem para os avaliadores durante o julgamento.</span>
        </div>
        <div class="flex flex-col mt-4">
            <LogoUpload
            modelValue="File"/>
        </div>
        <div class="flex flex-col">
            
        </div>
    </div>
</template>

<script setup lang="ts">
import LogoUpload from '../LogoUpload/index';


</script>
