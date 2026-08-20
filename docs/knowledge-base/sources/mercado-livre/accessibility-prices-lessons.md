---
id: SRC-MELI-A11Y-LESSONS-001
title: Lessons Learned When Developing Accessibility in Prices
company: Mercado Libre
author: Mercado Libre Tech
sourceType: official-company-case
authorityLevel: N6
url: https://medium.com/mercadolibre-tech/lessons-learned-when-developing-accessibility-in-prices-at-mercado-libre-59fd62fe85cb
publishedAt: 2023-01-01
reviewedAt: 2026-07-16
status: APPROVED_FOR_REFERENCE
language: en
topics:
  - accessibility
  - screen-readers
  - design-system
  - validation
relevantAgents:
  - agt-accessibility
  - agt-ui-ux-auditor
  - agt-web-qa
---

# Context

Síntese transversal dos aprendizados Melí sobre preços acessíveis (screen readers, verbalização, componente MoneyAmount, validação técnica), complementar às fichas Android/iOS.

# Problem

Corrigir a11y de preço só em uma plataforma ou só visualmente deixa gaps de verbalização e regressão.

# Decision

Tratar preços acessíveis como problema de componente + validação técnica com leitores de tela, com lições unificadas após o trabalho Android/iOS.

# Alternatives

Patches por tela; confiar só em testes unitários sem AT.

# Implementation

Componente compartilhado + validação com screen readers (detalhes no artigo).

# Validation

Validação técnica com AT; lições documentadas.

# Results

Fecha o “trio” Melí preços (Android + iOS + lessons).

# Trade-offs

Domínio marketplace/preço; stack nativa ≠ RN.

# Extracted principles

- Verbalização de valores críticos deve ser testada, não assumida.
- Correção no DS/componente compartilhado reduz regressão.

# Context limitations

- MoneyAmount Melí.
- APIs nativas.

# Transferable principles

- Incluir verbalização de valores/erros no checklist a11y.
- Paridade de intenção Android/iOS (`PRINCIPLE-A11Y-01`).

# Non-transferable practices

- Copiar MoneyAmount literalmente.

# Relationship with this project

## Applicable

- Exemplos para `agt-accessibility` / digest de paridade.

## Partially applicable

- Domínio de preço específico.

## Not applicable

- Código nativo Melí.

# Related internal decisions

- KB-DEC-002

# Related playbooks

- playbooks/accessibility-audit.md

# Review notes

- Review status: APPROVED_FOR_REFERENCE
- Reviewed by: KB Onda 2
- Conditions: Ler com `SRC-MELI-A11Y-ANDROID-001` e `SRC-MELI-A11Y-IOS-001`.
