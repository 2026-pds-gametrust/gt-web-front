---
id: KB-DEC-003
title: Personas as hypotheses
status: APPROVED
date: 2026-07-16
owner: Mobile Product
decisionType: Research
topics:
  - user-research
  - personas
  - validation
relevantAgents:
  - agt-persona-simulator
  - agt-user-research
  - agt-web-product-owner
  - agt-ui-ux-auditor
---

# KB-DEC-003 — Personas como hipóteses

Status: APPROVED  
Date: 2026-07-16  
Owner: Mobile Product  
Decision type: Research

## Context

O repositório mantém personas em `docs/personas/` para orientar UI/UX, PO e QA. Sem disciplina, agents e times podem tratar hipóteses como fatos validados ou estereotipar usuários reais.

## Decision

Personas em `docs/personas/` **orientam** simulação e avaliação. Enquanto o status for `Draft` / evidence level `Hypothesis`, **não** comprovam usabilidade nem substituem analytics, suporte, entrevistas ou testes com usuários reais.

Agents devem:

1. Seguir as `Behavioral rules for simulation` do arquivo da persona.
2. Registrar limitações da simulação no artefato.
3. Marcar recomendações fortes apenas quando houver evidência interna adicional.
4. Não mover personas para `docs/knowledge-base/` nesta fase — paths canônicos permanecem em `docs/personas/`.

## Consequences

- `agt-persona-simulator` produz `persona-review.md` com fricções e limitações explícitas.
- `agt-user-research` diferencia evidência, hipótese, interpretação e decisão.
- Decisões de produto relevantes devem buscar validação real quando possível (`PRINCIPLE-RESEARCH-01`).

## Sources

- `PRINCIPLE-RESEARCH-01`
- `docs/personas/` (template + personas seed)
- `guia-base-conhecimento-agents-mobile-ui-ux.md` §3.5

## Non-goals

- Não cria processo de pesquisa de campo nesta decisão.
- Não invalida o uso de personas na esteira de agents.
