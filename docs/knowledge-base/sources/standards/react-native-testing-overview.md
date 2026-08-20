---
id: SRC-RN-TEST-001
title: React Native Testing Overview
company: Meta / React Native
author: React Native Documentation
sourceType: official-technology
authorityLevel: N5
url: https://reactnative.dev/docs/testing-overview
publishedAt: 2024-01-01
reviewedAt: 2026-07-16
status: APPROVED_FOR_REFERENCE
language: en
topics:
  - testing
  - react-native
  - quality-assurance
relevantAgents:
  - agt-web-qa
  - agt-web-react-developer
  - agt-code-review
---

# Context

Times React Native precisam de uma visão oficial de como testar componentes e lógica sem depender só de E2E manual.

# Problem

Estratégias de teste fragmentadas (só snapshot, só E2E, mocks inconsistentes) aumentam flakiness e baixa confiança no merge.

# Decision

A documentação oficial descreve overview de testing no ecossistema RN (unit/component, mocking, ferramentas típicas do ecossistema).

# Alternatives

Só QA manual; só Detox/Maestro sem unit; copiar padrões web sem adaptação.

# Implementation

Usar docs oficiais como referência de APIs e abordagem; no st-app-rn a norma de colocação e estilo de teste continua em `AGENTS.md` / FSD §11 (`*.test` co-localizado, `*.spec` em `__tests__/`, um `it` por `describe`).

# Validation

Execução local/CI (`yarn test:unit`, `yarn test:integration`, coverage).

# Results

Baseline técnico para AUTOMATE/VERIFY do QA.

# Trade-offs

Docs genéricas do ecossistema não definem a política FSD do projeto.

# Extracted principles

- Testar comportamento, não só snapshots frágeis.
- Isolar dependências externas (rede, auth) nos testes.

# Context limitations

- Versão das docs muda com o RN; revisar em upgrades.
- E2E do st-app-rn ainda “quando disponível”.

# Transferable principles

- Pirâmide de testes com mocks no limite de API.
- Preferir queries/semântica acessível quando aplicável (alinhar a a11y).

# Non-transferable practices

- Substituir convenções `When...` / `should...` do repo pelas do tutorial oficial.

# Relationship with this project

## Applicable

- Fundamenta skill `mobile-quality-assurance` e modos AUTOMATE/VERIFY.

## Partially applicable

- Exemplos de tooling específicos que o projeto não usa.

## Not applicable

- Ignorar FSD §11 / meta de coverage ≥80%.

# Related internal decisions

- KB-DEC-002 (a11y em fluxos críticos também entra no plano de testes)

# Related playbooks

- playbooks/critical-journey-review.md

# Review notes

- Review status: APPROVED_FOR_REFERENCE
- Reviewed by: KB Onda 2
- Conditions: Documentação oficial. Nota: New Architecture (https://reactnative.dev/blog/2025/10/08/react-native-0.82) — acompanhar em upgrades; **não** é ficha separada nesta onda.
