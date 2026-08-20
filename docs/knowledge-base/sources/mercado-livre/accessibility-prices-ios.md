---
id: SRC-MELI-A11Y-IOS-001
title: Accessible Prices on iOS within Mercado Libre
company: Mercado Libre
author: Mercado Libre Tech
sourceType: official-company-case
authorityLevel: N6
url: https://medium.com/mercadolibre-tech/accessible-prices-on-ios-within-mercado-libre-7ce5dadcd70e
publishedAt: 2023-01-01
reviewedAt: 2026-07-16
status: APPROVED_FOR_REFERENCE
language: en
topics:
  - accessibility
  - ios
  - voiceover
  - design-system
relevantAgents:
  - agt-accessibility
  - agt-web-react-developer
  - agt-web-qa
---

# Context

Complemento iOS ao trabalho de preços acessíveis: VoiceOver e idioms de plataforma diferem do Android.

# Problem

A mesma intenção de negócio (anunciar preço corretamente) exige implementação e validação distintas no iOS.

# Decision

Documentar aprendizados específicos de VoiceOver para preços acessíveis no ecossistema Melí.

# Alternatives

Reutilizar cegamente a solução Android; ou tratar iOS como afterthought.

# Implementation

Ajustes de acessibilidade no iOS alinhados ao DS (detalhes no artigo).

# Validation

Testes com VoiceOver.

# Results

Evidência de que paridade de intenção ≠ paridade de código.

# Trade-offs

Duplicação de esforço de validação; custo de manter duas trilhas.

# Extracted principles

- Validar AT por plataforma.
- Componente compartilhado ainda precisa de checagem iOS/Android.

# Context limitations

- UIKit/Swift vs React Native.
- Domínio de preços Melí.

# Transferable principles

- `PRINCIPLE-A11Y-01`: PASS em um OS não fecha o outro.
- Semântica de valores críticos na jornada.

# Non-transferable practices

- APIs UIKit literais no app RN.

# Relationship with this project

## Applicable

- Reforça gate a11y dual-platform.

## Partially applicable

- Detalhes de MoneyAmount Melí.

## Not applicable

- Copiar código iOS nativo.

# Related internal decisions

- KB-DEC-002

# Related playbooks

- playbooks/accessibility-audit.md

# Review notes

- Review status: APPROVED_FOR_REFERENCE
- Reviewed by: KB foundation seed
- Conditions: Case — ler em par com a versão Android.
