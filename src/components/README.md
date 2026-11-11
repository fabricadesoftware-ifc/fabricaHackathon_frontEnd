# Componentes do HackIFC

Os componentes são importados explicitamente. Não há plugin de importação automática configurado.

- `ui/`: controles e elementos visuais reutilizáveis.
- `layout/`: composições de componentes e seções das páginas.
- As páginas ficam em `src/pages`; lógica compartilhada fica em `src/composables` e funções sem estado em `src/utils`.

Utilize Vue 3 com `<script setup lang="ts">`, props e eventos tipados. Prefira os componentes e variantes existentes antes de criar outra implementação.

## Estilização

Utilize Tailwind nos templates, preservando os valores e os estados existentes. `App.vue` controla o espaçamento externo das páginas.

O projeto também carrega estilos do Vuetify. Algumas classes, como `bg-white` e `border`, possuem regras fora das camadas do Tailwind e podem sobrescrever cores e bordas. Ao migrar CSS existente, confira a cascata no navegador; valores como `bg-[#fff]` e `border-[1px]` permitem preservar a aparência sem acrescentar `!important`.

Mantenha CSS próprio para transições com temporizações específicas, ilustrações e ajustes necessários sobre o DOM ou os resets do Vuetify. O foco global fornece um contorno visível na camada base; preserve indicadores equivalentes quando um controle utilizar `outline-none`.

## Reutilização

- `statusProject.vue`: status de projetos; a variante `card` preserva o indicador compacto dos cards.
- `statusSelect.vue`: status de edições; variantes `card` e `evaluation` preservam suas apresentações específicas.
- `AppButton`: variantes e posições de ícone existentes; `loading` desabilita o botão, mostra o loader do Vuetify e comunica `aria-busy`.
- `FilterChipGroup`: filtros padrão ou variante `underline`, com seleção comunicada por `aria-pressed`.
- `CardGrid`: a opção `compact` distribui os projetos automaticamente conforme a largura disponível.
- `useCardReveal`: estados de expansão por mouse, teclado e toque.
- `resolveMediaUrl`: resolução de caminhos de mídia relativos, preservando URLs fornecidas pela API.

## Verificação

Execute `npm run type-check`, `npm run lint`, `npm run build` e `npm test`.

Os testes unitários compilam os templates reais com o compilador fornecido por Vue. Um renderer leve verifica eventos e props encaminhadas ao Vuetify; a suíte de navegador confere o Vuetify real. `tsconfig.tests.json` inclui os testes na checagem de tipos sem adicionar tipos Node ao frontend.

Para os testes de navegador, inicie `npm run dev` e uma instância isolada de Chrome com depuração na porta 9231. Execute `npm run test:browser`. `HACKIFC_PREVIEW_URL` e `HACKIFC_CHROME_URL` permitem apontar para outras portas. A página `tests/browser/fixtures.html` usa somente fixtures e bloqueia acesso à API real.

As verificações cobrem foco por teclado, filtros, loading, edição da bio, hover, Escape, toque e largura dos containers em desktop e celular. As capturas dos cards são gravadas em `/tmp/hackifc-final-cards-1200.png` e `/tmp/hackifc-final-cards-390.png`.
