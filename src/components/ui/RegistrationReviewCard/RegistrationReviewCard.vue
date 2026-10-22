<template>
  <div
    class="w-full max-w-3xl mx-auto my-4 p-5 sm:my-8 sm:p-9 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col gap-6"
  >
    <!-- Cabeçalho -->
    <div class="flex flex-col gap-1">
      <h2 class="text-xl font-semibold text-gray-900">{{ title }}</h2>
      <p class="text-sm text-gray-600">{{ subtitle }}</p>
    </div>

    <!-- Informações -->
    <div
      class="border border-dashed border-slate-300 rounded-lg p-4 sm:p-6 flex flex-col divide-y divide-slate-100"
    >
      <summaryRow label="Edição" :values="edition" />
      <summaryRow label="Nome da equipe" :values="teamName" />
      <summaryRow label="Participantes" :values="participants" />
      <summaryRow v-if="projectName" label="Nome do projeto" :values="projectName" />
      <summaryRow v-if="theme" label="Tema" :values="theme" />
      <summaryRow v-if="deployUrl" label="Link do Deploy" :values="deployUrl" />
    </div>

    <div class="flex flex-wrap items-center justify-between gap-3 pt-2">
      <AppButton variant="secondary" label="Voltar" icon="←" icon-position="left" @click="emit('back')" />
      <AppButton variant="primary" label="Confirmar Inscrição"  @click="emit('confirm')" />
    </div>
  </div>
</template>
<script setup lang="ts">
import AppButton from "../AppButton/index";
import summaryRow from "../SummaryRow/index";

const props = withDefaults(
  defineProps<{
    title?: string;
    subtitle?: string;
    edition: string;
    teamName: string;
    participants: string[];
    projectName?: string;
    theme?: string;
    deployUrl?: string;
  }>(),
  {
    title: "Revisão",
    subtitle: "Revise as informações da sua equipe. O projeto pode ser preenchido depois, em Meus projetos.",
  },
);

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'confirm'): void
}>()

function handleBack(e: Event){
    emit('back', )
}

function handleConfirmarInscricao(e: Event){
    emit('confirm')
}
</script>
