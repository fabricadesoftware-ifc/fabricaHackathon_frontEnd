<template>
  <PageHeader
    title="Meus Projetos"
    subtitle="Acompanhe os projetos das edições"
  />
  <div>
    <SearchFilterBar />
    <ResultsBar
      :total="projects.length"
      :start="startIndex + 1"
      :end="endIndex"
    />

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-4">
      <projectCard v-for="p in paginatedProjects" :key="p.id" v-bind="p" />
    </div>

    <AppPagination v-model="currentPage" :length="totalPages" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import PageHeader from "@/components/ui/PageHeader/PageHeader.vue";
import ResultsBar from "@/components/ui/ResultsBar/ResultsBar.vue";
import SearchFilterBar from "@/components/ui/SearchFilterBar";
import projectCard from "@/components/ui/projectCard.vue"; // ajusta pro caminho real
import AppPagination from "@/components/layout/AppPagination/AppPagination.vue";
import { projects } from "@/data/projects";

// --- Paginação ---
const currentPage = ref(1);
const itemsPerPage = 8;

const totalPages = computed(() =>
  Math.max(1, Math.ceil(projects.length / itemsPerPage)),
);

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage);
const endIndex = computed(() =>
  Math.min(startIndex.value + itemsPerPage, projects.length),
);

const paginatedProjects = computed(() =>
  projects.slice(startIndex.value, endIndex.value),
);
</script>
