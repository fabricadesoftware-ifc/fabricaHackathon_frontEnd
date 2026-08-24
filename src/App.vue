<script lang="ts" setup>
import { ref, computed } from "vue";
import AvatarUpload from "@/components/layout/AvatarUpload";
import AppHeader from "./components/layout/AppHeader/AppHeader.vue";
import EventDateRange from "./components/ui/EventDateRange/EventDateRange.vue";
import { Sidebar } from "./components/ui/Sidebar";
import LoginCard from "./components/layout/LoginCard/LoginCard.vue";
import AppButton from "./components/ui/AppButton/AppButton.vue";
import ProgressBar from "./components/ui/ProgressBar/ProgressBar.vue";
import EvaluationCriteriaCard from "./components/ui/EvaluationCriteriaCard/EvaluationCriteriaCard.vue";
import EvaluationProjectCard from "@/components/ui/EvaluationProjectCard/EvaluationProjectCard.vue";
import ProjectDetailsCard from "./components/ui/ProjectDetailsCard/ProjectDetailsCard.vue";

function salvar() {
  console.log("Salvou!");
}

const remover = (id: number) => {
  convidados.value = convidados.value.filter((c) => c.id !== id);       
};

const handleLogin = (dados: {
  email: string;
  password: string;
  rememberMe: boolean;
}) => {
  console.log("Login:", dados);
};

const handleGoogleLogin = () => {
  console.log("Login com Google");
};

const handleForgotPassword = () => {
  console.log("Esqueci minha senha");
};

const handleCreateAccount = () => {
  console.log("Criar conta");
};

const activeItem = ref("home");
const isLoggedIn = ref(true);
const file: File = {
  name: "",
  lastModified: 0,
  size: 0,
  type: "",
  webkitRelativePath: "",
};

const notaCriatividade = ref(7.0)
const comentarioCriatividade = ref('')
</script>
<template>
  <div class="flex">
    <Sidebar v-model:active-item="activeItem" :is-logged-in="isLoggedIn" />

    <main class="flex-1 flex-row bg-[#F9FAFB]">
      <AppHeader
        :is-logged="true"
        :notification-count="3"
        user-avatar="/avatar.png"
        user-name="Renan"
      />
      <div class="mx-10">
        <RouterView />
        <EvaluationProjectCard
          avatar="/avatar.png"
          name="Hackathon App"
          description="Sistema para gerenciamento de hackathons"
          teamName="Equipe Alpha"
          editionName="HackIFC 2026"
          projectUrl="github.com/equipe-alpha"
          status="Avaliado"
          :score="9.5"
        />  
        <ProjectDetailsCard
        />
      </div>
    </main>
  </div>
</template>
<style></style>