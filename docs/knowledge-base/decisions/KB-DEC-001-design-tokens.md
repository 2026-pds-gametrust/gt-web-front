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
Date: 2026-07-16 (adaptado web 2026-08-07)  
Owner: Web Engineering  
Decision type: Architecture

## Context

A identidade visual do frontend-web precisa de uma única fonte de verdade. Valores hardcoded de cor/espaçamento/tipografia fragmentam a UI e dificultam temas e manutenção.

## Decision

Todos os valores visuais reutilizáveis (cores, espaçamento, tipografia, bordas, dimensões, sombras) **devem** ser definidos como tokens (CSS custom properties / tema em `06-shared`) e consumidos pelos componentes.

Hardcoded de cor/espaçamento em features/pages é **violação**, salvo exceções de runtime (cálculo dinâmico, animação, valores vindos da API).

## Consequences

- `agt-web-react-developer` implementa UI com tokens do tema shared.
- Cases externos (Style Dictionary, etc.) informam princípios; a implementação canônica deste repo é o tema em `src/06-shared`.
- Tailwind (ou outra lib) só entra se adotado explicitamente no tema — não é norma por si só.

## Sources

- `PRINCIPLE-DS-01`
- `SRC-IFOOD-TOKENS-001` (referência de mercado)

## Non-goals

- Não define o catálogo completo de tokens nesta decisão.
