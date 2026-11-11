<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const termo = ref('')
  const input = ref<HTMLInputElement | null>(null)

  function pesquisar () {
    const q = termo.value.trim()
    void router.push({ path: '/explorar', query: q ? { q } : {} })
    input.value?.blur()
  }

  // Com o campo vazio, o clique na lupa só abre o campo (útil no celular, sem hover).
  function aoClicarNaLupa () {
    if (termo.value.trim()) pesquisar()
    else input.value?.focus()
  }
</script>

<template>
  <form
    class="header-search flex h-10 items-center overflow-hidden rounded-full border-[1px] border-transparent bg-white transition-all duration-300 [&:hover:not(:focus-within)]:border-[#e5e7eb] [&:hover:not(:focus-within)]:shadow-[0_1px_2px_rgb(0_0_0/0.06)] focus-within:border-[#2563eb] focus-within:shadow-[0_0_0_3px_#dbeafe] [&:is(:hover,:focus-within)_input]:w-26 [&:is(:hover,:focus-within)_input]:pr-3 sm:[&:is(:hover,:focus-within)_input]:w-56"
    role="search"
    @submit.prevent="pesquisar"
  >
    <button
      aria-label="Pesquisar"
      class="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center text-blue-600 hover:text-blue-700"
      type="button"
      @click="aoClicarNaLupa"
    >
      <span class="mdi mdi-magnify header-search-icon text-[24px] text-[#2563eb]" />
    </button>

    <input
      ref="input"
      v-model="termo"
      aria-label="Pesquisar projetos"
      class="header-search-input [&::-webkit-search-cancel-button]:hidden w-0 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-500 transition-all duration-300 p-0 min-w-0"
      placeholder="Pesquisar"
      type="search"
    >
  </form>
</template>
