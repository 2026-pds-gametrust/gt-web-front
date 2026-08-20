# Knowledge Base Changelog

## 2026-08-07 — Adaptação frontend-web

### Added

- Agent-context: `agt-web-architecture`, `agt-web-qa`, `agt-web-release`.
- Contrato de paridade: `docs/design-system/paridade-visual.md` (Web + iOS + Android).

### Updated

- `KB-DEC-002`, `PRINCIPLE-A11Y-01` — gate e paridade incluem canal web.
- Agent-context: `agt-accessibility`, `agt-persona-simulator`, `agt-ui-ux-auditor`.
- Specs `_templates/*` — owners `agt-web-*`, browsers, Core Web Vitals, deploy web.
- Personas transversais `baixa-visao`, `conexao-instavel` — desktop/mobile web.

### Removed (norma de implementação neste repo)

- Agent-context mobile/RN: `agt-mobile-architecture`, `agt-mobile-qa`, `agt-mobile-release`.
- Doc `paridade-visual-mobile.md` (substituído por `paridade-visual.md`).

## 2026-07-16 — Onda 2

### Added

- Sources: `SRC-RN-TEST-001`, `SRC-MELI-A11Y-PROG-001`, `SRC-MELI-A11Y-LESSONS-001`, `SRC-IFOOD-A11Y-TEST-001`, `SRC-IFOOD-A11Y-IOS-001`, `SRC-NUBANK-MULTI-001`, `SRC-IFOOD-CAR-001`, `SRC-IFOOD-DETAILS-001`, `SRC-NUBANK-CANON-001`, `SRC-SHOPIFY-BFCM-001`.
- Pasta `sources/shopify/`.
- Agent-context: `agt-mobile-qa`, `agt-mobile-release` (histórico; substituídos no web).

### Updated

- `index.yml` com as 10 fontes e novos agent-contexts.
- Agent-context a11y / ui-ux / architecture (recommended cases).
- `fontes-pesquisa-agents-mobile-ui-ux.md` — marcadores `curada: SRC-...` nas entradas da Onda 2.

## 2026-07-16 — Fundação

### Added

- Fundação da base (`README.md`, `index.yml`, `_templates/`, pastas).
- Decisions: `KB-DEC-001`, `KB-DEC-002`, `KB-DEC-003`.
- Principles: `PRINCIPLE-DS-01`, `PRINCIPLE-A11Y-01`, `PRINCIPLE-UX-01`, `PRINCIPLE-RESEARCH-01`.
- Sources seed (normas + cases): `SRC-W3C-001`, `SRC-RN-A11Y-001`, `SRC-APPLE-HIG-001`, `SRC-MATERIAL-001`, `SRC-NUBANK-001`, `SRC-MELI-A11Y-ANDROID-001`, `SRC-MELI-A11Y-IOS-001`, `SRC-IFOOD-TOKENS-001`.
- Digest: `digests/accessibility/platform-parity-a11y.md`.
- Playbooks: `ui-ux-audit`, `accessibility-audit`, `persona-simulation`, `critical-journey-review`.
- Agent-context: `agt-ui-ux-auditor`, `agt-accessibility`, `agt-persona-simulator`, `agt-mobile-architecture`.
