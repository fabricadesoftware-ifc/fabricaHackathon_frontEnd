# Temas do HackIFC

A paleta canônica fica em `src/theme/tokens.css`. Cada função possui um valor
`--app-light-*`, um `--app-dark-*` e um alias ativo `--app-*`. O atributo
`html[data-theme="dark"]` troca os aliases; o padrão é claro, independentemente
da preferência do sistema operacional. Os valores claros foram registrados
antes da migração em `theme-color-inventory.md` e preservados sem aproximar
valores OKLCH do Tailwind por cores hexadecimais semelhantes.

`src/tailwind.css` expõe esses aliases com `@theme inline`. Use, por exemplo,
`bg-app-surface-plain`, `text-app-text-secondary`, `border-app-border-default`,
`hover:bg-app-surface-muted` e `focus-visible:outline-app-focus`. Diferentes
valores claros continuam separados: `text-secondary` (slate),
`text-secondary-neutral` (gray) e `ink-secondary` (hexadecimal) não são sinônimos.
Cores de ação, texto sobre ação, bordas, seleção, estados e foco têm funções
próprias. Fotografias, logos reais e partes decorativas de SVG mantêm suas cores;
a família `art-*` permite preservar ou adaptar cada parte sem afetar texto.

## Estado e inicialização

`src/theme/state.ts` contém o estado reativo único, `setTheme`, `toggleTheme` e
`subscribeTheme`. A chave de persistência é `hackifc.theme`. Valores desconhecidos,
ausência de preferência ou armazenamento bloqueado usam o tema claro. A troca
continua funcionando em memória quando o localStorage estiver indisponível.
Eventos `storage` sincronizam outras abas; remover a preferência restaura o claro.

O script síncrono no início de `index.html` aplica o atributo e `color-scheme`
antes da primeira renderização. O CSS dos tokens é carregado no cabeçalho.
Mantenha a chave desse script igual à constante exportada pelo estado; o teste
unitário exercita o script real do HTML, inclusive quando o armazenamento falha.

`ThemeToggle.vue` é usado no cabeçalho e em login/cadastro. Usa botão nativo,
Enter/Espaço, foco visível, título e `aria-pressed` com descrição do tema atual.

## Vuetify e Vuetify0

`src/plugins/vuetify.ts` lê a paleta CSS para configurar os dois temas do Vuetify.
Seu parser exige cores concretas: as entradas `--app-{light,dark}-vuetify-*` são
hexadecimais. O Vuetify0 aceita os aliases CSS diretamente. `connectThemes(app)`
é chamado depois de registrar os dois plugins, seleciona o mesmo tema em ambos
e remove a assinatura ao desmontar a aplicação. Não mantenha um segundo estado
em componentes nem configure temas locais em menus/modais. Os elementos
teleportados herdam as variáveis do `html` e o tema global do Vuetify.

As cores originais do Vuetify e do Vuetify0 eram diferentes (por exemplo,
`#1867c0` e `#2563eb`). Ambas foram preservadas no claro, com correspondentes
escuros na mesma fonte de paleta. A compatibilidade global de `bg-app-surface`
e `text-app-on-brand` conserva a cascata anterior dos helpers não estratificados
do Vuetify, inclusive seu texto preto/branco. Para novas superfícies sem esse
comportamento legado, use `bg-app-surface-plain` e o token de texto explícito.

## Cards e manutenção

O ProjectCard tem um estado de expansão independente do tema. Os tokens
`project-revealed-surface`, `line-foreground` e `surface-*-foreground` mantêm o
hover escuro original no claro e um destaque mais claro no escuro. O fallback
SVG muda com esse estado; a placa das logos reais permanece branca nos dois temas.
Não altere proporções, tamanhos ou temporizações ao ajustar tokens.

## Validação

- `npm run type-check`, `npm run build`, `npm test`.
- `npm run lint` para a árvore inteira; use ESLint nos arquivos alterados para
  distinguir erros preexistentes fora do escopo.
- `npm run test:browser` com Vite e Chrome isolado na porta 9231. A variável
  `HACKIFC_PREVIEW_URL` seleciona o servidor; `HACKIFC_CHROME_URL`, o Chrome.

A suíte de navegador usa componentes reais e fixtures sem acesso à API real.
Verifica ambos os temas em 1200, 390 e 320 px, foco, hover, toque, campos, loading,
filtros, preferência após recarga, dois provedores e menus/modais teleportados.
Os screenshots de teste ficam em `/tmp`; não fazem parte do projeto. Fluxos
com dados autenticados reais ainda exigem revisão no ambiente integrado.

Foram aplicados os workflows locais Caveman `safe-refactor` e
`verify-and-stop`. Superpowers, Impeccable, Frontend Design e Web Design
Guidelines não estavam instalados nesta sessão.
