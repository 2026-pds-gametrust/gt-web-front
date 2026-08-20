---
id: SRC-MATERIAL-001
title: Material Design 3 — Foundations and Accessibility
company: Google
author: Material Design
sourceType: normative
authorityLevel: N4
url: https://m3.material.io/
publishedAt: 2024-01-01
reviewedAt: 2026-07-16
status: APPROVED_FOR_REFERENCE
language: en
topics:
  - accessibility
  - android
  - ui-ux
  - design-system
  - platform-guidelines
relevantAgents:
  - agt-accessibility
  - agt-ui-ux-auditor
  - agt-visual-review
  - agt-web-react-developer
---

# Context

Apps Android se beneficiam de fundamentos Material (estrutura, alvos de toque, escrita, acessibilidade) mesmo quando usam Design System próprio.

# Problem

Interfaces inconsistentes em densidade, alvos de toque e hierarquia em Android.

# Decision

Material Design 3 documenta foundations (estrutura, elementos, writing, accessibility principles) como referência normativa Android/Google.

# Alternatives

Ignorar Material e espelhar só iOS; ou adotar Material Components nativos sem tokens do projeto.

# Implementation

Usar como baseline de alvos de toque (~48dp), labels, hierarquia e princípios de acessibilidade; identidade visual continua no tema Tailwind (`KB-DEC-001`).

# Validation

Teste em Android com TalkBack e fontes ampliadas.

# Results

Expectativa de usabilidade alinhada ao ecossistema Android.

# Trade-offs

Material não define o branding Sauvvitech; tokens do projeto têm precedência visual.

# Extracted principles

- Alvos de toque generosos.
- Labels claros em elementos.
- Sistema de tipografia e espaçamento coerente.

# Context limitations

- Muitos exemplos são Compose/Android Views.
- Não substitui FSD nem tema Tailwind.

# Transferable principles

- Touch targets e densidade.
- Writing guidance de alto nível.

# Non-transferable practices

- Adotar paleta Material em vez do Design System interno.
- Bibliotecas Material Android puras como padrão RN.

# Relationship with this project

## Applicable

- Baseline Android para a11y/UX.

## Partially applicable

- Componentes Material literais.

## Not applicable

- Substituir tokens internos por tema Material padrão.

# Related internal decisions

- KB-DEC-001
- KB-DEC-002

# Related playbooks

- playbooks/ui-ux-audit.md
- playbooks/accessibility-audit.md

# Review notes

- Review status: APPROVED_FOR_REFERENCE
- Reviewed by: KB foundation seed
- Conditions: Norma de plataforma Android; DS interno vence em branding.
