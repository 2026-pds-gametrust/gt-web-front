# Knowledge Context — agt-web-release

## Mandatory internal sources

- `docs/specs/<feature-slug>/release-report.md`
- `AGENTS.md`
- Scripts: `yarn build`, `yarn lint`, `yarn test:unit`, `yarn test:e2e`
- Variáveis `.env.example`

## Normative / official technology

- Pipeline CI/CD do projeto (quando existir)
- Checklist de smoke pós-deploy

## Retrieval rules

1. Sem AAB/APK, Play Console, EAS ou Hot Updater neste repo.
2. Bloquear release se a11y crítica falhar (`KB-DEC-002`).
3. Evidência de build + smoke obrigatória.
