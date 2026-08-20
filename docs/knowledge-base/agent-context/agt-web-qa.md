# Knowledge Context — agt-web-qa

## Mandatory internal sources

- `docs/specs/<feature-slug>/test-plan.md` / `qa-report.md`
- `AGENTS.md` (gates APP_EXECUTION)
- `docs/journeys/`
- `docs/personas/` + playbook
- `KB-DEC-002` quando a11y for gate

## Normative / official technology

- Jest + Testing Library
- Playwright
- `SRC-W3C-001` para critérios a11y em QA

## Recommended market cases (max 3)

- `SRC-IFOOD-A11Y-TEST-001` — testes a11y (analogia)
- Cases Melí a11y — lições de mercado, não checklist nativo

## Retrieval rules

1. Não aprovar só com inspeção estática se o gate exigir runtime.
2. Cobrir Chrome no mínimo; expandir browsers/mobile web por risco.
3. Registrar evidências (comandos, screenshots, traces Playwright).
