---
id: PLAYBOOK-PERSONA-SIM
title: Persona simulation
status: APPROVED
owner: Mobile Product
relevantAgents:
  - agt-persona-simulator
relatedSkill: persona-evaluation
relatedArtifact: docs/specs/_templates/persona-review.md
---

# Playbook — Persona simulation

## Objetivo

Executar jornadas aplicando as `Behavioral rules for simulation` de `docs/personas/`, registrando fricções, erros prováveis e abandono — sem teatro e sem tratar hipótese como fato (`KB-DEC-003`).

## Entrada

- Personas selecionadas nos requirements.
- Jornada (`docs/journeys/` ou descrição da feature).
- App em execução preferencialmente.

## Etapas

1. Consultar `docs/knowledge-base/agent-context/agt-persona-simulator.md`.
2. Ler o arquivo da persona (regras comportamentais + frictions).
3. Executar a jornada sob essas regras.
4. Responder às perguntas obrigatórias do agent (próximo passo, termos, CTA, erro, dados, loading, teclado, voltar, conclusão).
5. Registrar completion, friction, mistakes, trust, abandonment, recommendations.
6. Explicitar limitações da simulação (`PRINCIPLE-RESEARCH-01`).
7. Escrever `persona-review.md`.

## Checklist

- [ ] Regras da persona aplicadas (não estereótipo genérico).
- [ ] Limitações / evidence level registrados.
- [ ] Findings ligados a jornada e plataforma.
- [ ] Sem promover persona a requisito sem PO/research.

## Critérios

- Saída útil para PO/UX; não é gate de merge por si só.
- Recomendações fortes exigem evidência adicional ou norma/decisão interna.

## Evidências

Notas por persona; screenshots se runtime disponível.

## Resultado

`docs/specs/<feature-slug>/persona-review.md` + `Knowledge sources used`.

## Bloqueios

Persona ou jornada ausente → pedir input; não inventar regras comportamentais.

## Handoff

PO / UI-UX / Accessibility conforme findings; skill `persona-evaluation`.
