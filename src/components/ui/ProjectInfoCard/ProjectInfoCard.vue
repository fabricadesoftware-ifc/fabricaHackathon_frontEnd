<template>
  <div
    class="w-full max-w-3xl mx-auto p-6 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col gap-6"
  >
    <!-- Cabeçalho -->
    <div class="flex flex-col gap-1">
      <h2 class="text-xl font-semibold text-gray-900">{{ title }}</h2>
      <p class="text-sm text-gray-600">{{ subtitle }}</p>
    </div>

    <!-- Upload da Logo -->
    <div class="flex flex-col">
      <LogoUpload :model-value="logo" @update:model-value="handleLogoUpdate" />
    </div>

    <!-- Campos do Formulário -->
    <div class="flex flex-col gap-4">
      <!-- Nome da Equipe -->
      <div class="flex flex-col gap-1.5">
        <label for="team-name" class="text-sm font-medium text-gray-700"
          >Nome da equipe</label
        >
        <input
          id="team-name"
          type="text"
          :value="teamName"
          @input="handleTeamNameInput"
          placeholder="Ex: Alugaê"
          class="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
        />
      </div>

      <!-- Bio / Descrição -->
      <div class="flex flex-col gap-1.5">
        <label for="bio" class="text-sm font-medium text-gray-700">Bio</label>
        <div class="relative">
          <textarea
            id="bio"
            rows="4"
            v-model="localBio"
            :maxlength="maxBioLength"
            @input="handleBioInput"
            placeholder="Descreva seu projeto"
            class="w-full px-3.5 py-2.5 pb-7 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm resize-none"
          />
          <span
            class="absolute bottom-2.5 right-3 text-xs text-gray-400 select-none"
          >
            {{ localBio.length }}/{{ maxBioLength }}
          </span>
        </div>
      </div>

      <!-- Deploy -->
      <div class="flex flex-col gap-1.5">
        <label for="deploy-url" class="text-sm font-medium text-gray-700"
          >Deploy</label
        >
        <input
          id="deploy-url"
          type="text"
          :value="deployUrl"
          @input="handleDeployInput"
          placeholder="Ex: alugae.com.br"
          class="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
        />
        <p class="text-xs text-gray-500 mt-0.5">
          O link pode ser adicionado depois — mas precisa estar preenchido até o
          fim do evento para a avaliação.
        </p>
      </div>
    </div>

    <!-- Rodapé / Ações -->
    <div
      class="flex items-center justify-between pt-2 border-t border-gray-100 mt-2"
    >
      <AppButton
        variant="secondary"
        icon="←"
        icon-position="left"
        label="Voltar"
        @click="emit('back')"
      />
      <AppButton
        variant="primary"
        icon="→"
        icon-position="right"
        label="Revisar inscrição"
        @click="emit('review')"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import LogoUpload from "../LogoUpload/index";
import AppButton from "../AppButton/index";
import { ref, watch } from "vue";

const emit = defineEmits<{
  (e: "update:logo", value: File | null): void;
  (e: "update:teamName", value: string): void;
  (e: "update:bio", value: string): void;
  (e: "update:deployUrl", value: string): void;
  (e: "back"): void;
  (e: "review"): void;
}>();

const props = withDefaults(
  defineProps<{
    title: string;
    subtitle: string;
    logo?: File | string | null;
    teamName: string;
    bio: string;
    maxBioLength: number;
    deployUrl: string;
  }>(),
  {
    title: "Seu projeto",
    subtitle: "Esses dados servirão para seu projeto.",
    logo: null,
    teamName: "",
    bio: "",
    maxBioLength: 150,
    deployUrl: "",
  },
);

function handleLogoUpdate(val: File | null) {
  emit("update:logo", val);
}

function handleTeamNameInput(e: Event) {
  const target = e.target as HTMLInputElement;
  emit("update:teamName", target.value);
}


const localBio = ref(props.bio ?? "");
watch(
  () => props.bio,
  (newBio) => {
    localBio.value = newBio ?? "";
  },
);
function handleBioInput(e: Event) {
  const target = e.target as HTMLTextAreaElement;
  emit("update:bio", localBio.value);
}

function handleDeployInput(e: Event) {
  const target = e.target as HTMLInputElement;
  emit("update:deployUrl", target.value);
}
</script>
