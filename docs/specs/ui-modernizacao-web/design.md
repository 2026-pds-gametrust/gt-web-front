# Technical Design — ui-modernizacao-web

Status: APPROVED
Version: 1.0.0
Owner: agt-web-architecture
Requirements version: 1.0.0
Date: 2026-08-19

## Mapa FSD

```text
Page:      src/02-pages/{home,search,product,listing,sell,favorites,profile,moderation,admin,auth,em-breve}
Widgets:   src/03-widgets/{offer-card,offer-rail,app-shell,search-bar,trust-strip,category-shortcuts,listing-media,moderation}
Features:  sem nova feature; reuso de search/listings/auth
Entities:  SealBadge, TrustScoreSummary inalterados semanticamente
Shared:    src/06-shared/ui/{page-hero,empty-state,skeleton,form-field,feedback-banner,button}
           src/06-shared/styles/{index.css,tokens.css,base.css,motion.css}
           src/06-shared/lib/cn.ts
```

## Navegação

Rotas existentes em `app-router.tsx`. Sem novas rotas nesta fatia (auth sucesso já existe).

## Ownership do estado

Nenhuma store nova. Pages continuam com estado local / stores de feature.

## Integração com API

Sem novos endpoints. Erros HTTP mapeados para banner, não para copy de domínio inventada.

## Estados e resiliência

- Loading: `Skeleton` (block/card/page)
- Erro / retry: `FeedbackBanner` + callback
- Vazio: `EmptyState`
- Offline: mesma copy de rede já usada em auth quando aplicável
- Timeout: tratado como erro de carga
- Risco de duplicação: n/a
- Persistência local: n/a

## Layout responsivo

`--gt-max: 1280px`. Motion só `transform`/`opacity`. Alvos ≥40–44px nos chips/nav.

## Acessibilidade técnica

- `role="alert"` erro, `role="status"` sucesso
- `aria-busy` em skeletons (`aria-hidden` no visual, texto sr-only quando necessário)
- `prefers-reduced-motion` em `motion.css`

## Analytics / Observabilidade

Sem novos eventos PII.

## Paridade com iOS/Android

Idêntico: selos, TrustScore, ordem do anúncio, Produto ≠ Oferta.
Adapta: HTML/CSS, hover, rails horizontais no web.

## Estratégia de teste

- Unit: PageHero, EmptyState, Skeleton
- Integration: auth permanece; home loading/error já coberto
- Manual: reduced-motion, contraste header

## Rollout

Deploy web padrão. Rollback = revert do CSS/componentes.

## Knowledge sources used

- Internal decision: KB-DEC-001 tokens CSS + Tailwind `@theme`
- Principle: FSD import só para baixo; PRINCIPLE-DS-01 (sem cor hardcoded)
- Architecture docs: ARCHITECTURE.md §9 Estilos, AGENTS.md
- Market case (reference only): hover lift de marketplace
- Limitation: sem Framer Motion; motion só CSS / keyframes
