---
id: SRC-MELI-A11Y-PROG-001
title: What We Have Learned from Working on Digital Accessibility
company: Mercado Libre
author: Mercado Libre Tech
sourceType: official-company-case
authorityLevel: N6
url: https://medium.com/mercadolibre-tech/what-we-have-learned-from-working-on-digital-accessibility-954f275fdff3
publishedAt: 2022-01-01
reviewedAt: 2026-07-16
status: APPROVED_FOR_REFERENCE
language: en
topics:
  - accessibility
  - process
  - awareness
  - mobile
relevantAgents:
  - agt-accessibility
  - agt-web-orchestrator
  - agt-web-qa
---

# Context

Mercado Livre descreve aprendizados de um programa de acessibilidade digital (diagnóstico, awareness, execução) cobrindo web e native.

# Problem

Acessibilidade tratada como iniciativa isolada ou só no fim do ciclo gera dívida e exclusão.

# Decision

Operar acessibilidade como capacidade multidisciplinar: diagnóstico, conscientização e execução contínua em web e native.

# Alternatives

Checklist pontual só em release; terceirizar 100% da a11y; só tooling automatizado.

# Implementation

Programa com fases de awareness e execução (detalhes no artigo); conexão com times de produto e engenharia.

# Validation

Relato qualitativo do time; métricas internas não reproduzíveis aqui.

# Results

Aprendizados organizacionais sobre sustentar a11y além de um sprint.

# Trade-offs

Escala Melí e estrutura de squads ≠ st-app-rn; custo de programa dedicado.

# Extracted principles

- A11y precisa de awareness + execução, não só auditoria pontual.
- Web e native exigem trilhas específicas.

# Context limitations

- Organização e escala Melí.
- Não é norma WCAG.

# Transferable principles

- Gate em fluxos críticos (`KB-DEC-002`) como mínimo operacional.
- Envolver múltiplos papéis (UX, QA, engineering).

# Non-transferable practices

- Copiar estrutura orgânica do programa Melí.
- Assumir mesmo headcount/processo.

# Relationship with this project

## Applicable

- Reforça a11y como gate e handoffs entre agents.

## Partially applicable

- Playbooks de awareness corporativo.

## Not applicable

- Criar “time de a11y” só porque Melí tem.

# Related internal decisions

- KB-DEC-002

# Related playbooks

- playbooks/accessibility-audit.md

# Review notes

- Review status: APPROVED_FOR_REFERENCE
- Reviewed by: KB Onda 2
- Conditions: Case — processo; baseline continua WCAG/RN docs.
