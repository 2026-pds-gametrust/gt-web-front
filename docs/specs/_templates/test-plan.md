# Test Plan — <feature-slug>

Owner: agt-web-qa (modo PLAN)
Requirements version:
Date:

## Escopo

## Matriz de casos

| ID | Persona | AC | Plataforma | Estado | Nível | Prioridade |
|---|---|---|---|---|---|---|
| TC-01 | | AC-01 | Chrome | | Unit/Integration/E2E/Manual | P0 |
| TC-02 | | | Firefox / Safari / mobile web | | | P1 |

## Convenções

- Unit: `*.test.ts(x)` co-localizado.
- Integração de slice: `__tests__/*.spec.ts(x)` na raiz do slice.
- E2E: `e2e/` na raiz do projeto (Playwright).
- Cada `describe` tem exatamente um `it`; `describe('When ...')` / `it('should ...')` em inglês.

## Dados e ambiente

<!-- Usuário de teste, mocks, seeds, rotas necessárias. -->

## Riscos e fora do escopo
