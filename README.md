# hackathon

Scaffolded with Vuetify CLI.

## ❗️ Documentation

- Primary docs: https://0.vuetifyjs.com/
- Getting started guide: https://0.vuetifyjs.com/guide
- Community support: https://community.vuetifyjs.com/
- Issue tracker: https://issues.vuetifyjs.com/

## 🧱 Stack

- Framework: Vue 3 + Vite
- UI Library: Vuetify0
- Language: TypeScript
- Package manager: npm

## 🧭 Start Here

- Main entry: `src/main.ts`
- Main app component: `src/App.vue`
- Main styles: `src/styles/`
- Plugin setup: `src/plugins/`

## 📁 Project Structure

- `src/main.ts` — application entry point
- `src/App.vue` — root component
- `src/components/` — reusable Vue components
- `src/plugins/` — plugin registration and setup
- `src/styles/` — global styles and theme settings
- `public/` — static public files

## ✨ Enabled Features

- ESLint
- Vue Router
- Tailwind CSS

## 💿 Install

Use your selected package manager (npm) to install dependencies:

```bash
npm install
```

## 🚀 Quick Start

```bash
npm install
npm run dev
```

## 🔌 API (back-end)

A URL do back vem da variável `VITE_API_URL` (nunca fixa no código).

```bash
cp .env.example .env   # local: http://localhost:8000/api (back com `pdm run dev`)
```

Em produção, defina `VITE_API_URL` com o domínio do back no Fabroku.

- `src/services/http.ts` — cliente `fetch` (JSON, Bearer token, `ApiError` padronizado)
- `src/services/*.ts` — `listarEdicoes`, `obterEdicao`, `listarProjetos`, `listarEquipes`, `listarRanking`…
- `src/types/` — tipos das respostas
- `src/composables/useAsync.ts` + `LoadingSkeleton`/`ErrorMessage` — estados de carregamento e erro

## 🏗️ Build

```bash
npm run build
```

## 🧪 Available Scripts

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run build-only`
- `npm run type-check`
- `npm run lint`
- `npm run lint:fix`

## 💪 Support Vuetify Development

This project uses Vuetify0 - an MIT licensed Open Source project. We are glad to welcome contributors and any support for ongoing development:

- Contribute to Vuetify and ecosystem projects: https://github.com/vuetifyjs
- Request enterprise support: https://support.vuetifyjs.com/
- Sponsor on GitHub: https://github.com/sponsors/vuetifyjs
- Support on Open Collective: https://opencollective.com/vuetify
