# Technical Design — busca-e-descoberta

Status: APPROVED
Version: 0.1.0
Owner: agt-web-architecture
Requirements version: 0.1.0
Date: 2026-08-07

## Mapa FSD

```text
Page:      src/02-pages/home, search, product
Widgets:   search-bar, offer-card, app-shell
Features:  src/04-features/search (useSearchStore, search-api)
           src/04-features/catalog (catalog-api)
Entities:  search-document, product, listing, seal, trust-score
Shared:    mock-api, format, http
```

## Navegação

`/` · `/buscar` · `/produto/:productId` · deep link query `q`.

## Ownership do estado

`useSearchStore` em `04-features/search/model` — query, filtros, resultados, loading.

## Integração com API

`searchApi` / `catalogApi` → `mockApi` (fixtures tipadas `I*`).

## Estados e resiliência

- Loading: texto/estado na page
- Vazio: empty-state com CTA
- Erro: mensagem honesta do mock

## Layout responsivo

Grid de cards auto-fill; busca full-width; chips removíveis.

## Acessibilidade técnica

`role="search"`; sugestões com teclado; cards com `aria-label`; contraste marca carbon/laranja.

## Paridade

Hierarquia do cartão e Patrocinado alinhados a mobile; layout web adapta.

## Estratégia de teste

`home-page.test.tsx`, `mock-api.test.ts`; gates em W08.
