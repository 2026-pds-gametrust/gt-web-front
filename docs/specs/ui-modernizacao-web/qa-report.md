# QA Report — ui-modernizacao-web

QA result: PASS_WITH_RISKS
Mode: AUTOMATE
Owner: agt-web-qa
Feature slug: ui-modernizacao-web
Requirements version: 1.0.0
Build version: frontend-web HEAD
Date: 2026-08-19

> PASS completo exigiria evidência visual no browser (`yarn dev`). Automação unit/integration passou.

## Platforms

- Chrome: não executado neste ciclo (código + Jest)
- Firefox: n/a
- Safari: n/a
- Mobile web: n/a (layout fluido)

## Personas

- Beatriz, Lucas, Carlos, Camila

## Acceptance criteria

- AC-01: PASS (código) — Skeleton + FeedbackBanner em home/busca/produto/anúncio
- AC-02: PASS (código) — fade-up, hover-lift, SealBadge
- AC-03: PASS (código) — 11 blocos intactos; galeria com key/fade
- AC-04: PASS (código) — `motion.css` reduced-motion
- AC-05: PASS (código) — FormField vender; banners admin/moderação
- AC-06: PASS (código) — ghost-on-dark + Criar conta

## Automated tests

- `yarn test:unit` — 17 suites, 53 passed
- `yarn test:integration` — 3 suites, 22 passed
- Novos: `page-hero.test.tsx`, `empty-state.test.tsx`, `skeleton.test.tsx`
- Corrigido: `seller-verification-copy.test.ts` alinhado à copy de rejeição definitiva

## Exploratory tests

Não executados no browser nesta passagem.

## Commands

```text
yarn test:unit          # PASS
yarn test:integration   # PASS
yarn lint               # FAIL preexistente (moderation-analysis-card react-refresh)
yarn build              # FAIL preexistente (verification-api tipos)
```

## Defects

- DEF-01 (preexistente): `yarn lint` erro em `moderation-analysis-card.tsx` (react-refresh).
- DEF-02 (preexistente): `yarn build` tipos em verification/moderation.

## Accessibility findings

Skeletons com `aria-busy` e texto visually-hidden.

## Visual findings

Motion CSS; tokens extraídos. Revisão visual formal no artefato `visual-review.md`.

## Residual risks

Sem evidência de screenshot no Chrome. Lint/build globais ainda vermelhos por dívida anterior.

## Evidence

Saída Jest 2026-08-19.
