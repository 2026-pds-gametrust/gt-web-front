# ARCHITECTURE.md — frontend-web (GamerTrust)

Norma operacional de arquitetura. Detalhe canônico em [`Frontend_Agents.md`](Frontend_Agents.md).

## 1. Simetria Front ↔ Back

| Back-End | Front (FSD) | Responsabilidade |
|----------|-------------|------------------|
| Domain | `05-entities` | Models (`IUser`…) + UI crua de domínio |
| Service | `04-features` | Lógica, Zustand, validação, chamadas API |
| Controller | `02-pages` & `03-widgets` | Orquestração — sem regra de negócio |
| Infrastructure | `06-shared/lib/http` | Axios, interceptors, adapters |
| Configuration | `01-app` | Bootstrap, providers, routing, SDKs |

## 2. Camadas FSD

Hierarquia (só importar para baixo):

```text
01-app → 02-pages → 03-widgets → 04-features → 05-entities → 06-shared
```

| Layer | Path | Propósito |
|-------|------|-----------|
| App | `src/01-app` | Providers, routing raiz, bootstrap |
| Pages | `src/02-pages` | Telas full-screen (ex.: `home-page.tsx`) |
| Widgets | `src/03-widgets` | Blocos compostos (header, layouts) |
| Features | `src/04-features` | Casos de uso (ex.: `auth/`) |
| Entities | `src/05-entities` | Domínio (ex.: `user/`, `offer/`) |
| Shared | `src/06-shared` | UI base, HTTP, utils — **sem vocabulário de negócio** |

### Segmentos típicos de slice

- `ui/` — componentes React
- `model/` — Zustand stores, hooks de estado
- `api/` — mapeamento de endpoints (usa `httpClient` do shared)
- `lib/` — helpers locais do slice (quando necessário)

## 3. Naming

| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| Interface de domínio | `I` + PascalCase | `IUser`, `IOffer` |
| Enum | `E` + PascalCase | `ETrustLevel` (`ACTIVE`, `PENDING`) |
| Arquivos | `kebab-case.ts(x)` | `user-card.tsx`, `auth-api.ts` |
| Componentes React | PascalCase export | `export const UserCard = () => {}` |
| Constantes globais | `UPPER_SNAKE_CASE` | `API_BASE_URL` |

Alinhado ao backend para legibilidade cross-stack.

## 4. Estado e HTTP

- **Zustand** para estado global de features (`model/`).
- **Axios** apenas via `httpClient` em `src/06-shared/lib/http`.
- Pages/widgets **não** importam `axios` nem montam clients.
- Terceiros (Analytics, Logs, Maps) via **Adapter** em Shared.

## 5. Testes

| Tipo | Extensão | Onde |
|------|----------|------|
| Unit | `*.test.ts(x)` | Co-localizado ao arquivo |
| Integração de slice | `*.spec.ts(x)` | `__tests__/` na raiz do slice |
| E2E | Playwright | `e2e/` (fora de `src/`) |

Meta: cobertura ≥ 80% (`yarn test:coverage`).

```text
src/04-features/auth/
 ├── __tests__/
 │   └── login-flow.spec.tsx
 ├── model/
 │   ├── use-auth-store.ts
 │   └── use-auth-store.test.ts
```

## 6. Comandos

| Comando | Propósito |
|---------|-----------|
| `yarn dev` | Dev server Vite |
| `yarn build` | Build de produção |
| `yarn test:unit` | Jest unit (`*.test.*`) |
| `yarn test:integration` | Jest integration (`*.spec.*`) |
| `yarn test:coverage` | Coverage |
| `yarn test:e2e` | Playwright |
| `yarn lint` / `yarn lint:fix` | ESLint |
| `yarn format` | Prettier |

## 7. Checklist de contribuição

1. **SoC FSD** — sem axios em Pages; lógica em Features; Shared sem domínio.
2. **Tipagem** — contratos de API espelham Domain do backend (`I*`).
3. **Adapters** — vendors em Shared via Adapter.
4. **Qualidade** — testes ao adicionar lógica; não quebrar stores Zustand.
5. **Produto** — personas, paridade semântica, IA não inventa (ver `AGENTS.md`).

## 8. Path aliases

| Alias | Resolve para |
|-------|----------------|
| `@app/*` | `src/01-app/*` |
| `@pages/*` | `src/02-pages/*` |
| `@widgets/*` | `src/03-widgets/*` |
| `@features/*` | `src/04-features/*` |
| `@entities/*` | `src/05-entities/*` |
| `@shared/*` | `src/06-shared/*` |
