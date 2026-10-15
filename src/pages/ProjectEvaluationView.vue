<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { hackathons } from "@/data/hackathons";
import EvaluationProjectCard from "@/components/ui/EvaluationProjectCard/EvaluationProjectCard.vue";
import EvaluationBadge from "@/components/ui/EvaluationBadge/EvaluationBadge.vue";
import { EvaluationCriteriaCard } from "@/components/ui/EvaluationCriteriaCard";
import { id } from "vuetify/locale";
import { projects } from "@/data/projects";
import { useRoute } from "vue-router";
type Status = "inscricoes" | "avaliacao" | "andamento" | "finalizado";

const STATUS_FILTER_CODES: Record<Status, string> = {
  inscricoes: "1",
  avaliacao: "2",
  andamento: "3",
  finalizado: "4",
};

const route = useRoute();

const tipo = ref("");
const status = ref("");
const ano = ref("");

const loading = ref(false);
const error = ref(false);

function extractYear(date: string): string {
  const parts = date.split("/");
  return parts.length === 3 ? parts[2] : "";
}

const project = computed(() =>
  projects.find((p) => p.id === Number(route.params.id)),
);

async function fetchProjects() {
  loading.value = true;
  error.value = false;

  try {
    await new Promise((resolve) => setTimeout(resolve, 400));
    projects.value = [...projects];
  } catch (err) {
    console.error("Erro ao carregar edições para avaliação:", err);
    error.value = true;
  } finally {
    loading.value = false;
  }
}

/* 
interface Project {
    id: number;
    logo: string;
    status: Status;
    statusLabel: string;
    title: string;
    description: string;
    team: string;
    event: string;
}
    
*/

onMounted(() => {
  fetchProjects();
});
</script>

<template>
  <EvaluationProjectCard v-if="project" :edition-name="project.title">
  </EvaluationProjectCard>
</template>
