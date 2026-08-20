---
id: SRC-NUBANK-001
title: Design Principles at Nubank
company: Nubank
author: Nubank Design / Building Nubank
sourceType: official-company-case
authorityLevel: N6
url: https://building.nubank.com.br/design-principles-at-nubank/
publishedAt: 2021-01-01
reviewedAt: 2026-07-16
status: APPROVED_FOR_REFERENCE
language: en
topics:
  - ui-ux
  - design-principles
  - accessibility
  - consistency
relevantAgents:
  - agt-ui-ux-auditor
  - agt-web-product-owner
  - agt-visual-review
---

# Context

Nubank precisava alinhar decisões de design em escala com princípios compartilhados (consistência, acessibilidade, velocidade, adaptabilidade).

# Problem

Decisões de UI/UX subjetivas e inconsistentes entre produtos e times.

# Decision

Publicar e operar com princípios de design explícitos que orientam trade-offs do dia a dia.

# Alternatives

Guidelines só por componente; ou decisões ad hoc por squad.

# Implementation

Princípios usados como linguagem comum entre design e engenharia (detalhes no artigo).

# Validation

Relato qualitativo do time; métricas internas não reproduzíveis aqui.

# Results

Critérios menos subjetivos para avaliar experiências.

# Trade-offs

Princípios genéricos precisam de interpretação no contexto de cada produto; escala Nubank ≠ escala deste app.

# Extracted principles

- Consistência reduz carga cognitiva.
- Acessibilidade faz parte dos princípios de design, não é apêndice.
- Velocidade e adaptabilidade exigem trade-offs explícitos.

# Context limitations

- Escala e estrutura organizacional diferentes.
- Stack e Design System diferentes.
- Artigo não é norma WCAG.

# Transferable principles

- Explicitar princípios reduz subjetividade em auditorias UX.
- Incluir a11y nos critérios de qualidade de design.

# Non-transferable practices

- Copiar o wording ou framework interno do Nubank como regra Sauvvitech.
- Assumir mesma maturidade de research/ops.

# Relationship with this project

## Applicable

- Inspirar critérios de `agt-ui-ux-auditor` e PO (perguntas, não regras).

## Partially applicable

- Princípios de multi-produto em escala bancária.

## Not applicable

- Processos orgânicos internos do Nubank.

# Related internal decisions

- KB-DEC-001
- KB-DEC-002

# Related playbooks

- playbooks/ui-ux-audit.md

# Review notes

- Review status: APPROVED_FOR_REFERENCE
- Reviewed by: KB foundation seed
- Conditions: Case N6 — usar como referência; nunca como regra automática.
