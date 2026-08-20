---
id: DIGEST-A11Y-001
title: Platform parity for accessibility across channels
status: APPROVED
reviewedAt: 2026-08-07
topics:
  - accessibility
  - platform-parity
  - web
relevantAgents:
  - agt-accessibility
  - agt-web-qa
  - agt-web-react-developer
relatedDecisions:
  - KB-DEC-002
relatedPrinciples:
  - PRINCIPLE-A11Y-01
---

# Digest — Paridade de acessibilidade entre canais

## Pergunta

Como garantir experiência acessível equivalente em Web, Android e iOS sem copiar implementação 1:1?

## Fontes comparadas

| ID | Papel |
|---|---|
| `SRC-W3C-001` | Norma / critérios estáveis (primária no web) |
| `SRC-APPLE-HIG-001` | Idioms iOS / VoiceOver (paridade) |
| `SRC-MATERIAL-001` | Idioms Android / touch (paridade) |
| `SRC-MELI-A11Y-ANDROID-001` | Case TalkBack (preços) — mercado |
| `SRC-MELI-A11Y-IOS-001` | Case VoiceOver (preços) — mercado |
| `SRC-RN-A11Y-001` | Histórico RN — não norma deste repo |

## Padrões que se repetem

- Nome acessível + papel semântico em controles.
- Conteúdo crítico (valores, erros, CTAs) precisa de verbalização correta.
- Design System / componentes compartilhados são o lugar certo para corrigir gaps transversais.
- Validação com teclado e leitor de tela real é indispensável em fluxos críticos.

## Onde as fontes divergem

- WCAG fala em princípios web; HIG/Material diferem em métricas de toque e tipografia.
- Melí mostra que Android e iOS exigem soluções distintas para o mesmo problema de negócio.
- O projeto busca equivalência de intenção, não clone visual.

## Transferível para frontend-web

- Gate a11y em fluxos críticos (`KB-DEC-002`).
- PASS em um canal ≠ PASS automático nos outros (`PRINCIPLE-A11Y-01`).
- Baseline web: WCAG; HIG/Material/cases só como referência de paridade/mercado.

## Decisões internas já tomadas

- `KB-DEC-002` — a11y como gate.
- `PRINCIPLE-A11Y-01` — paridade de intenção entre canais.

## Perguntas em aberto

- Nível WCAG alvo (A/AA) formalizado por produto?
- Matriz de browsers/dispositivos mínima para a11y em CI/manual?
