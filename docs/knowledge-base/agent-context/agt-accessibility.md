# Knowledge Context — agt-accessibility

## Mandatory internal sources

- `KB-DEC-002`
- `PRINCIPLE-A11Y-01`
- `docs/personas/baixa-visao.md`
- `.cursor/rules/rule.a11y-web.mdc`
- Template `docs/specs/_templates/accessibility-report.md`

## Normative / official technology

- `SRC-W3C-001` (WCAG / WAI) — norma primária web
- HIG / Material / Melí cases — referência de mercado / paridade com nativos, não implementação web

## Retrieval rules

1. Validar no browser em execução (teclado + AT quando possível).
2. Sem runtime → `BLOCKED`, nunca APPROVED só estático.
3. PASS web ≠ PASS iOS/Android automático.
