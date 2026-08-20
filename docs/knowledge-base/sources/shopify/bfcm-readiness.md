---
id: SRC-SHOPIFY-BFCM-001
title: BFCM Readiness 2025
company: Shopify
author: Shopify Engineering
sourceType: official-company-case
authorityLevel: N6
url: https://shopify.engineering/bfcm-readiness-2025
publishedAt: 2025-01-01
reviewedAt: 2026-07-16
status: APPROVED_FOR_REFERENCE
language: en
topics:
  - release
  - resilience
  - critical-journey
  - performance
  - quality-assurance
relevantAgents:
  - agt-web-qa
  - agt-web-performance
  - agt-web-release
---

# Context

Shopify descreve preparação para BFCM (Black Friday / Cyber Monday): jornadas críticas, bug bash, game days, latência e resiliência sob pico.

# Problem

Picos de tráfego e datas críticas expõem falhas de jornada, performance e operação que passam em “dia normal”.

# Decision

Tratar readiness de evento crítico com foco em jornadas críticas, exercícios (bug bash/game days) e resiliência/latência.

# Alternatives

Só monitorar em produção; aumentar servidores sem ensaiar falhas; adiar hardening.

# Implementation

Práticas de readiness BFCM (detalhes no artigo). Escala Shopify >> st-app-rn; princípios de jornada crítica e ensaio ainda valem.

# Validation

Evento real / práticas de engenharia Shopify.

# Results

Framework mental para release e QA sob stress.

# Trade-offs

Não temos BFCM; mas temos releases e jornadas críticas (auth, cadastro).

# Extracted principles

- Identificar e ensaiar jornadas críticas antes de release.
- Resiliência e latência fazem parte de readiness, não só features.

# Context limitations

- Escala e-commerce global.
- Infra Shopify ≠ Expo/EAS deste app.

# Transferable principles

- Playbook `critical-journey-review` + EXPLORATORY QA.
- Release checklist: observabilidade, rollback, OTA vs build nativo.

# Non-transferable practices

- Copiar playbooks de capacidade de data center Shopify.
- Assumir mesmo volume de tráfego.

# Relationship with this project

## Applicable

- QA EXPLORATORY, performance e release readiness.

## Partially applicable

- Game days formais.

## Not applicable

- “BFCM” como evento obrigatório do produto.

# Related internal decisions

- KB-DEC-002 (gates em jornadas críticas)

# Related playbooks

- playbooks/critical-journey-review.md

# Review notes

- Review status: APPROVED_FOR_REFERENCE
- Reviewed by: KB Onda 2
- Conditions: Case — readiness; adaptar à escala do st-app-rn.
