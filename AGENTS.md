# AGENTS.md — frontend-web (GamerTrust)

Contrato curto para agents que trabalham neste repositório. Produto é canônico em `context/`; arquitetura de implementação segue `ARCHITECTURE.md` e `Frontend_Agents.md`.

## 1. Mapa deste repo

| Área | Path | Papel |
|------|------|-------|
| Contexto de produto | [`context/`](context/) | Visão, personas, busca, confiança, marketplace, IA, roadmap, métricas |
| Docs de produto/UX | [`docs/`](docs/) | Personas detalhadas, jornadas, paridade visual, knowledge base, templates de specs |
| Contratos HTTP | [`docs/frontend-api/`](docs/frontend-api/) | 66 endpoints: curl, req/res, erros, fluxo conta → anúncio |
| Arquitetura | [`ARCHITECTURE.md`](ARCHITECTURE.md), [`Frontend_Agents.md`](Frontend_Agents.md) | FSD React/TS, naming, testes |
| App | [`src/`](src/) | Camadas FSD `01-app` … `06-shared` |
| E2E | [`e2e/`](e2e/) | Playwright (fora de `src/`) |
| Ralph visual | [`docs/ralph/`](docs/ralph/) | Loops de auditoria, ledger JSONL, evidências |
| Kit Cursor | [`.cursor/`](.cursor/) | Rules, agents e skills **web** |

## 2. Ordem de leitura

1. [`context/GamerTrust-00-PRODUCT-CONTEXT.md`](context/GamerTrust-00-PRODUCT-CONTEXT.md)
2. Domínio da tarefa (`01`–`08` em `context/`)
3. [`docs/design-system/paridade-visual.md`](docs/design-system/paridade-visual.md) — se tocar UI
4. [`docs/personas/GamerTrust-Playbook-de-Personas-para-Agentes.md`](docs/personas/GamerTrust-Playbook-de-Personas-para-Agentes.md)
5. Persona primária + contraste
6. Este `AGENTS.md` + [`ARCHITECTURE.md`](ARCHITECTURE.md)

## 3. Regras não negociáveis

1. **Confiança > volume** — nunca priorizar conversão fingindo verificação.
2. **IA não inventa** — atributos, estado, garantia ou preço “certo” sem evidência.
3. **Paridade Web ↔ iOS ↔ Android** — mesma hierarquia, selos, TrustScore e significado; só linguagem de UI difere (HTML/CSS vs SwiftUI vs Compose).
4. **Produto ≠ Oferta** — catálogo e UI devem distinguir modelo e unidade usada.
5. **Sem usuário genérico** — declarar persona primária e contraste (playbook).
6. **Implementação só neste app** — não misturar Swift/Kotlin/backend no mesmo handoff sem escopo explícito.
7. **Legado** — material em [`docs/_legacy/`](docs/_legacy/) é histórico; não usar como norma.
8. **FSD** — importar só para baixo (`01-app` → … → `06-shared`); sem axios/lógica de negócio em pages.

## 4. Stack

| Área | Escolha |
|------|---------|
| UI | React + TypeScript |
| Estilos | Tailwind CSS v4 (`@tailwindcss/vite`) + tokens `--gt-*` |
| Bundler | Vite |
| Router | `react-router-dom` |
| Estado | Zustand |
| HTTP | Axios via `src/06-shared/lib/http` |
| Package manager | yarn |
| Unit / Integration | Jest (`*.test` / `*.spec`) |
| E2E | Playwright (`e2e/`) |

## 5. Canal web (produto)

Web é o canal natural para explorar catálogo, pesquisar profundamente, comparar, acompanhar preços e gerenciar anúncios. Capacidades essenciais existem nos três canais; UX adapta ao dispositivo.

Personas âncora no web: **Beatriz** (comparação), **Lucas** (validação cuidadosa), **Camila/André** (moderação/painel em desktop).

## 6. Spec-driven

Artefatos por feature em `docs/specs/<feature-slug>/` (templates em [`docs/specs/_templates/`](docs/specs/_templates/)).

Gates: requirements aprovados → design técnico → implementação → app em execução → QA → paridade visual / a11y.

## 7. Agents locais

| Agent | Papel |
|-------|-------|
| `agt-web-react-developer` | Implementação React/TS + FSD |
| `agt-web-orchestrator` | Esteira e gates |
| `agt-web-architecture` | FSD e contratos |
| `agt-web-qa` | Jest + Playwright |
| `agt-web-performance` | Core Web Vitals / bundle |
| `agt-web-release` | CI / deploy web |
| `agt-web-product-owner` | Specs e priorização |
| `agt-accessibility` | WCAG / teclado / leitores |
| `agt-visual-review` / `agt-ui-ux-auditor` / `agt-persona-simulator` | Paridade e personas |
| `agt-web-verifier` | Verificação independente do Ralph Loop visual |
