---
id: PRINCIPLE-UX-01
title: Feedback acionável e evidência em runtime
status: APPROVED
version: 1.0.0
owner: Mobile Engineering
topics:
  - ui-ux
  - feedback
  - resilience
relevantAgents:
  - agt-ui-ux-auditor
  - agt-web-react-developer
  - agt-web-qa
  - agt-persona-simulator
approvedAt: 2026-07-16
---

# PRINCIPLE-UX-01 — Feedback acionável e evidência em runtime

Status: APPROVED

## Statement

Toda ação do usuário deve produzir feedback claro; erros devem ser acionáveis; loading não pode ser infinito; e aprovação de UX/QA exige evidência do app em execução quando o ambiente estiver disponível.

## Evidence

- Esteira de agents (`agt-ui-ux-auditor`, `docs/changelog-reestruturacao-arquitetura-ia.md` §10)
- Checklists em `playbooks/ui-ux-audit.md`
- Personas (ex.: `dona-maria.md` — erro acionável, confirmação de conclusão)

## Implications

- Double submit sem guard, loading infinito, erro cru (stack/JSON) e ausência de feedback após erro de rede são bloqueadores.
- Inspeção estática sozinha não fecha feature de experiência.
- Estados loading / empty / error / offline / timeout / retry devem ser considerados no design e na auditoria.

## Exceptions

Quando o ambiente de execução estiver indisponível, o resultado é `BLOCKED` com motivo — não `APPROVED`.

## Related decisions

- `KB-DEC-002` (gate a11y complementar)
- `KB-DEC-003` (limites de simulação por persona)
