---
id: SRC-RN-A11Y-001
title: React Native Accessibility
company: Meta / React Native
author: React Native Documentation
sourceType: official-technology
authorityLevel: N5
url: https://reactnative.dev/docs/accessibility
publishedAt: 2024-01-01
reviewedAt: 2026-07-16
status: APPROVED_FOR_REFERENCE
language: en
topics:
  - accessibility
  - react-native
  - mobile
relevantAgents:
  - agt-accessibility
  - agt-web-react-developer
  - agt-web-qa
  - agt-code-review
---

# Context

Desenvolvedores React Native precisam mapear requisitos de acessibilidade para APIs de componentes cross-platform.

# Problem

Sem documentação oficial, times misturam props web, padrões Android e iOS de forma inconsistente.

# Decision

A documentação oficial descreve props e padrões (`accessibilityLabel`, `accessibilityRole`, `accessibilityHint`, `accessible`, `AccessibilityInfo`, etc.) e diferenças relevantes entre plataformas.

# Alternatives

Copiar padrões só de Android ou só de iOS; usar libs sem entender a API base.

# Implementation

Aplicar props nos elementos interativos; gerenciar foco e anúncios; testar com TalkBack/VoiceOver.

# Validation

Teste em dispositivo/emulador com AT; docs oficiais não substituem evidência em runtime.

# Results

API canônica para implementação no st-app-rn.

# Trade-offs

Paridade perfeita entre plataformas não é automática; algumas APIs são platform-specific.

# Extracted principles

- Semântica acessível é responsabilidade do componente.
- Label + role + hint cobrem a maior parte dos controles.

# Context limitations

- Versão da docs deve ser revisada em upgrades do RN.
- Não cobre design de copy ou jornada.

# Transferable principles

- Todo controle interativo precisa de nome acessível.
- Agrupar ou expor hierarquia de leitura de forma consciente.

# Non-transferable practices

- Assumir que prop web (`aria-*`) funciona igual em RN.

# Relationship with this project

## Applicable

- Baseline de implementação para Developer e Accessibility.

## Partially applicable

- Exemplos de versões antigas do RN — validar contra SDK atual.

## Not applicable

- Padrões de navegação web.

# Related internal decisions

- KB-DEC-002

# Related playbooks

- playbooks/accessibility-audit.md

# Review notes

- Review status: APPROVED_FOR_REFERENCE
- Reviewed by: KB foundation seed
- Conditions: Documentação oficial da stack — priorizar sobre cases.
