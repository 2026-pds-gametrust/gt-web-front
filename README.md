# GamerTrust — frontend-web

Marketplace web de eletrônicos e produtos gamer usados, com foco em confiança verificável.

Canal natural para busca profunda, comparação e gestão de anúncios. Stack: **React + TypeScript + Vite**, arquitetura **FSD** (`src/01-app` … `06-shared`).

## Pré-requisitos

- Node.js LTS (ver [`.nvmrc`](.nvmrc))
- [Yarn](https://yarnpkg.com/) Classic (1.x)

## Setup

```bash
yarn install
yarn dev
```

App em `http://localhost:5173`.

## Scripts

| Comando | Descrição |
|---------|-----------|
| `yarn dev` | Servidor de desenvolvimento |
| `yarn build` | Build de produção |
| `yarn preview` | Preview do build |
| `yarn lint` / `yarn lint:fix` | ESLint |
| `yarn format` | Prettier |
| `yarn test:unit` | Testes unitários (Jest) |
| `yarn test:integration` | Testes de integração de slice |
| `yarn test:coverage` | Cobertura (≥ 80% meta) |
| `yarn test:e2e` | Playwright |

## Documentação

| Doc | Uso |
|-----|-----|
| [`AGENTS.md`](AGENTS.md) | Contrato para agents |
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | FSD e padrões |
| [`Frontend_Agents.md`](Frontend_Agents.md) | Detalhe de padrões |
| [`context/`](context/) | Contexto de produto |
| [`docs/design-system/paridade-visual.md`](docs/design-system/paridade-visual.md) | Paridade Web ↔ iOS ↔ Android |
| [`docs/frontend-api/`](docs/frontend-api/) | Contratos HTTP: curl, req/res, erros, fluxo conta → anúncio |

## Estrutura

```text
src/
  01-app/       # bootstrap, providers, router
  02-pages/     # telas
  03-widgets/   # blocos compostos
  04-features/  # casos de uso
  05-entities/  # domínio
  06-shared/    # UI base, HTTP, utils
e2e/            # Playwright
```
# gt-web-front
