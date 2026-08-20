# Technical Design — mock-domain

Status: APPROVED
Version: 0.1.0
Owner: agt-web-architecture
Date: 2026-08-07

## Mapa FSD

```text
Entities:  src/05-entities/{category,product,listing,search-document,seal,trust-score,evidence-item}
Shared:    src/06-shared/lib/mock-api/{mock-api.ts,fixtures.ts}
           src/06-shared/lib/http
```

## Contratos

Types `I*` alinhados a `docs/backend-entities/`. Fixtures com e sem selos.

## Superfície MockApi

```text
search / getSuggestions / getHomeFeed
getProduct / getListingsByProduct
getListing / getSeals / getTrustScore
submitListing → under_review, seals=[]
getCategories
```

## Regras

- `quantity === 1`
- Selos expostos só `status === GRANTED`
- Produto ≠ Oferta nos IDs/rotas
- Sem inventar verificação

## Swap futuro

Features → httpClient → MockApi hoje; `VITE_API_MODE=real` depois, mesmos paths.
