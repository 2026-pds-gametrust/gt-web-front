---
id: PLAYBOOK-UI-UX-AUDIT
title: UI/UX audit
status: APPROVED
owner: Mobile Engineering
relevantAgents:
  - agt-ui-ux-auditor
relatedSkill: mobile-ui-ux-audit
relatedArtifact: docs/specs/_templates/ui-ux-audit.md
---

# Playbook — UI/UX audit

## Objetivo

Avaliar a interface **em execução**: compreensão, hierarquia, formulários, feedback, navegação, estados e coerência FSD de UI.

## Entrada

- Feature slug / jornada (`docs/journeys/` quando existir).
- Personas relevantes (`docs/personas/`).
- Requirements (se houver).
- App em execução (bundler + emulador/dispositivo).

## Etapas

1. Consultar `docs/knowledge-base/agent-context/agt-ui-ux-auditor.md` e filtrar `index.yml`.
2. Abrir o app e navegar até o fluxo.
3. Observar → interagir → quebrar (erro, offline, teclado, fonte ampliada) → recuperar.
4. Verificar estados: initial, loading, success, empty, validation_error, server_error, offline, timeout, retrying.
5. Classificar findings (`UX_BLOCKER` … `UX_OPPORTUNITY`).
6. Registrar evidências e personas afetadas.
7. Escrever `docs/specs/<feature-slug>/ui-ux-audit.md`.

## Checklist

- [ ] Título e próximo passo claros; linguagem simples.
- [ ] Uma ação principal; hierarquia coerente.
- [ ] Labels persistentes; erro perto do campo; dados preservados; CTA com teclado aberto.
- [ ] Feedback de toque; loading bloqueia double submit; sucesso explícito; retry em timeout.
- [ ] Voltar preserva contexto; modais fecháveis.
- [ ] Contraste, tipografia, spacing, safe area, fonte ampliada (tokens: `KB-DEC-001`).
- [ ] Sem “cara de IA” (cards/gradientes/ícones decorativos excessivos).

## Critérios

- **PASS:** sem `UX_BLOCKER`; blockers duros ausentes.
- **CHANGES_REQUESTED / Rejected:** double submit, sem feedback após erro, loading infinito, erro cru.
- **BLOCKED:** ambiente de execução indisponível.

## Evidências

Screenshots, gravação, logs, jornada executada, plataformas.

## Resultado

Artefato `ui-ux-audit.md` + seção `Knowledge sources used`.

## Bloqueios

Sem app em execução → `BLOCKED` (nunca aprovar só por código/screenshot).

## Handoff

PO / Developer / Accessibility conforme findings; skill `mobile-ui-ux-audit`.
