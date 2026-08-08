<script lang="ts" setup>
import DangerZoneSection from './components/layout/DangerZoneSection/DangerZoneSection.vue';
import DangerActionItem from './components/layout/DangerActionItem/DangerActionItem.vue';
</script>
<template>

  <div class="flex">
  <DangerZoneSection>
    <ul>
      <li>
        <DangerActionItem 
        icon='mdi mdi-exit-to-app'
        title="Sair da conta"
        subtitle="encerre sua sessão"
        variant="sair"
        />
      </li>
      <li>
        <DangerActionItem 
        icon='mdi mdi-trash-can'
        title="Excluir conta"
        subtitle="Isso deleta todas as informações das contas"
        variant="excluir"
        />
      </li>
    </ul>
  </DangerZoneSection>
  </div>
</template>
<style scoped></style>
