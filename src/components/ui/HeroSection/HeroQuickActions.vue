<script setup lang="ts">
import { computed } from 'vue'
import HeroQuickActionCard from './HeroQuickActionCard.vue'
import { useAuthStore } from '@/stores/auth'

interface QuickAction {
  title: string
  description: string
  icon: string
  to: string
}

const authStore = useAuthStore()

const actions = computed<QuickAction[]>(() => {
  const items: QuickAction[] = [
    {
      title: 'Edições',
      description: 'Explore os hackathons disponíveis.',
      icon: 'mdi-calendar-blank-outline',
      to: '/edicoes',
    },
    {
      title: 'Projetos',
      description: 'Conheça os projetos da comunidade.',
      icon: 'mdi-folder-outline',
      to: '/explorar',
    },
  ]

  if (!authStore.isAuthenticated) {
    return [
      ...items,
      {
        title: 'Inscrições',
        description: 'Encontre uma edição para participar.',
        icon: 'mdi-clipboard-text-outline',
        to: '/edicoes',
      },
      {
        title: 'Entrar',
        description: 'Acesse sua conta no HackIFC.',
        icon: 'mdi-login',
        to: '/login',
      },
    ]
  }

  const role = authStore.userRole

  if (role === 'PARTICIPANTE') {
    return [
      ...items,
      {
        title: 'Inscrições',
        description: 'Gerencie sua participação.',
        icon: 'mdi-clipboard-text-outline',
        to: '/inscricao',
      },
      {
        title: 'Minhas equipes',
        description: 'Acesse suas equipes.',
        icon: 'mdi-account-group-outline',
        to: '/equipes',
      },
    ]
  }

  if (role === 'PROFESSOR' || role === 'ADMIN') {
    return [
      ...items,
      {
        title: 'Meus projetos',
        description: 'Acompanhe seus projetos.',
        icon: 'mdi-folder-account-outline',
        to: '/projetos',
      },
      {
        title: 'Avaliações',
        description: 'Acompanhe as avaliações.',
        icon: 'mdi-clipboard-check-outline',
        to: '/avaliacao',
      },
    ]
  }

  return [
    ...items,
    {
      title: 'Avaliações',
      description: 'Acesse as avaliações.',
      icon: 'mdi-clipboard-check-outline',
      to: '/avaliacao',
    },
    {
      title: 'Configurações',
      description: 'Gerencie sua conta.',
      icon: 'mdi-cog-outline',
      to: '/configuracoes',
    },
  ]
})
</script>

<template>
  <nav aria-label="Acessos rápidos">
    <div class="flex flex-col">
      <template
        v-for="(action, index) in actions"
        :key="action.to + action.title"
      >
        <HeroQuickActionCard v-bind="action" />

        <div
          v-if="index < actions.length - 1"
          class="mx-2 h-px bg-blue-200/60"
          aria-hidden="true"
        />
      </template>
    </div>
  </nav>
</template>