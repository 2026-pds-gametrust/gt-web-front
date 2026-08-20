---
id: KB-DEC-002
title: Accessibility as quality gate
status: APPROVED
date: 2026-07-16
owner: Web Engineering
decisionType: Quality Gate
topics:
  - accessibility
  - quality-gate
  - web
relevantAgents:
  - agt-accessibility
  - agt-web-qa
  - agt-web-release
  - agt-web-react-developer
  - agt-ui-ux-auditor
  - agt-persona-simulator
---

# KB-DEC-002 — Acessibilidade como gate

Status: APPROVED  
Date: 2026-07-16 (adaptado web 2026-08-07)  
Owner: Web Engineering  
Decision type: Quality Gate

## Context

Fluxos de autenticação, cadastro, pagamento, busca, confiança e navegação crítica têm alto impacto. Falhas de acessibilidade excluem usuários e não podem ser tratadas como “melhoria opcional”.

## Decision

Acessibilidade é **gate obrigatório** nesses fluxos. Aprovação exige validação preferencialmente no app em execução com teclado e, quando possível, leitor de tela (NVDA/JAWS/VoiceOver Safari no web; TalkBack/VoiceOver nos nativos) e zoom/fonte ampliada quando relevante.

PASS em um canal **não** implica PASS automático nos outros: a intenção acessível deve ser equivalente, mas a implementação e o comportamento do AT diferem.

Sem ambiente de execução → resultado `BLOCKED`, nunca aprovação só por inspeção estática.

## Consequences

- `agt-accessibility` produz `accessibility-report.md` com `APPROVED | CHANGES_REQUESTED | BLOCKED`.
- `agt-web-react-developer` implementa nomes acessíveis, roles, foco e anúncio de erros.
- `agt-web-qa` e `agt-web-release` podem bloquear release por falhas críticas de a11y.
- Persona `docs/personas/baixa-visao.md` orienta simulação; não substitui WCAG/docs oficiais.

## Sources

- `PRINCIPLE-A11Y-01`
- `SRC-W3C-001`
- `SRC-MELI-A11Y-ANDROID-001` / `SRC-MELI-A11Y-IOS-001` (exemplos de mercado / paridade — não norma de implementação web)
- Agent `agt-accessibility` / skill `web-accessibility`

## Non-goals

- Não define score WCAG numérico global do app nesta decisão.
- Não exige ferramenta automatizada específica além do checklist e evidência em runtime.
