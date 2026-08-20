---
id: SRC-NUBANK-MULTI-001
title: Designing a Multi-Product Experience
company: Nubank
author: Nubank Design / Building Nubank
sourceType: official-company-case
authorityLevel: N6
url: https://building.nubank.com.br/designing-a-multi-product-experience/
publishedAt: 2021-01-01
reviewedAt: 2026-07-16
status: APPROVED_FOR_REFERENCE
language: en
topics:
  - ui-ux
  - information-architecture
  - navigation
  - user-research
relevantAgents:
  - agt-ui-ux-auditor
  - agt-user-research
  - agt-persona-simulator
  - agt-web-product-owner
---

# Context

Nubank discute como desenhar experiência multi-produto: IA, navegação, testes com usuários e complexidade organizacional.

# Problem

Estrutura interna da empresa (produtos, times, jargão) vaza para a navegação e confunde o usuário.

# Decision

Tratar arquitetura de informação e navegação como problema de experiência validado com pesquisa, não só organização interna.

# Alternatives

Espelhar org chart na navegação; adicionar produtos sem reorganizar IA.

# Implementation

Redesign/navegação multi-produto com pesquisa (detalhes no artigo).

# Validation

Testes com usuários (relato).

# Results

Critérios para avaliar se a UI reflete o usuário ou o organograma.

# Trade-offs

Escala multi-produto bancária ≠ app com escopo menor.

# Extracted principles

- Não deixar a estrutura interna vazar para a UX.
- Validar navegação com pesquisa/persona, não só com stakeholders.

# Context limitations

- Escala Nubank.
- Contexto financeiro brasileiro específico.

# Transferable principles

- Perguntas de auditoria UX sobre próximo passo e hierarquia.
- Personas como hipótese a validar (`KB-DEC-003`).

# Non-transferable practices

- Copiar tabs/home Nubank.
- Assumir mesmo número de produtos.

# Relationship with this project

## Applicable

- Perguntas para `agt-ui-ux-auditor` e PO.

## Partially applicable

- IA multi-produto avançada.

## Not applicable

- Reorganizar o app só porque Nubank redesenhou home.

# Related internal decisions

- KB-DEC-003

# Related playbooks

- playbooks/ui-ux-audit.md
- playbooks/persona-simulation.md

# Review notes

- Review status: APPROVED_FOR_REFERENCE
- Reviewed by: KB Onda 2
- Conditions: Case — gera perguntas, não regras de navegação.
