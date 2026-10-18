<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import EvaluationProjectCard from "@/components/ui/EvaluationProjectCard/EvaluationProjectCard.vue";
import { EvaluationCriteriaCard } from "@/components/ui/EvaluationCriteriaCard";
import EvaluationBadge from "@/components/ui/EvaluationBadge";
import { projects } from "@/data/projects";
import FinalScoreBar from "@/components/ui/FinalScoreBar";
import { useRoute } from "vue-router";
import SucessState from "@/components/ui/SucessState/sucessState.vue";
import { hackathons } from "@/data/hackathons";
import router from "@/router";
type Status = "inscricoes" | "avaliacao" | "andamento" | "finalizado";

const STATUS_FILTER_CODES: Record<Status, string> = {
  inscricoes: "1",
  avaliacao: "2",
  andamento: "3",
  finalizado: "4",
};
const sucessState = ref(false);
const route = useRoute();
const score1 = ref(7);
const score2 = ref(7);
const score3 = ref(7);
const finalScore = computed(
  () => (score1.value + score2.value + score3.value) / 3,
);

const tipo = ref("");
const status = ref("");
const ano = ref("");

const loading = ref(false);
const error = ref(false);

function extractYear(date: string): string {
  const parts = date.split("/");
  return parts.length === 3 ? parts[2] : "";
}

const hackaton = (route.params.id)

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

function salvaAvaliacao() {
  const avaliacao = {
    projetoId: Number(route.params.id),
    notas: [score1.value, score2.value, score3.value],
    media: finalScore.value,
  }

  console.log(avaliacao)
  sucessState.value = true
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
  <SucessState v-if="sucessState"
  :title="'Avaliação enviada!'"
  :description="'Sua avaliação foi registrada com sucesso.'"
  :buttonLabel="'Concluir'" @click="router.push('/avaliacoes')" ></SucessState>
  <div v-else>
    <EvaluationProjectCard
      v-if="project"
      :name="project.title"
      :description="project.description"
      :projectUrl="'https://google.com'"
      :editionName="project.event"
      :teamName="project.team"
      :alt="project.title"
      :src="project.logo"
      :status="project.status"
      :score="project.score"
    >
    </EvaluationProjectCard>
    <EvaluationCriteriaCard
      :criteriaName="'Criatividade'"
      v-model="score1"
    ></EvaluationCriteriaCard>
    <EvaluationCriteriaCard
      :criteriaName="'Criatividade'"
      v-model="score2"
    ></EvaluationCriteriaCard>
    <EvaluationCriteriaCard
      :criteriaName="'Criatividade'"
      v-model="score3"
    ></EvaluationCriteriaCard>
    <FinalScoreBar :score="finalScore" :label="'Nota final (Média)'"></FinalScoreBar>
  <v-footer class="d-flex align-center justify-between ga-2 py-3 bg-white" >
    <v-btn variant='tonal' color="primary" :href="`/avaliacao/${route.params.id}`">Voltar sem avaliar</v-btn>
    <v-btn variant="elevated" color="primary" @click="salvaAvaliacao">Enviar Avaliacao</v-btn>
  </v-footer>
  </div>
</template>
