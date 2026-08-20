---
id: SRC-IFOOD-CAR-001
title: Ordering an iFood from Your Car
company: iFood
author: iFood Engineering
sourceType: official-company-case
authorityLevel: N6
url: https://medium.com/ifood-engineering/ordering-ifood-from-your-car-f0e3ae8e9af0
publishedAt: 2021-01-01
reviewedAt: 2026-07-16
status: APPROVED_FOR_REFERENCE
language: en
topics:
  - ui-ux
  - context-of-use
  - accessibility
  - personas
relevantAgents:
  - agt-persona-simulator
  - agt-ui-ux-auditor
  - agt-accessibility
---

# Context

iFood explora pedido no contexto “do carro”: botões grandes, textos curtos, teclado e segurança/contexto de uso.

# Problem

UI desenhada só para uso sentado/casa falha em contextos com atenção dividida, uma mão ou restrição de tempo.

# Decision

Adaptar UI a contexto de uso exigente (alvos grandes, copy curta, cuidado com teclado/interação).

# Alternatives

Mesma UI para todos os contextos; feature só desktop/web.

# Implementation

Ajustes de UI/interação para contexto carro (detalhes no artigo).

# Validation

Relato de produto/engenharia.

# Results

Exemplo forte de design sensível a contexto.

# Trade-offs

Contexto “carro” pode não existir no produto Sauvvitech; princípios de atenção dividida sim.

# Extracted principles

- Contexto de uso muda tamanho de alvo, copy e tolerância a fricção.
- Teclado e CTA precisam sobreviver a condições adversas.

# Context limitations

- Domínio food delivery / carro.
- Não é norma de trânsito/legal.

# Transferable principles

- Personas `joao-pratico` / uso com uma mão; alvos de toque; textos curtos.
- Checklist UX: teclado cobrindo CTA, hierarquia clara.

# Non-transferable practices

- Feature “pedir do carro” literal.
- Assumir mesmo cenário de segurança viária.

# Relationship with this project

## Applicable

- Simulação de persona e auditoria de formulários/CTA.

## Partially applicable

- Modos de atenção dividida genéricos.

## Not applicable

- Copiar fluxo iFood Car.

# Related internal decisions

- KB-DEC-003
- PRINCIPLE-UX-01

# Related playbooks

- playbooks/persona-simulation.md
- playbooks/ui-ux-audit.md

# Review notes

- Review status: APPROVED_FOR_REFERENCE
- Reviewed by: KB Onda 2
- Conditions: Case de contexto — mapear a personas internas, não ao cenário carro.
