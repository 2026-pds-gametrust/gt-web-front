---
id: PRINCIPLE-A11Y-01
title: Intenção acessível equivalente entre canais
status: APPROVED
version: 1.1.0
owner: Web Engineering
topics:
  - accessibility
  - web
  - platform-parity
relevantAgents:
  - agt-accessibility
  - agt-web-qa
  - agt-web-react-developer
approvedAt: 2026-07-16
---

# PRINCIPLE-A11Y-01 — Intenção acessível equivalente entre canais

Status: APPROVED

## Statement

A intenção acessível (o que o usuário precisa perceber e fazer) deve ser equivalente em **Web, Android e iOS**; a implementação e o comportamento do leitor de tela/teclado podem diferir e exigem validação por canal.

## Evidence

- `KB-DEC-002`
- `SRC-W3C-001`
- Cases Melí iOS/Android (referência de mercado, não norma web)

## Implications

- PASS em um canal ≠ PASS automático nos outros.
- Componentes e fluxos críticos precisam de semântica testada no canal sob entrega.
- Agents reportam gaps de paridade como findings, não como “já validado no outro canal”.

## Exceptions

Fluxos exclusivos de um canal (captura nativa de evidências, sidebar desktop) validam só o alvo relevante, documentando o escopo.

## Related decisions

- `KB-DEC-002`
