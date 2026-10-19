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

const comment1 = ref("");
const comment2 = ref("");
const comment3 = ref("");

const tipo = ref("");
const status = ref("");
const ano = ref("");

const loading = ref(false);
const error = ref(false);

function extractYear(date: string): string {
  const parts = date.split("/");
  return parts.length === 3 ? parts[2] : "";
}

const hackaton = route.params.id;

const project = computed(() =>
  projects.find((p) => p.id === Number(route.params.id)),
);

async function fetchProjects() {
  loading.value = true;
  error.value = false;

  try {
    await new Promise((resolve) => setTimeout(resolve, 400));
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
    notas: {
      nota1: score1.value,
      nota2: score2.value,
      nota3: score3.value,
    },
    comentarios: {
      comentario1: comment1.value,
      comentario2: comment2.value,
      comentario3: comment3.value,
    },
    media: finalScore.value,
    userId: null, // coloquei aqui porque imagino que seja util para anexar a um usario no futuro
  };

  console.log(avaliacao);
  sucessState.value = true;
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
  <SucessState
    v-if="sucessState"
    :title="'Avaliação enviada!'"
    :description="`Sua nota para o projeto ${project.title} foi registrada. Faltam ${projects.length} projetos pendentes nessa edição.`"
    :buttonLabel="'Concluir'"
    @click="router.push('/avaliacao')"
    class="mt-[10%]"
  >
  </SucessState>
  <div v-else class="p-10">
    <EvaluationProjectCard
      v-if="project"
      :name="project.title"
      :description="project.description"
      :projectUrl="'https://google.com'"
      :editionName="project.event"
      :teamName="project.team"
      :avatar="project.logo"
      :status="project.status"
      :score="7.0"
    >
    </EvaluationProjectCard>
    <div>
      <h2 class="font-semibold text-2xl my-5">Critérios de avaliação</h2>
      <EvaluationCriteriaCard
        :criteriaName="'Criatividade'"
        v-model:comment="comment1"
        v-model="score1"
        class="my-5"
      ></EvaluationCriteriaCard>
      <EvaluationCriteriaCard
        :criteriaName="'Criatividade'"
        v-model:comment="comment2"
        v-model="score2"
        class="my-5"
      ></EvaluationCriteriaCard>
      <EvaluationCriteriaCard
        :criteriaName="'Criatividade'"
        v-model:comment="comment3"
        v-model="score3"
        class="my-5"
      ></EvaluationCriteriaCard>
      <FinalScoreBar
        :score="finalScore"
        :label="'Nota final (Média)'"
        class="my-5"
      ></FinalScoreBar>
    </div>

    <v-footer class="d-flex align-center justify-between mt-1 bg-white">
      <v-btn
  
        variant="tonal"
        color="primary"
        :href="`/avaliacao/${route.params.id}`"
        >Voltar sem avaliar</v-btn
      >
      <v-btn variant="elevated" color="primary" @click="salvaAvaliacao"
        >Enviar Avaliacao</v-btn
      >
    </v-footer>
  </div>
</template>
