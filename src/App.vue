<script lang="ts" setup>
import { ref, computed } from 'vue';
import EventCard from './components/ui/eventCard.vue';
import StatusProject from './components/ui/statusProject.vue';
import ProjectCard from './components/ui/projectCard.vue';
import AppButton from './components/ui/AppButton/index.ts';
import HeaderActions from './components/ui/HeaderActions/index.ts';
import SearchBar from './components/ui/SearchBar'
import { Sidebar } from './components/ui/Sidebar'
import PageHeader from './components/ui/PageHeader/PageHeader.vue';
import { o } from 'node_modules/@vuetify/v0/dist/index-vcUKp9YE.d.mts';
import UnsavedChangesBar from './components/layout/UnsavedChangesBar/UnsavedChangesBar.vue';
const activeItem = ref('home')
const isLoggedIn = ref(true)
const search = ref('')
const initialData = ref({ name: 'João' })
const formData = ref({ ...initialData.value })
const hasUnsavedChanges = computed(() => {
  return JSON.stringify(formData.value) !== JSON.stringify(initialData.value)
})
function handleCancel() {
  formData.value = { ...initialData.value }
}
function handleSave() {
  initialData.value = { ...formData.value }
}
</script>
<template>

  <div class="flex">
    <Sidebar v-model:active-item="activeItem" :is-logged-in="isLoggedIn" />

    <main class="flex-1 flex-row">
      <div>
        <form @submit.prevent="handleSave">
          <input v-model="formData.name" placeholder="Nome" />
        </form>

        <UnsavedChangesBar :has-changes="hasUnsavedChanges" @cancel="handleCancel" @save="handleSave" />
      </div>
    </main>
  </div>
</template>
<style></style>
