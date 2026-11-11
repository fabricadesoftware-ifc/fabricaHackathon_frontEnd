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
    class="header-search flex h-10 items-center overflow-hidden rounded-full border-[1px] border-transparent bg-app-surface transition-all duration-300 [&:hover:not(:focus-within)]:border-app-line-neutral [&:hover:not(:focus-within)]:shadow-app-soft focus-within:border-app-brand-accent focus-within:shadow-app-search-focus [&:is(:hover,:focus-within)_input]:w-26 [&:is(:hover,:focus-within)_input]:pr-3 sm:[&:is(:hover,:focus-within)_input]:w-56"
    role="search"
    @submit.prevent="pesquisar"
  >
    <button
      aria-label="Pesquisar"
      class="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center text-app-link hover:text-app-link-hover"
      type="button"
      @click="aoClicarNaLupa"
    >
      <span class="mdi mdi-magnify header-search-icon text-[24px] text-app-brand-text" />
    </button>

    <input
      ref="input"
      v-model="termo"
      aria-label="Pesquisar projetos"
      class="header-search-input [&::-webkit-search-cancel-button]:hidden w-0 bg-transparent text-sm text-app-text-strong-neutral outline-none placeholder:text-app-text-muted-neutral transition-all duration-300 p-0 min-w-0"
      placeholder="Pesquisar"
      type="search"
    >
  </form>
</template>
