---
id: PLAYBOOK-CRITICAL-JOURNEY
title: Critical journey review
status: APPROVED
owner: Mobile Engineering
relevantAgents:
  - agt-web-qa
  - agt-ui-ux-auditor
  - agt-accessibility
  - agt-persona-simulator
relatedSkill: mobile-quality-assurance
relatedArtifact: docs/specs/_templates/qa-report.md
---

# Playbook — Critical journey review

## Objetivo

Revisar jornadas críticas documentadas em `docs/journeys/` (e correlatas) com foco em conclusão, resiliência, a11y gate e regressão exploratória.

## Entrada

- Jornada em `docs/journeys/` (ex.: login, signup, app-loading).
- Requirements / test-plan se existirem.
- App em execução.
- Personas afetadas.

## Etapas

1. Selecionar jornada e critérios de sucesso do arquivo da jornada.
2. Executar caminho feliz.
3. Forçar falhas: rede, timeout, validação, interrupção, teclado, fonte ampliada.
4. Se fluxo for gate a11y (`KB-DEC-002`), acionar playbook `accessibility-audit.md`.
5. Opcional: uma persona de alto risco (`dona-maria`, `conexao-instavel`, `baixa-visao`).
6. Registrar evidências e severidade.
7. Atualizar `qa-report.md` / test-plan conforme modo QA (VERIFY / EXPLORATORY).

## Checklist

- [ ] Critérios da jornada cobertos.
- [ ] Estados de erro/offline/retry exercitados.
- [ ] Double submit / idempotência considerados.
- [ ] Gate a11y se aplicável.
- [ ] Fontes KB citadas (decisões + normas).

## Critérios

- Conforme política QA do agent (`APPROVED` / falhas / `BLOCKED`).
- Inspeção estática sozinha não fecha jornada crítica.

## Evidências

Passos, plataforma, logs, screenshots.

## Resultado

Artefato QA + referências a ui-ux / a11y / persona se acionados.

## Bloqueios

Ambiente indisponível; jornada não documentada e sem AC claros.

## Handoff

`agt-web-qa` (modo EXPLORATORY/VERIFY); Release se gate falhar.
