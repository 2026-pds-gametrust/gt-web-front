---
id: SRC-APPLE-HIG-001
title: Apple Human Interface Guidelines — Accessibility & iOS
company: Apple
author: Apple Design
sourceType: normative
authorityLevel: N4
url: https://developer.apple.com/design/human-interface-guidelines/accessibility
publishedAt: 2024-01-01
reviewedAt: 2026-07-16
status: APPROVED_FOR_REFERENCE
language: en
topics:
  - accessibility
  - ios
  - ui-ux
  - platform-guidelines
relevantAgents:
  - agt-accessibility
  - agt-ui-ux-auditor
  - agt-visual-review
  - agt-web-react-developer
---

# Context

Apps iOS precisam respeitar convenções de plataforma (VoiceOver, Dynamic Type, áreas de toque, inclusão).

# Problem

UI “genérica” cross-platform ignora idioms iOS e falha com VoiceOver ou fonte ampliada.

# Decision

A Apple publica HIG com seções de Accessibility, Inclusion, Layout, Typography e controles, como referência normativa de plataforma.

# Alternatives

Ignorar HIG e padronizar só Material; ou copiar apps de outras plataformas.

# Implementation

Usar HIG como checklist de comportamento iOS (toque mínimo ~44pt, Dynamic Type, VoiceOver, redução de movimento).

# Validation

Teste em iOS com VoiceOver e fontes maiores.

# Results

Expectativa de qualidade alinhada à App Store e usuários iOS.

# Trade-offs

Nem todo padrão HIG tem espelho 1:1 em Android; o projeto busca equivalência de intenção (`PRINCIPLE-A11Y-01`).

# Extracted principles

- Controles devem ser utilizáveis com AT do sistema.
- Tipografia e layout devem tolerar tamanho de texto do usuário.

# Context limitations

- Foco em ecossistema Apple.
- RN abstrai parte dos controles nativos.

# Transferable principles

- Área de toque adequada.
- Suporte a texto dinâmico.
- Feedback não só por cor.

# Non-transferable practices

- APIs UIKit literais quando o app usa RN.

# Relationship with this project

## Applicable

- Baseline iOS para a11y e visual review.

## Partially applicable

- Componentes nativos específicos vs. RN.

## Not applicable

- Guidelines exclusivos de AppKit/watchOS sem uso no app.

# Related internal decisions

- KB-DEC-002

# Related playbooks

- playbooks/accessibility-audit.md
- playbooks/ui-ux-audit.md

# Review notes

- Review status: APPROVED_FOR_REFERENCE
- Reviewed by: KB foundation seed
- Conditions: Norma de plataforma iOS.
