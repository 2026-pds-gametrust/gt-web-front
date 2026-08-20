# Requirements — ralph-offer-card

Status: APPROVED
Version: 1.0.0
Owner: agt-web-product-owner
Date: 2026-08-19

## Problema

O cartão de oferta é peça central da descoberta (home, busca, produto, anúncio) mas não tinha testes nem garantias visuais de paridade: patrocinado podia confundir-se com selo, stubs de favoritar/comparar pareciam acionáveis e o `<article>` não expunha nome acessível estável.

## Usuário afetado / Personas

- Primária: Beatriz (comparação rápida)
- Contraste: Lucas (validação de selos e TrustScore)

## Jornada

Listagens de ofertas em rails e resultados de busca.

## Resultado esperado

Cartão reutilizável com paridade semântica (Produto ≠ Oferta, selos GRANTED, patrocinado rotulado, TrustScore compacto sem inventar reasons), stubs claramente desabilitados e cobertura de testes.

## Regras de negócio

```text
BR-01: Selos só via SealBadge e apenas tipos concedidos.
BR-02: Patrocinado usa classe offer-card__sponsored, nunca visual de selo.
BR-03: Favoritar/comparar permanecem em breve e disabled.
BR-04: TrustScore compacto não inventa reasons.
```

## Critérios de aceite

```md
### AC-01 — Nome acessível do cartão

Given uma oferta renderizada
When o leitor de tela percorre o cartão
Then o article referencia o título via aria-labelledby

### AC-02 — Patrocinado rotulado

Given document.facets.sponsored === true
When o cartão renderiza
Then exibe "Patrocinado" no topo
And não exibe selos de verificação falsos

### AC-03 — Stubs desabilitados

Given qualquer oferta
When o usuário foca favoritar ou comparar
Then os botões estão disabled com rótulo "(em breve)"

### AC-04 — Regressão automatizada

Given alterações no OfferCard
When yarn test:unit e testes Ralph do loop rodam
Then todos passam
```

## Estados

initial · com thumb · sem thumb · com selos · patrocinado · com reason · com TrustScore

## Não escopo

Página do anúncio, favoritar real, SearchBar, motion global.
