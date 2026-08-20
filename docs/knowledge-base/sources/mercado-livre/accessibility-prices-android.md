---
id: SRC-MELI-A11Y-ANDROID-001
title: Accessibility in Prices — Android perspective
company: Mercado Libre
author: Mercado Libre Tech
sourceType: official-company-case
authorityLevel: N6
url: https://medium.com/mercadolibre-tech/accessibility-in-prices-our-learning-from-the-android-perspective-7032e81e11d7
publishedAt: 2023-01-01
reviewedAt: 2026-07-16
status: APPROVED_FOR_REFERENCE
language: en
topics:
  - accessibility
  - android
  - talkback
  - design-system
relevantAgents:
  - agt-accessibility
  - agt-web-react-developer
  - agt-web-qa
---

# Context

Mercado Livre precisava tornar a verbalização de preços correta e útil com TalkBack, em um Design System compartilhado.

# Problem

Preços e valores monetários mal anunciados por leitores de tela geram confusão e exclusão.

# Decision

Tratar acessibilidade de preços como problema de componente/semântica no Android, com aprendizados específicos de TalkBack.

# Alternatives

Depender só do texto visual; ou soluções ad hoc por tela.

# Implementation

Ajustes de semântica e componentes (detalhes no artigo); integração com DS.

# Validation

Validação com TalkBack e critérios de verbalização.

# Results

Aprendizados reutilizáveis sobre MoneyAmount / preços acessíveis no Android.

# Trade-offs

Solução Android não se copia literalmente para iOS; exige trabalho paralelo (`SRC-MELI-A11Y-IOS-001`).

# Extracted principles

- Conteúdo crítico (preço) precisa de semântica explícita para AT.
- Design System é o lugar certo para corrigir a11y transversal.

# Context limitations

- Stack Android nativa ≠ React Native.
- Domínio marketplace/preço pode diferir do produto Sauvvitech.

# Transferable principles

- Validar verbalização de valores e estados, não só presença de label.
- Corrigir no componente compartilhado quando o problema é transversal.

# Non-transferable practices

- APIs Android Views literais.
- Assumir que o mesmo ajuste resolve VoiceOver.

# Relationship with this project

## Applicable

- Exemplos práticos para gate a11y e paridade de plataforma.

## Partially applicable

- Componente de preço específico do Melí.

## Not applicable

- Copiar implementação nativa Android.

# Related internal decisions

- KB-DEC-002

# Related playbooks

- playbooks/accessibility-audit.md

# Review notes

- Review status: APPROVED_FOR_REFERENCE
- Reviewed by: KB foundation seed
- Conditions: Case — exemplo prático; norma continua WCAG/RN docs.
