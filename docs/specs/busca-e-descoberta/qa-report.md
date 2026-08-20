# QA Report — busca-e-descoberta

QA result: PASS_WITH_RISKS
Mode: VERIFY
Owner: agt-web-qa
Feature slug: busca-e-descoberta
Requirements version: 0.1.0
Build version: 0.1.0
Date: 2026-08-07

> App mock em `yarn dev`; evidência unitária via Jest. E2E Playwright ainda não automatizado nesta fase.

## Platforms

- Chrome: PASS (dev)
- Firefox: N/A (não exercitado)
- Safari: N/A
- Mobile web: PASS parcial (layout responsivo CSS)

## Personas

- Beatriz (comparação)
- Lucas (validação)

## Acceptance criteria

- AC-01 Home busca dominante: PASS
- AC-02 Resultados + Patrocinado: PASS
- AC-03 Empty state: PASS

## Automated tests

- `src/02-pages/home/home-page.test.tsx`
- `src/06-shared/lib/mock-api/mock-api.test.ts`
- Entity UI: seal-badge / trust-score-summary

## Commands

```text
yarn test:unit
yarn build
```

## Defects

Nenhum blocker.

## Accessibility findings

Ver `accessibility-report.md` (mesmo slug).

## Visual findings

Ver `visual-review.md` (mesmo slug). Tokens de marca aplicados (laranja #F84000).

## Residual risks

- Sem suíte E2E Playwright ainda
- Sugestões/filtros dependem só de fixtures mock

## Evidence

- Unit tests verdes
- Brand logo em AppShell
