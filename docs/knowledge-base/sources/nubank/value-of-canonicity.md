---
id: SRC-NUBANK-CANON-001
title: The Value of Canonicity
company: Nubank
author: Nubank Engineering / Building Nubank
sourceType: official-company-case
authorityLevel: N6
url: https://building.nubank.com.br/the-value-of-canonicity/
publishedAt: 2022-01-01
reviewedAt: 2026-07-16
status: APPROVED_FOR_REFERENCE
language: en
topics:
  - mobile-architecture
  - paved-road
  - standardization
  - technology-strategy
relevantAgents:
  - agt-web-architecture
  - agt-web-react-developer
  - agt-code-review
---

# Context

Nubank discute o valor da “canonicidade”: paved road, redução de fragmentação tecnológica (incluindo menções a React Native e Flutter) e padronização.

# Problem

Múltiplas stacks e padrões locais aumentam custo de onboarding, tooling e inconsistência.

# Decision

Valorizar caminhos canônicos (paved road) para reduzir fragmentação e acelerar times.

# Alternatives

Liberdade total de stack por squad; proliferação de frameworks.

# Implementation

Diretrizes de plataforma e canonicidade (detalhes no artigo). No st-app-rn o paved road já é **React Native + TypeScript + FSD + Tailwind**.

# Validation

Relato estratégico Nubank.

# Results

Princípio de paved road transferível; escolha Flutter do Nubank **não** é.

# Trade-offs

Canonicidade demais pode travar inovação pontual; exige governança.

# Extracted principles

- Preferir um caminho padrão bem suportado.
- Fragmentação tem custo oculto alto.

# Context limitations

- Decisão Flutter/RN do Nubank é do contexto deles.
- Escala e plataforma interna diferentes.

# Transferable principles

- Paved road = FSD + convenções do repo (`docs/arquitetura-camadas-fsd.md`, `AGENTS.md`).
- Code review deve rejeitar “stack paralela” sem decisão interna.

# Non-transferable practices

- Migrar para Flutter.
- Copiar tooling interno Nubank.
- Usar o artigo para justificar deep imports ou violar FSD.

# Relationship with this project

## Applicable

- Reforçar FSD/ESLint como paved road.

## Partially applicable

- Matriz de decisão tecnológica em geral.

## Not applicable

- Adotar Flutter ou abandonar RN.

# Related internal decisions

- (nenhuma KB-DEC nova — FSD já é norma N1/N3)

# Related playbooks

- (architecture via agent-context)

# Review notes

- Review status: APPROVED_FOR_REFERENCE
- Reviewed by: KB Onda 2
- Conditions: Case — princípio paved road; **explicitamente não-transferível**: Flutter como destino.
