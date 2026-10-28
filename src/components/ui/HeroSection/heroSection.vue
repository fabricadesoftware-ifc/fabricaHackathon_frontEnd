<script setup lang="ts">
import SearchBar from '../SearchBar/searchBar.vue'

defineProps<{
  title: string
  subtitle: string
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
  <section
    aria-labelledby="hero-title"
    class="relative isolate w-full overflow-hidden
           rounded-lg
           bg-gradient-to-r
           from-white via-[#F7FAFF] to-[#DFEDFF]
           px-5 py-8
           sm:px-8 sm:py-9
           lg:px-10"
  >
    <!-- Elementos decorativos do fundo -->
    <div
      class="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <!-- Forma principal -->
      <div
        class="absolute -right-32 -top-48
               h-[380px] w-[420px]
               rotate-45 rounded-[100px]
               bg-blue-200/35"
      />

      <!-- Forma secundária -->
      <div
        class="absolute -right-48 top-12
               h-[340px] w-[380px]
               rotate-45 rounded-[100px]
               bg-blue-300/20"
      />
    </div>

    <!-- Conteúdo -->
    <div class="relative z-10 max-w-3xl">

      <!-- Identificação -->
      <div class="mb-3 flex items-center gap-2">
        <span
          class="h-1.5 w-1.5 rounded-full bg-slate-400"
          aria-hidden="true"
        />

        <span
          class="text-[11px] font-semibold
                 uppercase tracking-[0.16em]
                 text-slate-400"
        >
          HackIFC // 24H
        </span>
      </div>

      <!-- Título -->
      <h1
        id="hero-title"
        class="text-[26px] font-bold
               leading-tight tracking-tight
               text-slate-900
               sm:text-[30px]
               lg:text-[34px]"
      >
        {{ title }}
      </h1>

      <!-- Descrição -->
      <p
        class="mt-2 max-w-2xl
               text-sm leading-6 text-slate-500
               sm:text-[15px]"
      >
        {{ subtitle }}
      </p>

      <!-- Busca -->
      <div class="mt-6 w-full max-w-[460px]">
        <SearchBar
          appearance="hero"
          placeholder="Buscar edições, projetos ou equipes..."
          :model-value="modelValue"
          @update:model-value="
            emit('update:modelValue', $event)
          "
        />
      </div>

    </div>
  </section>
</template>