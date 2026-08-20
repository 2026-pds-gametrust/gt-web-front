# Requirements — busca-e-descoberta

Status: APPROVED
Version: 0.1.0
Owner: agt-web-product-owner
Date: 2026-08-07

## Problema

Beatriz e Lucas precisam explorar o catálogo com busca dominante, comparar ofertas e entender por que um item foi recomendado — sem confundir Patrocinado com selo de confiança.

## Usuário afetado / Personas

- Primária: Beatriz (comparação rápida)
- Contraste: Lucas (validação cuidadosa de selos/TrustScore)

## Jornada

Home → busca → resultados (produto ↔ ofertas) → produto → anúncio.

## Resultado esperado

Home com busca dominante; resultados com filtros/chips, empty state, Patrocinado rotulado; cards ≤3 diferenciais; recomendações com motivo.

## Regras de negócio

```text
BR-01: Produto ≠ Oferta nas rotas e copy
BR-02: Selos só quando concedidos (GRANTED) no mock
BR-03: TrustScore com nível (cartão) / motivos no detalhe
BR-04: Patrocinado sempre rotulado; nunca como selo
BR-05: Recomendações exibem motivo visível
```

## Critérios de aceite

```md
### AC-01 — Home busca dominante

Given Lucas em /
When o viewport carrega
Then a busca é o controle dominante
And há sugestões mock

### AC-02 — Resultados

Given Beatriz em /buscar?q=…
When há resultados
Then pode alternar agrupamento produto ↔ ofertas
And Patrocinado está rotulado

### AC-03 — Empty

Given busca sem hits
When a page renderiza
Then empty state com orientação (não página em branco)
```

## Estados

initial, loading, success, empty, error (mock).

## Fora do escopo

Ads reais, checkout, IA inventando atributos.

## Aprovação

```md
Status: APPROVED
Requirements version: 0.1.0
Approved by: agt-web-product-owner (mock Fase 1)
Date: 2026-08-07
Conditions: mock only
```
