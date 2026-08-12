<template>
  <div
    class="flex flex-col w-full max-w-xl mx-auto py-6 px-4 border border-gray-200 bg-white shadow rounded-xl"
  >
    <div class="flex flex-col text-center mb-4">
      <span class="whitespace-nowrap font-semibold text-gray-900 mb-4">
        HackIFC <span class="text-blue-600">// 24H</span>
      </span>
      <span class="whitespace-normal font-normal text-gray-900 text-2xl">Seja bem-vindo de volta</span>
      <span class="whitespace-normal font-normal text-gray-600">Gerencie seus projetos e participe de hackathons</span>
      
      <div class="text-start">
        <label for="email" class="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">Email</label>
        <input id="email" name="email" type="email" placeholder="Insira seu email para continuar" class="text-sm sm:text-base relative w-full border border-gray-300 rounded-lg placeholder-gray-400 focus:border-blue-500 focus:outline-none py-2 pl-1.5">
      </div>
      <div class="text-start">
        <label for="password" class="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">Senha</label>
        <input id="password" name="password" type="password" placeholder="Insira sua senha para continuar" class="text-sm sm:text-base relative w-full border border-gray-300 rounded-lg placeholder-gray-400 focus:border-blue-500 focus:outline-none py-2 pl-1.5">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// defineProps<{
//   title: string;
//   subtitle: string;
// }>();
</script>
