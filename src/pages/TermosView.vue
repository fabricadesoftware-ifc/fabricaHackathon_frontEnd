<script setup lang="ts">
import { RouterLink } from 'vue-router'

const ATUALIZADO_EM = '22/10/2026'

const secoes = [
  {
    id: 'aceitacao',
    titulo: '1. Aceitação',
    paragrafos: [
      'Ao criar uma conta ou usar a plataforma HackIFC // 24H, você declara que leu e concorda com estes Termos de Uso. Se não concordar, não utilize a plataforma.',
    ],
  },
  {
    id: 'conta',
    titulo: '2. Conta e segurança',
    itens: [
      'Use dados verdadeiros no cadastro (nome e e-mail) e mantenha-os atualizados.',
      'Você é responsável pela confidencialidade da sua senha e por tudo o que ocorre na sua conta.',
      'Cada pessoa deve ter uma única conta. Contas não podem ser compartilhadas.',
      'Avise a organização do evento se suspeitar de uso indevido da sua conta.',
    ],
  },
  {
    id: 'perfis',
    titulo: '3. Perfis de uso',
    paragrafos: [
      'Toda conta nasce como Participante. Os perfis de Avaliador e Professor são solicitados no cadastro ou depois e só passam a valer após aprovação de um administrador, que pode aprovar ou recusar o pedido.',
      'Avaliadores só avaliam as edições às quais foram vinculados pela organização e devem lançar notas com imparcialidade, sem divulgar o conteúdo avaliado antes da divulgação oficial dos resultados.',
    ],
  },
  {
    id: 'inscricao',
    titulo: '4. Inscrições e equipes',
    itens: [
      'Quem inscreve a equipe é o criador e conta como participante 1. Cada edição define o mínimo e o máximo de participantes por equipe.',
      'Os demais integrantes são convidados pelo e-mail com que se cadastraram na plataforma.',
      'Alterações na equipe e no projeto só são possíveis enquanto a edição estiver com inscrições abertas.',
      'A organização pode recusar ou cancelar inscrições que descumpram as regras da edição ou destes Termos.',
    ],
  },
  {
    id: 'conteudo',
    titulo: '5. Projetos e conteúdo enviado',
    paragrafos: [
      'Os projetos continuam sendo de autoria das equipes. Ao enviar nome, descrição, link de deploy, logo ou foto, você autoriza a plataforma a exibir esse conteúdo a avaliadores e visitantes, para fins de divulgação e de avaliação do evento.',
      'Você declara ter direito de usar tudo o que envia e que o conteúdo não viola direitos de terceiros. Não envie conteúdo ofensivo, ilegal, discriminatório ou que contenha dados pessoais de outras pessoas sem autorização.',
    ],
  },
  {
    id: 'imagens',
    titulo: '6. Imagens',
    paragrafos: [
      'Fotos de perfil e logos devem estar nos formatos JPEG, PNG ou WebP, com até 5 MB. Imagens grandes são reduzidas automaticamente antes do envio. A organização pode remover imagens inadequadas.',
    ],
  },
  {
    id: 'conduta',
    titulo: '7. Conduta',
    itens: [
      'Trate todas as pessoas com respeito, dentro e fora da plataforma.',
      'Não tente acessar contas ou dados de outras pessoas, burlar limites de uso ou prejudicar o funcionamento do sistema.',
      'Não use a plataforma para spam, fraude ou qualquer atividade ilegal.',
    ],
  },
  {
    id: 'avaliacao',
    titulo: '8. Avaliação e resultados',
    paragrafos: [
      'As notas seguem os critérios definidos em cada edição. A nota final e o ranking só são divulgados quando a edição é finalizada. As decisões da organização sobre resultados são definitivas, conforme o regulamento de cada edição.',
    ],
  },
  {
    id: 'privacidade',
    titulo: '9. Privacidade e dados pessoais (LGPD)',
    paragrafos: [
      'Tratamos os dados necessários para o funcionamento do evento: nome, sobrenome, e-mail, foto de perfil (opcional), equipes, projetos e notas. A finalidade é operar inscrições, avaliações e a divulgação dos resultados, com base na execução das atividades do evento e no seu consentimento ao aceitar estes Termos.',
      'Seu nome e o conteúdo dos projetos podem ficar visíveis a outros usuários da plataforma. Seu e-mail não é exibido publicamente. Não vendemos dados pessoais.',
      'Você pode pedir acesso, correção ou exclusão dos seus dados e a revogação do consentimento, conforme a Lei nº 13.709/2018 (LGPD), entrando em contato com a organização.',
    ],
  },
  {
    id: 'mudancas',
    titulo: '10. Alterações destes Termos',
    paragrafos: [
      'Estes Termos podem ser atualizados. A data da última atualização aparece no topo desta página. O uso continuado da plataforma depois de uma alteração significa que você concorda com a nova versão.',
    ],
  },
  {
    id: 'contato',
    titulo: '11. Contato',
    paragrafos: [
      'Dúvidas, pedidos sobre dados pessoais ou denúncias podem ser enviados à Fábrica de Software do IFC, organizadora da plataforma.',
    ],
  },
] as Array<{ id: string; titulo: string; paragrafos?: string[]; itens?: string[] }>
</script>

<template>
  <article class="mx-auto w-full max-w-3xl px-1 py-4 sm:px-4">
    <header class="mb-6 border-b border-gray-200 pb-4">
      <h1 class="text-2xl font-semibold text-gray-900 sm:text-3xl">Termos de Uso</h1>
      <p class="mt-1 text-sm text-gray-500">HackIFC // 24H · Última atualização: {{ ATUALIZADO_EM }}</p>
    </header>

    <nav aria-label="Seções" class="mb-8 rounded-lg bg-gray-50 p-4 text-sm">
      <ul class="grid grid-cols-1 gap-1 sm:grid-cols-2">
        <li v-for="s in secoes" :key="s.id">
          <a class="text-blue-600 hover:underline" :href="`#${s.id}`">{{ s.titulo }}</a>
        </li>
      </ul>
    </nav>

    <section v-for="s in secoes" :id="s.id" :key="s.id" class="mb-7 scroll-mt-6">
      <h2 class="mb-2 text-lg font-semibold text-gray-900">{{ s.titulo }}</h2>
      <p v-for="(p, i) in s.paragrafos" :key="i" class="mb-2 leading-relaxed text-gray-700">{{ p }}</p>
      <ul v-if="s.itens" class="list-disc space-y-1 pl-5 text-gray-700">
        <li v-for="(it, i) in s.itens" :key="i" class="leading-relaxed">{{ it }}</li>
      </ul>
    </section>

    <footer class="mt-10 flex flex-wrap items-center gap-4 border-t border-gray-200 pt-6">
      <RouterLink class="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700" to="/registro">
        Voltar ao cadastro
      </RouterLink>
      <RouterLink class="text-sm text-blue-600 hover:underline" to="/home">Ir para a Home</RouterLink>
    </footer>
  </article>
</template>
