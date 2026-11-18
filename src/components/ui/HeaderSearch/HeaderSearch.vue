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
    class="header-search group/search flex h-10 items-center overflow-hidden rounded-full border-[1px] border-transparent bg-app-surface transition-all duration-300 focus-within:w-23 focus-within:shrink-0 sm:focus-within:w-66 [&:hover:not(:focus-within)]:border-app-line-neutral [&:hover:not(:focus-within)]:shadow-app-soft focus-within:border-app-brand-accent focus-within:shadow-app-search-focus"
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
      class="header-search-input [&::-webkit-search-cancel-button]:hidden [width:0] min-w-0 flex-none bg-transparent p-0 text-sm text-app-text-strong-neutral outline-none placeholder:text-app-text-muted-neutral transition-all duration-300 group-hover/search:w-12 group-hover/search:pr-2 group-focus-within/search:w-12 group-focus-within/search:pr-2 sm:group-hover/search:w-56 sm:group-hover/search:pr-3 sm:group-focus-within/search:w-56 sm:group-focus-within/search:pr-3"
      placeholder="Pesquisar"
      type="search"
    >
  </form>
</template>
