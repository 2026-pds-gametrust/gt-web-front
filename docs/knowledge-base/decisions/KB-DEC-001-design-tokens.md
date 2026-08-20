---
id: KB-DEC-001
title: Design tokens via CSS theme
status: APPROVED
date: 2026-07-16
owner: Web Engineering
decisionType: Architecture
topics:
  - design-system
  - tokens
  - web
relevantAgents:
  - agt-web-react-developer
  - agt-visual-review
  - agt-web-architecture
  - agt-code-review
---

# KB-DEC-001 — Design tokens via tema CSS

Status: APPROVED  
Date: 2026-07-16 (adaptado web 2026-08-07; Tailwind v4 2026-08-20)  
Owner: Web Engineering  
Decision type: Architecture

## Context

A identidade visual do frontend-web precisa de uma única fonte de verdade. Valores hardcoded de cor/espaçamento/tipografia fragmentam a UI e dificultam temas e manutenção.

## Decision

Todos os valores visuais reutilizáveis (cores, espaçamento, tipografia, bordas, dimensões, sombras) **devem** ser definidos como tokens CSS custom properties `--gt-*` em `src/06-shared/styles/tokens.css` e expostos ao Tailwind via `@theme`.

Componentes consomem utilities mapeadas ao tema (`bg-accent`, `text-ink`, `font-display`, etc.) ou `cn()` / `cva` com essas utilities. Hardcoded de cor/espaçamento em features/pages é **violação**, salvo exceções de runtime (cálculo dinâmico, animação, valores vindos da API). Classes arbitrárias de identidade (`bg-[#…]`) são proibidas (PRINCIPLE-DS-01).

## Consequences

- `agt-web-react-developer` implementa UI com tokens do tema shared + Tailwind utilities.
- Tailwind CSS v4 (`@tailwindcss/vite`) é a linguagem de estilo canônica; Framer Motion permanece fora.
- Cases externos (Style Dictionary, etc.) informam princípios; a implementação canônica deste repo é o tema em `src/06-shared/styles`.

## Sources

- `PRINCIPLE-DS-01`
- `SRC-IFOOD-TOKENS-001` (referência de mercado)

## Non-goals

- Não define o catálogo completo de tokens nesta decisão.
