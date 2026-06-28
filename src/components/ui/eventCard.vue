<template>
    <div class="rounded-md bg-white shadow-md overflow-hidden w-72">
        <div class="relative m-2 ">
            <img :alt="title" class="w-full h-30 object-cover rounded-md " :src="image" />

            <div class="absolute top-3 left-3">
                <StatusBadge :label="statusLabel" :status="status" />
            </div>
        </div>

        <div class="p-4 flex flex-col gap-3">
            <h2 class="font-semibold text-base text-gray-900">{{ title }} · {{ location }}</h2>

            <div class="flex items-center gap-2 text-sm text-gray-500">
                <span class="mdi mdi-calendar-blank-outline text-xl"></span>
                <span>{{ startDate }} - {{ endDate }}</span>
            </div>

            <div class="flex items-center gap-4 text-sm text-gray-500">
                <div class="flex items-center gap-1">
                    <span class="mdi mdi-account-outline text-xl"></span>
                    <span>{{ teams }} equipes</span>
                </div>

                <div class="flex items-center gap-1">
                    <span class="mdi mdi-tag-outline text-xl "></span>

                    <span>{{ location }}</span>
                </div>
            </div>

            <div class="flex flex-wrap gap-2">
                <span v-for="tag in tags"
                    :key="tag"
                    class="px-3 py-1 rounded-full bg-gray-200 text-xs text-gray-600">
                    {{ tag }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
  import StatusBadge from "@/components/ui/statusSelect.vue";

  type Status = 'inscricoes' | 'avaliacao' | 'andamento' | 'finalizado'

  defineProps<{
    title: string
    image: string
    status: Status
    statusLabel: string
    startDate: string
    endDate: string
    teams: number
    location: string
    tags: string[]
  }>()
</script>
