# Requirements — ralph-home

Status: APPROVED
Version: 1.0.0
Owner: agt-web-product-owner
Date: 2026-08-19

## Problema

A home redirecionava para `/erro` quando a vitrine falhava, quebrando a busca dominante e a jornada de Beatriz. Loading usava skeleton genérico; vitrine vazia não comunicava estado.

## Usuário afetado / Personas

- Primária: Beatriz (comparação e busca dominante)
- Contraste: Lucas (confiança na vitrine verificada)

## Jornada

Visitante abre `/`, explora rails ou busca.

## Resultado esperado

Hero de busca permanece; erro de feed usa FeedbackBanner com retry na própria home; loading usa skeleton de cards; vitrine vazia usa EmptyState.

## Critérios de aceite

```md
### AC-01 — Erro com retry in-page

Given falha em GET /search na home
When a página renderiza
Then FeedbackBanner de erro aparece
And botão "Tentar de novo" recarrega a vitrine
And o usuário permanece em /

### AC-02 — Skeleton de vitrine

Given carregamento inicial
When feed ainda não chegou
Then skeleton variant card é exibido

### AC-03 — Vitrine vazia

Given feed sem ofertas verificadas nem populares
When loading terminou
Then EmptyState informa ausência de ofertas
```

## Não escopo

Alterar OfferCard, auth, página /buscar completa.
