---
id: SRC-IFOOD-A11Y-IOS-001
title: Ta(l)king a Big Step — iOS accessibility
company: iFood
author: iFood Engineering
sourceType: official-company-case
authorityLevel: N6
url: https://medium.com/ifood-engineering/ta-l-king-a-big-step-2d260b7179e2
publishedAt: 2021-01-01
reviewedAt: 2026-07-16
status: APPROVED_FOR_REFERENCE
language: en
topics:
  - accessibility
  - ios
  - voiceover
  - critical-journey
relevantAgents:
  - agt-accessibility
  - agt-web-qa
  - agt-persona-simulator
---

# Context

iFood descreve avanços de acessibilidade iOS (VoiceOver) em catálogo, navegação e jornada de compra.

# Problem

Jornadas de compra inacessíveis no iOS excluem usuários e passam despercebidas sem validação com VoiceOver.

# Decision

Investir em a11y iOS na jornada crítica de compra, com atenção a navegação e catálogo.

# Alternatives

Priorizar só Android; só checklist estático; adiar a11y pós-MVP indefinidamente.

# Implementation

Melhorias de acessibilidade na jornada iOS (detalhes no artigo).

# Validation

Uso com VoiceOver / relato de engenharia.

# Results

Evidência de que jornada crítica + AT é investimento de produto, não só compliance.

# Trade-offs

App iOS nativo iFood ≠ RN; domínio food delivery.

# Extracted principles

- Validar jornadas críticas com leitor de tela da plataforma.
- Catálogo/navegação são pontos frequentes de falha.

# Context limitations

- UIKit/Swift vs RN.
- Escala iFood.

# Transferable principles

- Gate a11y em auth/cadastro/jornadas críticas (`KB-DEC-002`).
- Persona baixa visão + EXPLORATORY QA.

# Non-transferable practices

- APIs iOS nativas literais.
- Escopo “compra food” como se fosse o domínio Sauvvitech.

# Relationship with this project

## Applicable

- Exemplos para auditoria VoiceOver e jornadas.

## Partially applicable

- Padrões de catálogo/listagem.

## Not applicable

- Copiar app nativo iFood.

# Related internal decisions

- KB-DEC-002

# Related playbooks

- playbooks/accessibility-audit.md
- playbooks/critical-journey-review.md

# Review notes

- Review status: APPROVED_FOR_REFERENCE
- Reviewed by: KB Onda 2
- Conditions: Case iOS — complementar a normas HIG/RN.
