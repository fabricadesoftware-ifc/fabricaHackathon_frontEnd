<template>
  <v-card>
    <div class="m-20 bg-white flex flex-col gap-6 pt-5.5 px-11 pb-30 w-225 pr-25 rounded-md">
      <v-card-title class="text-[24px] text-[#111827]">
        {{ letraMaiscPrep(props.title) }}
      </v-card-title>

      <v-card-text class="text-[16px] text-[#4B5563]">
        {{ textoFormatado(props.description) }}
      </v-card-text>

      <v-card-title class="text-[20px] text-[#111827]">
        {{ letraMaiscPrep(props.criteriaLabel) }}
      </v-card-title>

      <div class="flex flex-wrap gap-4">
        <v-chip
          v-for="(item, index) in props.criteria"
          :key="index"
          class="text-[#4B5563] border-[#E5E7EB] border-[3px] py-1.5 px-4 rounded-[33px]"
        >
          {{ letraMaiscPrep(item) }}
        </v-chip>
      </div>
    </div>
  </v-card>
</template>
<script setup lang="ts">
  const props = defineProps<{
    title: string
    description: string
    criteriaLabel: string
    criteria: string[]
  }>()

  function letraMaiscPrep (title: string): string {
    const lowerWords = new Set([
      'a', 'as', 'o', 'os',
      'ante', 'após', 'até',
      'com', 'contra',
      'de', 'da', 'das', 'do', 'dos', 'desde',
      'em', 'no', 'na', 'nos', 'nas',
      'entre',
      'e', 'ou',
      'para', 'perante', 'por',
      'sem', 'sob', 'sobre', 'trás',
    ])

    return title
      .toLowerCase()
      .split(' ')
      .map((word, index) => {
        if (!word) return word

        return index === 0 || !lowerWords.has(word)
          ? word[0].toUpperCase() + word.slice(1)
          : word
      })
      .join(' ')
  }

  function letraMaiscPontoFinal (text: string): string {
    return text
      .trim()
      .replace(/\.\s*/g, '. ')
      .replace(/(^|\. )([a-zà-ú])/g, (_, before, letter) => before + letter.toUpperCase())
  }
  function espacoVirgula (text: string): string {
    return text
      .trim()
      .replace(/,\s*/g, ', ')
  }
  function letraMaiscInicial (nome: string): string {
    return nome.charAt(0).toUpperCase() + nome.slice(1)
  }

  function textoFormatado (text: string): string {
    return espacoVirgula(
      letraMaiscPontoFinal(
        letraMaiscInicial(
          text)))
  }

// Como regex são bons

</script>
