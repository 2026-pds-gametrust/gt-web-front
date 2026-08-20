---
id: PLAYBOOK-A11Y-AUDIT
title: Accessibility audit
status: APPROVED
owner: Web Engineering
relevantAgents:
  - agt-accessibility
relatedSkill: web-accessibility
relatedArtifact: docs/specs/_templates/accessibility-report.md
---

# Playbook — Accessibility audit

## Objetivo

Validar nomes acessíveis, roles, ordem de foco, teclado, leitores de tela, zoom/fonte ampliada, contraste, área de clique e erros anunciados. Gate em fluxos críticos (`KB-DEC-002`).

## Entrada

- Feature slug / jornada crítica.
- Persona `docs/personas/baixa-visao.md` (e outras se aplicável).
- Canal alvo (desktop web / mobile web; nativos se escopo de paridade).
- App em execução com teclado/AT quando possível.

## Etapas

1. Consultar `docs/knowledge-base/agent-context/agt-accessibility.md` e `DIGEST-A11Y-001`.
2. Carregar norma primária (`SRC-W3C-001`); HIG/Material/Melí só como referência de mercado/paridade.
3. Percorrer a jornada com teclado; testar zoom; AT quando disponível.
4. Preencher checklist web.
5. Se múltiplos canais forem alvo, validar cada um — PASS em um não fecha os outros (`PRINCIPLE-A11Y-01`).
6. Escrever `accessibility-report.md`.

## Checklist

- [ ] Nome acessível em interativos; ícones nunca sem label.
- [ ] Roles / ARIA adequados.
- [ ] Ordem de foco lógica.
- [ ] Teclado completa a jornada.
- [ ] Leitor de tela (quando testado) completa a jornada.
- [ ] Zoom/fonte ampliada sem corte de CTA/conteúdo.
- [ ] Contraste; feedback não só por cor.
- [ ] Foco após erro/dialog; erros anunciados.
- [ ] Área de clique/toque ≥ 44px.

## Critérios

- **APPROVED** | **CHANGES_REQUESTED** | **BLOCKED** (sem runtime).

## Evidências

Screenshots/gravação com teclado/AT; browser e SO.

## Resultado

`docs/specs/<feature-slug>/accessibility-report.md` + `Knowledge sources used`.

## Bloqueios

Fluxo crítico sem validação runtime possível → `BLOCKED` para release gate.

## Handoff

Developer para correções; Release/QA para gate; skill `web-accessibility`.
