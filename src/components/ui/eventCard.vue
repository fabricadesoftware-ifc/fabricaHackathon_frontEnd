<template>
    <RouterLink class="rounded-md bg-white shadow-md overflow-hidden w-full hover:-translate-y-1.5 transition-all duration-300" :to="{name: 'edicoes',params: {id: props.id}}">
        <div class="relative m-2 ">
            <img :alt="props.title" class="w-full h-30 object-cover rounded-md " :src="props.image" />

            <div class="absolute top-3 left-3">
                <StatusBadge :label="props.statusLabel" :status="props.status" />
            </div>
        </div>

        <div class="p-4 flex flex-col gap-3">
            <h2 class="font-semibold text-base text-gray-900">{{ props.title }} · {{ props.location }}</h2>

            <div class="flex items-center gap-2 text-sm text-gray-500">
                <span class="mdi mdi-calendar-blank-outline text-xl"></span>
                <span>{{ props.startDate }} - {{ props.endDate }}</span>
            </div>

            <div class="flex items-center gap-4 text-sm text-gray-500">
                <div class="flex items-center gap-1">
                    <span class="mdi mdi-account-outline text-xl"></span>
                    <span>{{ props.teamsCounter }} equipes</span>
                </div>

                <div class="flex items-center gap-1">
                    <span class="mdi mdi-tag-outline text-xl "></span>

                    <span>{{ props.location }}</span>
                </div>
            </div>

            <div class="flex flex-wrap gap-2">
                <span v-for="tag in props.tags"
                    :key="tag"
                    class="px-3 py-1 rounded-full bg-gray-200 text-xs text-gray-600">
                    {{ tag }}
                </span>
            </div>
        </div>
    </RouterLink>
</template>

<script setup lang="ts">
  import { RouterLink } from 'vue-router'
  import StatusBadge from '@/components/ui/statusSelect.vue'

  type Status = 'inscricoes' | 'avaliacao' | 'andamento' | 'finalizado'

  const props = defineProps<{
    id: number
    title: string
    image: string
    status: Status
    statusLabel: string
    startDate: string
    endDate: string
    teamsCounter: number
    location: string
    tags: string[]
  }>()
</script>
