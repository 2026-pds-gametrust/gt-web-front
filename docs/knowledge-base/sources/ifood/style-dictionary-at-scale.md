---
id: SRC-IFOOD-TOKENS-001
title: Design System — Style Dictionary at scale
company: iFood
author: iFood Tech
sourceType: official-company-case
authorityLevel: N6
url: https://medium.com/ifood-tech/design-system-style-dictionary-at-scale-58d06a5f022a
publishedAt: 2022-01-01
reviewedAt: 2026-07-16
status: APPROVED_FOR_REFERENCE
language: pt
topics:
  - design-system
  - design-tokens
  - design-to-code
relevantAgents:
  - agt-web-architecture
  - agt-web-react-developer
  - agt-visual-review
  - agt-code-review
---

# Context

iFood precisava escalar tokens de Design System entre design e múltiplas plataformas/código.

# Problem

Inconsistência visual e custo alto de sincronizar valores entre design e engenharia em escala.

# Decision

Usar Style Dictionary (e práticas de tokens) para governar design-to-code em escala.

# Alternatives

Tokens manuais por plataforma; ou CSS/Tailwind sem pipeline de tokens.

# Implementation

Pipeline de tokens (Style Dictionary) alimentando artefatos de código (detalhes no artigo).

# Validation

Relato de escala e governança no DS iFood.

# Results

Tokens como fonte central reduzem drift visual.

# Trade-offs

Pipeline de tokens adiciona tooling e processo; nem todo time precisa do mesmo nível de escala.

# Extracted principles

- Valores reutilizáveis precisam de fonte central.
- Design-to-code exige governança, não só boa vontade.

# Context limitations

- Escala iFood.
- Tooling Style Dictionary ≠ Tailwind theme do st-app-rn.
- Não obriga adotar Style Dictionary aqui.

# Transferable principles

- Centralizar identidade visual (`PRINCIPLE-DS-01` / `KB-DEC-001`).
- Evitar hardcoded.

# Non-transferable practices

- Adotar Style Dictionary automaticamente.
- Estrutura orgânica/times do iFood.

# Relationship with this project

## Applicable

- Princípio de tokens centrais → tema Tailwind.

## Partially applicable

- Pipeline multi-plataforma em escala.

## Not applicable

- Substituir Tailwind por Style Dictionary sem decisão interna nova.

# Related internal decisions

- KB-DEC-001

# Related playbooks

- (visual review via agent/skill; sem playbook dedicado nesta fundação)

# Review notes

- Review status: APPROVED_FOR_REFERENCE
- Reviewed by: KB foundation seed
- Conditions: Case — princípio transferível; implementação canônica = Tailwind (`KB-DEC-001`).
