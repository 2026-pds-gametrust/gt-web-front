# Swap mock → API real

Use os contratos em [`docs/frontend-api/`](../frontend-api/) via clients em `src/04-features/*/api`.

Comece pelo fluxo: [`00-fluxo-conta-ate-anuncio.md`](../frontend-api/00-fluxo-conta-ate-anuncio.md). Sessão: [`02-sessao-e-tokens.md`](../frontend-api/02-sessao-e-tokens.md). Índice dos 66 endpoints: [`INDEX.md`](../frontend-api/INDEX.md).

## Env

```bash
cp .env.example .env
```

| Variável | Mock (default) | Real |
|----------|----------------|------|
| `VITE_API_MODE` | `mock` | `real` |
| `VITE_API_BASE_URL` | `http://localhost:3000` | URL do gt-backend |
| `VITE_DEV_ACCESS_TOKEN` | vazio | JWT de `POST /auth/register` ou `/auth/login` |
| `VITE_DEV_USER_ID` | `user-dev-1` | **não autentica**; identidade vem só do JWT |

## Comportamento

- Features chamam `*-api.ts`; em `mock` resolvem `mockApi`, em `real` usam `httpClient`.
- Interceptor anexa `Authorization: Bearer` (access token). **Não** enviar `x-user-id` / `x-user-groups` como identidade.
- Cadastro público = `POST /auth/register` (não `POST /users`).
- TrustScore na UI = `GET /trust-scores` + `GET /seller-levels` + `GET /trust-events` (motivos só da API).
- Selos só com status `GRANTED`.
- Logout = `POST /auth/logout` → **204** sem body; o access desta sessão deixa de valer na hora.

## Rotas novas

- `/favoritos`, `/perfil`, `/moderacao`
