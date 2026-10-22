<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const termo = ref('')
const input = ref<HTMLInputElement | null>(null)

function pesquisar() {
  const q = termo.value.trim()
  void router.push({ path: '/explorar', query: q ? { q } : {} })
  input.value?.blur()
}

// Com o campo vazio, o clique na lupa só abre o campo (útil no celular, sem hover).
function aoClicarNaLupa() {
  if (termo.value.trim()) pesquisar()
  else input.value?.focus()
}
</script>

<template>
  <form
    class="header-search flex h-10 items-center overflow-hidden rounded-full border border-transparent bg-white transition-all duration-300 "
    role="search"
    @submit.prevent="pesquisar"
  >
    <button
      aria-label="Pesquisar"
      class="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center text-blue-600 hover:text-blue-700"
      type="button"
      @click="aoClicarNaLupa"
    >
      <span class="mdi mdi-magnify header-search-icon text-[24px]" />
    </button>

    <input
      ref="input"
      v-model="termo"
      aria-label="Pesquisar projetos"
      class="header-search-input w-0 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-500 transition-all duration-300"
      placeholder="Pesquisar"
      type="search"
    >
  </form>
</template>

<style scoped>
.header-search { border-color: transparent; }
.header-search-icon { color: #2563eb; }
.header-search-input { width: 0; padding: 0; min-width: 0; }

/* A caixa abre com hover (mouse) ou foco (teclado e toque). */
.header-search:hover,
.header-search:focus-within {
  border-color: #e5e7eb;
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.06);
}
.header-search:focus-within {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px #dbeafe;
}
.header-search:hover .header-search-input,
.header-search:focus-within .header-search-input {
  width: 6.5rem;
  padding-right: 0.75rem;
}
@media (min-width: 640px) {
  .header-search:hover .header-search-input,
  .header-search:focus-within .header-search-input { width: 14rem; }
}
.header-search-input::-webkit-search-cancel-button { display: none; }
</style>
