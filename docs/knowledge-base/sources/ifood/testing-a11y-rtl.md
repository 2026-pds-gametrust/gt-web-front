---
id: SRC-IFOOD-A11Y-TEST-001
title: Testing Components and Accessibility with React Testing Library
company: iFood
author: iFood Engineering
sourceType: official-company-case
authorityLevel: N6
url: https://medium.com/ifood-engineering/testing-components-and-accessibility-with-react-testing-library-26935374e437
publishedAt: 2022-01-01
reviewedAt: 2026-07-16
status: APPROVED_FOR_REFERENCE
language: en
topics:
  - testing
  - accessibility
  - react-testing-library
  - quality-assurance
relevantAgents:
  - agt-web-qa
  - agt-web-react-developer
  - agt-code-review
  - agt-accessibility
---

# Context

iFood relata práticas de testar componentes com foco em comportamento e acessibilidade via React Testing Library (queries por role, async, mocks).

# Problem

Testes acoplados a implementação e ignorando semântica acessível falham em detectar regressões reais para usuários e AT.

# Decision

Priorizar testes por comportamento e queries alinhadas a papéis acessíveis (role/label), com async e mocks conscientes.

# Alternatives

Só Enzyme/snapshots; só E2E; ignorar a11y nos unit tests.

# Implementation

RTL + padrões de query (detalhes no artigo). No mobile RN, o ecossistema equivalente (ex.: RNTL) deve ser o do projeto — não copiar setup web.

# Validation

Suíte de testes do time iFood (relato).

# Results

Testes mais próximos da experiência do usuário e da a11y.

# Trade-offs

Artigo centrado em web React; adaptação necessária para RN.

# Extracted principles

- Query por papel/nome acessível > por seletor frágil.
- A11y e testes se reforçam mutuamente.

# Context limitations

- Stack web RTL vs React Native Testing Library.
- Setup iFood ≠ Jest config deste repo.

# Transferable principles

- Preferir asserts semânticos.
- Incluir casos a11y nos testes de componente quando fizer sentido.

# Non-transferable practices

- Copiar tooling web literalmente para RN sem adaptação.
- Substituir política FSD de testes do repo.

# Relationship with this project

## Applicable

- Inspirar AUTOMATE do QA e revisão de testes fracos.

## Partially applicable

- Exemplos DOM/HTML.

## Not applicable

- Trocar convenções `describe`/`it` do st-app-rn.

# Related internal decisions

- KB-DEC-002

# Related playbooks

- playbooks/critical-journey-review.md
- playbooks/accessibility-audit.md

# Review notes

- Review status: APPROVED_FOR_REFERENCE
- Reviewed by: KB Onda 2
- Conditions: Case — princípios de teste; norma de colocação = AGENTS.md §4 / FSD §11.
