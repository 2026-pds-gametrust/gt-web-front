# Test Plan — ui-modernizacao-web

Owner: agt-web-qa (modo PLAN)
Requirements version: 1.0.0
Date: 2026-08-19

## Escopo

Componentes shared (PageHero, EmptyState, Skeleton, FeedbackBanner) e superfícies de discovery, anúncio, shell, vender, moderação/admin.

## Matriz de casos

| ID | Persona | AC | Plataforma | Estado | Nível | Prioridade |
|---|---|---|---|---|---|---|
| TC-01 | Beatriz | AC-01 | Chrome | loading/error home | Unit | P0 |
| TC-02 | Beatriz | AC-01 | Chrome | busca skeleton/banner | Manual | P0 |
| TC-03 | Beatriz | AC-02 | Chrome | cartão/rails motion | Unit + visual | P0 |
| TC-04 | Lucas | AC-03 | Chrome | ordem 11 blocos | Manual | P0 |
| TC-05 | Lucas | AC-04 | Chrome | reduced-motion | Manual | P0 |
| TC-06 | Carlos | AC-05 | Chrome | FormField vender | Manual | P1 |
| TC-07 | Camila | AC-05 | Chrome | banner moderação | Manual | P1 |
| TC-08 | Lucas | AC-06 | Chrome | header ghost on dark | Manual | P0 |
| TC-09 | Carlos | auth | Chrome | cadastro sucesso | Integration | P0 |

## Convenções

- Unit: `*.test.ts(x)` co-localizado.
- Integração: `__tests__/*.spec.ts(x)`.
- E2E: fora desta fatia (opcional).

## Dados e ambiente

HTTP stub Jest; `yarn test:unit` / `yarn test:integration`.

## Riscos e fora do escopo

`yarn build` / `yarn lint` têm falhas preexistentes fora desta fatia (moderação TS/eslint).
