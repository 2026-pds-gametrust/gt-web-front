---
id: PRINCIPLE-DS-01
title: Centralização da identidade visual
status: APPROVED
version: 1.0.0
owner: Mobile Engineering
topics:
  - design-system
  - design-tokens
relevantAgents:
  - agt-visual-review
  - agt-web-react-developer
  - agt-code-review
  - agt-ui-ux-auditor
approvedAt: 2026-07-16
---

# PRINCIPLE-DS-01 — Centralização da identidade visual

Status: APPROVED

## Statement

Todos os valores visuais reutilizáveis devem vir do Design System (tema Tailwind do projeto).

## Evidence

- `AGENTS.md` §6
- `KB-DEC-001`
- `SRC-IFOOD-TOKENS-001` (princípio transferível: tokens centralizados)

## Implications

- Cores, espaçamentos e tipografia hardcoded são proibidos no caminho feliz.
- Classes Tailwind arbitrárias (`bg-[#...]`) são proibidas para identidade visual.
- Exceções de runtime precisam de justificativa (animação, layout dinâmico, API nativa).

## Exceptions

Ver `AGENTS.md` §6 — Allowed Exceptions.

## Related decisions

- `KB-DEC-001`
