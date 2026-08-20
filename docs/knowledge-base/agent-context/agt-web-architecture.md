# Knowledge Context — agt-web-architecture

## Mandatory internal sources

- `ARCHITECTURE.md`
- `Frontend_Agents.md`
- `AGENTS.md`
- `.cursor/rules/` (FSD web, naming TS, testes)
- `docs/knowledge-base/decisions/KB-DEC-001-design-tokens.md`
- `docs/knowledge-base/principles/principle-ds-01-design-system.md`
- `docs/specs/<feature-slug>/requirements.md` (e UX aprovada)

## Normative / official technology

- Documentação React, TypeScript, Vite
- `SRC-W3C-001` para requisitos técnicos de a11y no design

## Recommended market cases (max 3)

- `SRC-IFOOD-TOKENS-001` — princípio de tokens
- `SRC-NUBANK-CANON-001` — paved road / canonicidade (**não-transferível:** Flutter)
- Outros cases de arquitetura **somente** como trade-off questions — nunca para violar FSD

## Retrieval rules

1. FSD interno e decisions sempre vencem cases externos.
2. Não carregar a KB inteira; filtrar por topic `design-system` / `architecture`.
3. Case de mercado não autoriza deep import, shared com domínio ou rede em `pages`.
4. Registrar fontes em `design.md` → `## Knowledge sources used`.
5. Se um case contradisser FSD: manter FSD, registrar divergência, sugerir revisão humana.
