---
id: SRC-W3C-001
title: W3C/WAI Mobile Accessibility and WCAG
company: W3C / WAI
author: W3C Web Accessibility Initiative
sourceType: normative
authorityLevel: N4
url: https://www.w3.org/WAI/standards-guidelines/mobile/
publishedAt: 2024-01-01
reviewedAt: 2026-07-16
status: APPROVED_FOR_REFERENCE
language: en
topics:
  - accessibility
  - mobile
  - wcag
relevantAgents:
  - agt-accessibility
  - agt-web-qa
  - agt-ui-ux-auditor
  - agt-web-react-developer
---

# Context

Equipes mobile precisam de critérios estáveis para tornar conteúdo e controles utilizáveis em dispositivos móveis, incluindo tecnologias assistivas.

# Problem

Aplicativos e sites mobile frequentemente falham em contraste, área de toque, orientação, zoom, labels e compatibilidade com leitores de tela.

# Decision

A WAI publica orientações de Mobile Accessibility e o WCAG como padrão de referência para acessibilidade web/conteúdo digital, com extensões e notas para mobile (incl. WCAG2Mobile).

# Alternatives

Guias proprietários isolados por plataforma sem alinhamento a WCAG.

# Implementation

Usar WCAG como baseline de princípios (perceivable, operable, understandable, robust) e as páginas Mobile Accessibility / WCAG2Mobile para nuances de toque, gestos e viewport.

# Validation

Conformidade é avaliada por auditoria humana + ferramentas; WCAG não substitui teste com leitores de tela nativos.

# Results

Baseline internacional compartilhado por mercado e reguladores.

# Trade-offs

WCAG nasceu no contexto web; mapeamento para React Native exige tradução para props nativas (`accessibilityLabel`, roles, foco).

# Extracted principles

- Conteúdo deve ser percebido, operável e compreensível com AT.
- Critérios estáveis permitem quality gates.

# Context limitations

- Não é API React Native.
- Níveis A/AA/AAA precisam ser escolhidos pelo projeto.

# Transferable principles

- Labels e nomes acessíveis.
- Contraste e não depender só de cor.
- Alvos de toque adequados.
- Erros compreensíveis e recuperáveis.

# Non-transferable practices

- Checklists HTML/ARIA literais sem adaptação a componentes RN.

# Relationship with this project

## Applicable

- Fundamenta `KB-DEC-002` e checklists de `agt-accessibility`.

## Partially applicable

- Critérios de markup web → traduzir para RN.

## Not applicable

- Técnicas exclusivamente HTML sem equivalente nativo.

# Related internal decisions

- KB-DEC-002

# Related playbooks

- playbooks/accessibility-audit.md

# Review notes

- Review status: APPROVED_FOR_REFERENCE
- Reviewed by: KB foundation seed
- Conditions: Norma — priorizar sobre cases de mercado.
