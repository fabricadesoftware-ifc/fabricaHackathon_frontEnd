<script setup lang=ts>
  import settingSectionHeader from '@/components/ui/SettingSectionHeader/settingSectionHeader.vue'

</script>

<template>
  <div class="min-w-40 flex bg-white justify-between gap-10">
    <settingSectionHeader
      icon="mdi mdi-alert"
      subtitle="Ações que podem ser irreversíveis"
      title="Zona de Perigo"
      variant="perigo"
    />

    <slot />
  </div>
</template>
