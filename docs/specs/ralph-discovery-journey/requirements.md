# Requirements — ralph-discovery-journey

Status: APPROVED
Version: 1.0.0
Owner: agt-web-product-owner
Date: 2026-08-19

## Problema

Não havia jornada E2E mock cobrindo descoberta ponta a ponta (home → busca → anúncio) com evidência de a11y/visual, essencial para validar paridade da ação principal de Beatriz.

## Usuário afetado / Personas

- Primária: Beatriz (encontrar oferta comparável)
- Contraste: Lucas (abrir anúncio e ler título/selos sem verificação falsa)

## Jornada

Home `/` → SearchBar → `/buscar` → OfferCard → `/anuncio/:listingId`

## Resultado esperado

Jornada mock executável em Playwright com axe e screenshot do destino; sem depender de seed do gt-backend.

## Critérios de aceite

```md
### AC-01 — Happy path mock

Given mocks de /categories, /search e /listings
When Beatriz busca "rtx 4060" na home e abre a primeira oferta
Then chega em /anuncio/:id com título visível

### AC-02 — A11y da jornada

Given o fluxo acima
When axe roda no main do anúncio
Then zero violações wcag2aa no escopo

### AC-03 — Evidência visual

Given o fluxo acima
When screenshot do main é capturado
Then baseline aprovado nos viewports do Ralph
```

## Não escopo

Ordem canônica completa do anúncio, favoritos, auth, backend live.
