# QA Report — anuncio-e-evidencias

QA result: PASS_WITH_RISKS
Mode: VERIFY
Owner: agt-web-qa
Feature slug: anuncio-e-evidencias
Requirements version: 0.1.0
Build version: 0.1.0
Date: 2026-08-07

## Platforms

- Chrome: PASS (dev)
- Mobile web: PASS parcial (CSS)

## Personas

- Lucas (leitura do anúncio)
- Rafael / Carlos (wizard vender)

## Acceptance criteria

- AC-01 Ordem canônica: PASS
- AC-02 Sem fake seal: PASS (MockApi filtra GRANTED; SealBadge oculta não-GRANTED)
- AC-03 Vender → under_review sem seals: PASS (`mock-api.test.ts`)

## Automated tests

- `mock-api.test.ts` — seals GRANTED only; submit seals=[]
- `seal-badge.test.tsx` / `trust-score-summary.test.tsx`

## Commands

```text
yarn test:unit
yarn build
```

## Defects

Nenhum blocker.

## Residual risks

- Wizard vender sem E2E; persistência Zustand só no fluxo de sessão
- Evidências de mídia são placeholders

## Evidence

- Unit tests; copy honesta quando sem selos
