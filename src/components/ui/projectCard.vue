<template>
    <div class="rounded-md bg-white shadow-md p-4 flex flex-col gap-3 w-full">

        <div class="flex items-start justify-between">
            <div class="w-12 h-12 rounded-full border border-gray-200 overflow-hidden flex items-center justify-center">
                <img  :alt="title" class="" :src="logo"  />
            </div>

            <statusProject :label="statusLabel" :status="status"  />
        </div>

        <h2 class="font-semibold text-base text-gray-900">{{ title }}</h2>

        <p class="text-sm text-gray-500">{{ description }}</p>

        <p class="text-sm text-gray-500">
            Equipe: <span class="font-medium text-gray-900">{{ team }}</span>
        </p>

        <div class="flex items-center gap-2 text-sm text-blue-600 font-medium">
            <span class="mdi mdi-trophy-outline text-lg"></span>
            <span>{{ event }}</span>
        </div>

        <button class="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-1 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 w-fit">
            <span class="mdi mdi-pencil-outline text-base"></span>
            Editar
        </button>

    </div>
</template>

<script setup lang="ts">
import statusProject from './statusProject.vue';

type Status = 'finalizado' | 'ativo'

defineProps<{
    logo: string
    status: Status
    statusLabel: string
    title: string
    description: string
    team: string
    event: string
}>()
</script>