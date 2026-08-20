# Ralph Loop — auditoria visual (frontend-web)

Processo agentic incremental para auditar uma superfície visual real, corrigir findings no mesmo loop, testar, validar e registrar evidências no ledger.

## Histórico

| Área | Path | Papel |
|------|------|-------|
| Construção Fase 1 mock | [`ledgers/`](ledgers/) | W00–W08 (markdown, **DONE**) |
| Auditoria visual | [`ledger.jsonl`](ledger.jsonl) + [`loops/`](loops/) | append-only + recibo humano |
| Evidências | [`../../artifacts/ralph/`](../../artifacts/ralph/) | before/after/diff/a11y |

## Estados do loop visual

`PLANNED` → `AUDITING` → `FIXING` → `VERIFYING` → `COMPLETED` | `BLOCKED`

Um loop **não termina** quando o agent acredita que terminou. Termina quando `yarn ralph:verify -- --loop <id>` retorna `0` e `agt-web-verifier` registra `PASS`.

## Mapeamento de agents

| Papel | Agent local |
|-------|-------------|
| Orquestrador | `agt-web-orchestrator` |
| Product Owner | `agt-web-product-owner` |
| UI/UX + paridade | `agt-ui-ux-auditor`, `agt-visual-review` |
| Research / persona | `agt-user-research`, `agt-persona-simulator` |
| Acessibilidade | `agt-accessibility` |
| Arquitetura | `agt-web-architecture` |
| QA | `agt-web-qa` |
| Dev | `agt-web-react-developer` |
| Code review | `agt-code-review` |
| Verificador | `agt-web-verifier` |
| Release/PR | `agt-web-release` (somente se solicitado) |

## Viewports canônicos (web)

| Viewport | Uso |
|----------|-----|
| `390x844` | Mobile |
| `768x1024` | Tablet |
| `1440x900` | Desktop |

Tema: `light` · Locale: `pt-BR` · Browser piloto: Chromium

## Comandos

```bash
yarn ralph:ledger:append -- --file event.json
yarn ralph:gates -- --loop RL-YYYYMMDD-NNN
yarn ralph:verify -- --loop RL-YYYYMMDD-NNN
```

Gates completos: lint, typecheck, unit, integration, coverage, a11y, visual, e2e (escopo), build, smoke.

## Campanhas

- [visual-discovery](campaigns/visual-discovery.md) — OfferCard → Home → jornada descoberta

## Regras

1. Uma unidade por loop (rota, tela, componente ou jornada).
2. Todo finding do escopo é corrigido no mesmo loop ou o loop fica `BLOCKED`.
3. Chat não é fonte de verdade — ledger + loop md + artefatos.
4. Testes: unit co-localizado, integration `__tests__/*.spec`, E2E `e2e/`.
5. Confiança > volume; paridade em `docs/design-system/paridade-visual.md`.
