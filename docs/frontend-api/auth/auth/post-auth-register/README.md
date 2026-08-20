# Register a marketplace member and issue a session

| | |
|--|--|
| **Domínio** | `auth` |
| **Tag OpenAPI** | Auth |
| **Método** | `POST` |
| **Path** | `/auth/register` |
| **Status sucesso** | `201` |
| **Autorização** | Público — sem Authorization. Discovery (Lucas) e auth register/login/refresh. |

## O que este endpoint faz

Cadastro público (Lucas/Carlos): cria User + credencial, group app-user, devolve tokens. Duplicata de email/CPF → 400 uniforme (não 409).

## Ganho no produto

Cadastro público (Lucas/Carlos): cria User + credencial, group app-user, devolve tokens. Duplicata de email/CPF → 400 uniforme (não 409).

## Como se relaciona

- `POST /auth/register` → sessão inicial
- `POST /auth/login` → sessão existente
- `POST /auth/refresh` → renovar access
- `POST /auth/logout` → encerrar sessão
- `GET /auth/me` → hidratar User
- `POST /profiles` → perfil após conta
- `POST /listings` → vender (Bearer)

Fluxo completo: [00-fluxo-conta-ate-anuncio.md](../../../00-fluxo-conta-ate-anuncio.md)

## Arquivos deste contrato

- [curl.sh](./curl.sh)
- [contrato-entrada.md](./contrato-entrada.md)
- [contrato-saida.md](./contrato-saida.md)
- [parametros.md](./parametros.md)
- [casos.md](./casos.md) — sucesso e erro
- [exemplo-uso.md](./exemplo-uso.md)
