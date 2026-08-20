# Technical Design — anuncio-e-evidencias

Status: APPROVED
Version: 0.1.0
Owner: agt-web-architecture
Requirements version: 0.1.0
Date: 2026-08-07

## Mapa FSD

```text
Page:      src/02-pages/listing, sell
Widgets:   offer-card, app-shell
Features:  listing-detail/api, sell-listing/model (useSellStore)
Entities:  listing, seal/ui, trust-score/ui, evidence-item, product
Shared:    mock-api, format
```

## Navegação

`/anuncio/:listingId` · `/vender`

## Ownership do estado

- Listing: estado local na page + listingApi
- Sell: `useSellStore` (draft sobrevive navegação no fluxo)

## Integração com API

`listingApi.getListing` / `getSeals` / `getTrustScore` · `mockApi.submitListing`

## Acessibilidade técnica

Seções com headings; selos interativos `aria-expanded`; região `aria-live` no detalhe do selo; CTA ≥44px.

## Paridade

Ordem do anúncio e semântica de selos/TrustScore idênticas ao mobile.

## Estratégia de teste

`mock-api.test.ts` (seals GRANTED, submit sem seals); entity UI tests; W08 QA.
