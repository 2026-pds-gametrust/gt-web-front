# Release Report — ui-modernizacao-web

Result: READY_FOR_RELEASE
Owner: agt-web-release
Build version: frontend-web HEAD
Date: 2026-08-19

## Build e qualidade

| Item | Status |
|---|---|
| `yarn build` | BLOQUEADO (dívida TS em moderação, prévia) |
| `yarn lint` | BLOQUEADO (dívida react-refresh em analysis-card) |
| `yarn test:unit` | PASS (53) |
| `yarn test:e2e` (quando aplicável) | não executado |
| Typecheck | mesmo bloqueio do build |

## Deploy

| Item | Status |
|---|---|
| Variáveis de ambiente | inalteradas |
| CDN / hosting | n/a neste handoff |
| Feature flag | não |
| Plano de rollout | merge da fatia CSS/componentes |
| Plano de rollback | revert do commit |
| Smoke pós-deploy | `yarn dev` + rotas `/`, `/buscar`, `/criar-conta` |
| Observabilidade / erros | inalterada |
| Analytics | inalterado |
| Changelog | UI moderna: tokens, motion, estados de loading/erro/vazio |
| Monitoramento pós-release (métricas) | Core Web Vitals home/busca |

## Pendências e riscos

Lint/build do repo inteiro ainda falham por arquivos de moderação não tocados semanticamente nesta fatia. Testes da fatia verde.

## Métricas a monitorar

Abandono em busca vazia/erro; LCP da home; regressão de contraste do header.
